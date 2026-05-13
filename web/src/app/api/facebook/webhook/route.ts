import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getConfig, isWithinActiveHours } from '@/lib/auto-reply-config';
import {
  getOrCreateConversation,
  addMessage,
  pauseAIForConversation,
  isAIAllowedForConversation,
} from '@/lib/conversation-state';

// Meta Verification Token
const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'NH_MARKETING_AI_SECRET';
const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || '';

/**
 * GET: Facebook Webhook Verification
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('[Webhook] VERIFIED ✅');
      return new NextResponse(challenge, { status: 200 });
    }
    return new NextResponse('Forbidden', { status: 403 });
  }
  return new NextResponse('Bad Request', { status: 400 });
}

/**
 * POST: Nhận tin nhắn từ Facebook Messenger
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.object !== 'page') {
      return new NextResponse('Not Found', { status: 404 });
    }

    const config = getConfig();

    for (const entry of body.entry) {
      if (!entry.messaging) continue;

      for (const event of entry.messaging) {
        const senderId = event.sender?.id;
        const recipientId = event.recipient?.id;

        if (!senderId) continue;

        // ─── HANDOVER: Admin gửi tin nhắn → Tạm dừng AI ───
        if (event.message?.is_echo) {
          console.log(`[Handover] Admin replied to ${recipientId}. Pausing AI ${config.pauseDurationMinutes}m.`);
          
          // Lưu tin nhắn admin vào lịch sử
          getOrCreateConversation(recipientId);
          addMessage(recipientId, {
            senderId: senderId,
            text: event.message.text || '[Media]',
            source: 'admin',
            status: 'sent',
          });

          // Tạm dừng AI cho conversation này
          pauseAIForConversation(recipientId, config.pauseDurationMinutes);
          continue;
        }

        // ─── Tin nhắn từ khách hàng ───
        if (event.message && !event.message.is_echo) {
          const messageText = event.message.text || '';
          console.log(`[Inbox] Message from ${senderId}: "${messageText}"`);

          // Lưu conversation + tin nhắn
          getOrCreateConversation(senderId);
          addMessage(senderId, {
            senderId: senderId,
            text: messageText,
            source: 'customer',
            status: 'sent',
          });

          // ─── Kiểm tra các điều kiện để AI trả lời ───
          
          // 1. AI có được bật không?
          if (!config.enabled) {
            console.log('[AutoReply] Disabled. Skipping.');
            continue;
          }

          // 2. Có trong khung giờ hoạt động không?
          if (!isWithinActiveHours(config)) {
            console.log('[AutoReply] Outside active hours. Skipping.');
            continue;
          }

          // 3. Conversation có đang bị pause (người thật đang xử lý) không?
          if (!isAIAllowedForConversation(senderId)) {
            console.log(`[AutoReply] Conversation ${senderId} is paused (human handling). Skipping.`);
            continue;
          }

          // ─── Tạo câu trả lời bằng Gemini AI ───
          const aiResponse = await generateAIResponse(messageText, senderId);

          if (!aiResponse) {
            console.error('[AutoReply] AI failed to generate response.');
            continue;
          }

          if (config.mode === 'full') {
            // Chế độ Full-Auto: Gửi tin nhắn trực tiếp
            await sendFacebookMessage(senderId, aiResponse);
            addMessage(senderId, {
              senderId: 'ai',
              text: aiResponse,
              source: 'ai',
              status: 'sent',
            });
            console.log(`[AutoReply] Sent AI response to ${senderId}`);
          } else {
            // Chế độ Co-pilot: Lưu gợi ý, chờ admin duyệt
            addMessage(senderId, {
              senderId: 'ai',
              text: aiResponse,
              source: 'ai',
              status: 'suggested',
              aiSuggestion: aiResponse,
            });
            console.log(`[AutoReply] AI suggestion saved for ${senderId} (Co-pilot mode)`);
          }
        }
      }
    }

    return new NextResponse('EVENT_RECEIVED', { status: 200 });
  } catch (error: any) {
    console.error('[Webhook] Error:', error.message);
    return new NextResponse('EVENT_RECEIVED', { status: 200 }); // Always return 200 to Facebook
  }
}

/**
 * Tạo phản hồi AI sử dụng Gemini, kèm ngữ cảnh Nhật Hàn
 */
async function generateAIResponse(customerMessage: string, senderId: string): Promise<string | null> {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
    if (!apiKey) {
      console.error('[AI] No API key configured');
      return null;
    }

    // Đọc product context
    const contextPath = fs.existsSync(path.join(process.cwd(), '.agents/product-marketing-context.md'))
      ? path.join(process.cwd(), '.agents/product-marketing-context.md')
      : path.join(process.cwd(), '../.agents/product-marketing-context.md');
    const productContext = fs.existsSync(contextPath) ? fs.readFileSync(contextPath, 'utf8') : '';

    const config = getConfig();

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
${productContext}

TIN NHẮN CHÀO MỪNG MẪU: ${config.greeting}`;

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
 * Gửi tin nhắn qua Facebook Graph API
 */
async function sendFacebookMessage(recipientId: string, messageText: string) {
  if (!PAGE_ACCESS_TOKEN) {
    console.error('[FB] No PAGE_ACCESS_TOKEN configured');
    return;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: messageText },
          messaging_type: 'RESPONSE',
        }),
      }
    );

    const data = await response.json();
    if (data.error) {
      console.error('[FB] Send message error:', data.error);
    } else {
      console.log(`[FB] Message sent to ${recipientId} ✅`);
    }
  } catch (err: any) {
    console.error('[FB] sendFacebookMessage error:', err.message);
  }
}
