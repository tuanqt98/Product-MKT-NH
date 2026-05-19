/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import {
  getAllConversations,
  getConversation,
  markAsRead,
  resumeAIForConversation,
  pauseAIForConversation,
  addMessage,
  getOrCreateConversation,
  replaceConversationMessages,
  upsertConversationPatch,
} from '@/lib/conversation-state';
import { generateTextWithGeminiFallback } from '@/lib/gemini-models';

const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || '';
const PAGE_ID = process.env.FACEBOOK_PAGE_ID || '1085751274627579';

/** 
 * GET: Lấy danh sách hội thoại từ Facebook và đồng bộ với App
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!PAGE_ACCESS_TOKEN) {
    return NextResponse.json({ error: 'No PAGE_ACCESS_TOKEN' }, { status: 500 });
  }

  try {
    if (id) {
      // 1. Lấy chi tiết 1 cuộc hội thoại từ Facebook (id ở đây là Conversation ID: t_...)
      const fbConvRes = await fetch(
        `https://graph.facebook.com/v19.0/${id}?fields=messages.limit(20){message,from,created_time,id},participants&access_token=${PAGE_ACCESS_TOKEN}`
      );
      const fbConvData = await fbConvRes.json();

      if (fbConvData.error) throw new Error(fbConvData.error.message);

      // Tìm participant không phải là Page để lấy tên khách hàng
      const participant = fbConvData.participants?.data?.find((p: any) => p.id !== PAGE_ID);
      const customerName = participant?.name || `Khách #${id.slice(-4)}`;

      // Đồng bộ vào state cục bộ
      getOrCreateConversation(id, customerName);
      
      // Map tin nhắn từ FB sang format của App
      const formattedMessages = (fbConvData.messages?.data || []).reverse().map((m: any) => ({
        id: m.id,
        senderId: m.from.id,
        text: m.message,
        timestamp: m.created_time,
        source: m.from.id === PAGE_ID ? 'ai' : 'customer',
        status: 'sent'
      }));

      replaceConversationMessages(id, formattedMessages);
      markAsRead(id);
      
      return NextResponse.json(getConversation(id));
    }

    // 2. Lấy danh sách tất cả hội thoại từ Facebook
    const fbListRes = await fetch(
      `https://graph.facebook.com/v19.0/${PAGE_ID}/conversations?fields=participants,updated_time,messages.limit(1){message,from,created_time}&limit=10&access_token=${PAGE_ACCESS_TOKEN}`
    );
    const fbList = await fbListRes.json();

    if (fbList.error) throw new Error(fbList.error.message);

    // Đồng bộ từng cuộc hội thoại vào state cục bộ
    for (const fbConv of fbList.data || []) {
      const participant = fbConv.participants.data.find((p: any) => p.id !== PAGE_ID);
      if (!participant) continue;

      // SỬ DỤNG CONVERSATION ID (fbConv.id) LÀM KHÓA CHÍNH
      getOrCreateConversation(fbConv.id, participant.name);
      
      // Lưu thêm PSID của khách để gửi tin nhắn sau này
      upsertConversationPatch(fbConv.id, {
        customerName: participant.name,
        customerPSID: participant.id,
        lastMessageAt: fbConv.updated_time,
      });
      
      const lastMsg = fbConv.messages?.data?.[0];
      const currentConv = getConversation(fbConv.id);
      if (lastMsg && currentConv && currentConv.messages.length === 0) {
        replaceConversationMessages(fbConv.id, [{
          id: lastMsg.id,
          senderId: lastMsg.from.id,
          text: lastMsg.message,
          timestamp: lastMsg.created_time,
          source: lastMsg.from.id === PAGE_ID ? 'ai' : 'customer',
          status: 'sent'
        }]);
      }
    }

    const conversations = getAllConversations();
    return NextResponse.json({ conversations });

  } catch (error: any) {
    console.error('[API-Conversations] Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/** 
 * POST: Gửi tin nhắn và điều khiển AI
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, conversationId, message, pauseMinutes } = body;

    if (!PAGE_ACCESS_TOKEN) return NextResponse.json({ error: 'No Token' }, { status: 500 });

    switch (action) {
      case 'send_message':
      case 'approve_suggestion': {
        if (!conversationId || !message) {
          return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        // Lấy PSID thực tế từ state (vì conversationId giờ là thread ID t_...)
        const conv = getConversation(conversationId);
        const recipientId = (conv as any)?.customerPSID || conversationId;

        // 1. Gửi sang Facebook
        const fbRes = await fetch(
          `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipient: { id: recipientId },
              message: { text: message },
              messaging_type: 'RESPONSE',
            }),
          }
        );
        
        const fbData = await fbRes.json();
        if (fbData.error) throw new Error(fbData.error.message);

        // 2. Lưu vào state cục bộ
        addMessage(conversationId, {
          senderId: PAGE_ID,
          text: message,
          source: 'admin',
          status: 'sent',
        });

        // Tạm dừng AI nếu là Admin gửi (để Admin tự chat tiếp)
        if (action === 'send_message') {
          pauseAIForConversation(conversationId, pauseMinutes || 30);
        }

        return NextResponse.json({ success: true });
      }

      case 'resume_ai':
        if (conversationId) resumeAIForConversation(conversationId);
        return NextResponse.json({ success: true });

      case 'pause_ai':
        if (conversationId) pauseAIForConversation(conversationId, pauseMinutes || 60);
        return NextResponse.json({ success: true });

      case 'analyze_conversation': {
        if (!conversationId) return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 });
        const conv = getConversation(conversationId);
        if (!conv) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        const analysis = await analyzeConversation(conv.messages.map(m => `${m.source}: ${m.text}`).join('\n'));
        const updated = upsertConversationPatch(conversationId, {
          summary: analysis.summary,
          tags: analysis.tags,
          leadScore: analysis.leadScore,
          nextAction: analysis.nextAction,
          lastAnalyzedAt: new Date().toISOString(),
        });
        return NextResponse.json({ success: true, conversation: updated });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function analyzeConversation(transcript: string): Promise<{
  summary: string;
  tags: string[];
  leadScore: number;
  nextAction: string;
}> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  if (!apiKey) {
    return {
      summary: transcript.slice(0, 280) || 'Chưa có đủ dữ liệu hội thoại.',
      tags: ['cần xem lại'],
      leadScore: 50,
      nextAction: 'Nhân sự kiểm tra hội thoại và phản hồi thủ công.',
    };
  }

  try {
    const result = await generateTextWithGeminiFallback(apiKey, `
Bạn là trợ lý CRM cho công ty in ấn Nhật Hàn. Hãy phân tích hội thoại sau và trả về JSON hợp lệ, không markdown.
Schema:
{
  "summary": "tóm tắt ngắn nhu cầu khách",
  "tags": ["tag 1", "tag 2"],
  "leadScore": 0-100,
  "nextAction": "việc nên làm tiếp theo"
}

Hội thoại:
${transcript}
`);
    const raw = result.text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);
    return {
      summary: String(parsed.summary || 'Đã phân tích hội thoại.'),
      tags: Array.isArray(parsed.tags) ? parsed.tags.map(String).slice(0, 6) : [],
      leadScore: Math.max(0, Math.min(100, Number(parsed.leadScore) || 50)),
      nextAction: String(parsed.nextAction || 'Theo dõi và phản hồi khách hàng.'),
    };
  } catch {
    return {
      summary: 'Không thể phân tích tự động, cần nhân sự xem lại hội thoại.',
      tags: ['cần xem lại'],
      leadScore: 50,
      nextAction: 'Kiểm tra nội dung hội thoại và cập nhật thủ công.',
    };
  }
}
