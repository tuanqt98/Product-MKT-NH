import { NextRequest, NextResponse } from 'next/server';
import {
  getAllConversations,
  getConversation,
  markAsRead,
  resumeAIForConversation,
  pauseAIForConversation,
  addMessage,
} from '@/lib/conversation-state';

/** GET: Lấy danh sách tất cả conversations hoặc 1 conversation cụ thể */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const conv = getConversation(id);
    if (!conv) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    markAsRead(id);
    return NextResponse.json(conv);
  }

  const conversations = getAllConversations();
  return NextResponse.json({ conversations });
}

/** POST: Thao tác trên conversation (gửi tin nhắn, resume AI, pause AI) */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, conversationId, message, pauseMinutes } = body;

    switch (action) {
      case 'send_message': {
        // Admin gửi tin nhắn (qua giao diện NH AI → gọi FB API)
        if (!conversationId || !message) {
          return NextResponse.json({ error: 'Missing conversationId or message' }, { status: 400 });
        }

        // Gửi tin nhắn qua Facebook
        const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || '';
        if (PAGE_ACCESS_TOKEN) {
          await fetch(
            `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                recipient: { id: conversationId },
                message: { text: message },
                messaging_type: 'RESPONSE',
              }),
            }
          );
        }

        // Lưu vào lịch sử
        const msg = addMessage(conversationId, {
          senderId: 'admin',
          text: message,
          source: 'admin',
          status: 'sent',
        });

        // Tạm dừng AI cho conversation này
        pauseAIForConversation(conversationId, pauseMinutes || 30);

        return NextResponse.json({ success: true, message: msg });
      }

      case 'approve_suggestion': {
        // Duyệt gợi ý AI → gửi cho khách
        if (!conversationId || !message) {
          return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || '';
        if (PAGE_ACCESS_TOKEN) {
          await fetch(
            `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                recipient: { id: conversationId },
                message: { text: message },
                messaging_type: 'RESPONSE',
              }),
            }
          );
        }

        addMessage(conversationId, {
          senderId: 'admin',
          text: message,
          source: 'admin',
          status: 'sent',
        });

        return NextResponse.json({ success: true });
      }

      case 'resume_ai': {
        if (!conversationId) {
          return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 });
        }
        resumeAIForConversation(conversationId);
        return NextResponse.json({ success: true });
      }

      case 'pause_ai': {
        if (!conversationId) {
          return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 });
        }
        pauseAIForConversation(conversationId, pauseMinutes || 60);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
