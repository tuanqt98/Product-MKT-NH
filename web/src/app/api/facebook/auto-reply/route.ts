import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || '';
const PAGE_ID = process.env.FACEBOOK_PAGE_ID || '1085751274627579';

// Lưu trữ ID tin nhắn đã xử lý (trong memory — reset khi deploy)
const processedMessages = new Set<string>();

/**
 * GET: Polling endpoint — Lấy tin nhắn mới từ Facebook và tự động trả lời
 * Gọi endpoint này định kỳ (mỗi 10-30 giây) để kiểm tra tin nhắn mới
 */
export async function GET(req: NextRequest) {
  if (!PAGE_ACCESS_TOKEN) {
    return NextResponse.json({ error: 'No PAGE_ACCESS_TOKEN configured' }, { status: 500 });
  }

  // Endpoint này luôn hoạt động khi được gọi (polling)
  const autoReplyMode = process.env.AUTO_REPLY_MODE || 'full';

  try {
    // 1. Lấy danh sách cuộc hội thoại gần đây (tăng limit tin nhắn lên 5)
    const convRes = await fetch(
      `https://graph.facebook.com/v19.0/${PAGE_ID}/conversations?fields=participants,updated_time,messages.limit(5){message,from,created_time,id}&limit=10&access_token=${PAGE_ACCESS_TOKEN}`
    );
    const convData = await convRes.json();

    if (convData.error) {
      console.error('[AutoReply-Poll] FB API Error:', convData.error);
      return NextResponse.json({ error: convData.error }, { status: 500 });
    }

    const results: any[] = [];
    const now = Date.now();

    for (const conv of convData.data || []) {
      const messages = conv.messages?.data || [];
      if (messages.length === 0) continue;

      // Tìm tin nhắn mới nhất từ KHÁCH HÀNG (không phải từ Page)
      const lastCustomerMsg = messages.find((m: any) => m.from?.id !== PAGE_ID);
      
      // Kiểm tra xem Page đã trả lời tin nhắn này chưa (xem có tin nhắn nào của Page sau tin nhắn này không)
      const lastPageMsgIndex = messages.findIndex((m: any) => m.from?.id === PAGE_ID);
      const lastCustMsgIndex = messages.findIndex((m: any) => m.from?.id !== PAGE_ID);

      // Nếu tin nhắn mới nhất là của Page -> Đã trả lời rồi, bỏ qua
      if (lastCustMsgIndex > lastPageMsgIndex && lastPageMsgIndex !== -1) {
        // Có tin nhắn của Page sau tin nhắn khách -> Đã trả lời
        continue;
      }
      
      if (!lastCustomerMsg) continue;

      const messageId = lastCustomerMsg.id;
      const messageText = lastCustomerMsg.message;
      const messageTime = new Date(lastCustomerMsg.created_time).getTime();

      // Bỏ qua nếu tin nhắn quá cũ (> 30 phút)
      if (now - messageTime > 30 * 60 * 1000) continue;

      // Bỏ qua nếu đã xử lý (để chắc chắn)
      if (processedMessages.has(messageId)) continue;

      console.log(`[AutoReply-Poll] Processing message from ${lastCustomerMsg.from?.name}: "${messageText}"`);

      const recipientPSID = lastCustomerMsg.from?.id;

      if (autoReplyMode === 'full' && messageText) {
        const aiResponse = await generateAIResponse(messageText);
        if (aiResponse) {
          const sendResult = await sendMessage(recipientPSID, aiResponse);
          if (sendResult.success) {
            processedMessages.add(messageId);
            results.push({ to: recipientPSID, text: messageText, reply: aiResponse });
          }
        }
      }
    }

    return NextResponse.json({
      status: 'ok',
      autoReply: true,
      mode: autoReplyMode,
      processed: results.length,
      results,
    });
  } catch (error: any) {
    console.error('[AutoReply-Poll] Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Tạo phản hồi AI sử dụng Gemini
 */
async function generateAIResponse(customerMessage: string): Promise<string | null> {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
    if (!apiKey) {
      console.error('[AI] No API key configured');
      return null;
    }

    // Đọc product context
    let productContext = '';
    const contextPaths = [
      path.join(process.cwd(), '.agents/product-marketing-context.md'),
      path.join(process.cwd(), '../.agents/product-marketing-context.md'),
    ];
    for (const p of contextPaths) {
      if (fs.existsSync(p)) {
        productContext = fs.readFileSync(p, 'utf8');
        break;
      }
    }

    const systemPrompt = `BẠN LÀ NHÂN VIÊN TƯ VẤN CỦA NHẬT HÀN — một đơn vị in ấn & bao bì chuyên nghiệp.
Bạn đang trả lời tin nhắn khách hàng trên Facebook Messenger.

QUY TẮC BẮT BUỘC:
1. Trả lời NGẮN GỌN (tối đa 3-4 câu). Đây là tin nhắn chat, KHÔNG phải email.
2. Giọng văn: Thân thiện, tận tâm, chuyên nghiệp. Xưng "mình/em" tùy ngữ cảnh.
3. Nếu khách hỏi giá → Hỏi thêm thông số (kích thước, số lượng, chất liệu) trước khi báo giá sơ bộ.
4. Nếu khách hỏi về tiến độ → Nhấn mạnh Nhật Hàn giao nhanh hơn thị trường 20-30%.
5. Nếu không chắc chắn → Đề nghị khách để lại SĐT để nhân viên kỹ thuật gọi lại tư vấn chi tiết.
6. KHÔNG dùng Markdown. Chỉ dùng text thuần và emoji vừa phải.
7. Luôn kết thúc bằng câu hỏi mở để giữ cuộc hội thoại.

THÔNG TIN CÔNG TY:
${productContext}`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
        });

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: customerMessage }] }],
        });

        const response = result.response.text();
        if (response) return response.trim();
      } catch (err: any) {
        console.error(`[AI] Model ${modelName} failed: ${err.message}`);
        continue;
      }
    }

    return null;
  } catch (error: any) {
    console.error('[AI] generateAIResponse error:', error.message);
    return null;
  }
}

/**
 * Gửi tin nhắn qua Facebook Send API
 */
async function sendMessage(recipientId: string, text: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text },
          messaging_type: 'RESPONSE',
        }),
      }
    );

    const data = await response.json();
    if (data.error) {
      console.error('[FB] Send error:', data.error);
      return { success: false, error: data.error };
    }
    return { success: true, messageId: data.message_id };
  } catch (err: any) {
    console.error('[FB] Send error:', err.message);
    return { success: false, error: err.message };
  }
}
