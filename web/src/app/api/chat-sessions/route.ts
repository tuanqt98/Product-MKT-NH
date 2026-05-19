import { NextRequest, NextResponse } from 'next/server';
import { ChatMessage, ChatSessionRecord, createId, readDb, updateDb } from '@/lib/local-db';

function toSessionSummary(session: ChatSessionRecord) {
  return {
    id: session.id,
    title: session.title,
    createdAt: session.createdAt,
    lastMessage: session.lastMessage,
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const skillId = searchParams.get('skillId');
  const sessionId = searchParams.get('sessionId');

  const db = readDb();
  if (sessionId) {
    const session = db.chatSessions[sessionId];
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    return NextResponse.json(session);
  }

  const sessions = Object.values(db.chatSessions)
    .filter((session) => !skillId || session.skillId === skillId)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map(toSessionSummary);

  return NextResponse.json({ sessions });
}

export async function POST(req: Request) {
  const body = await req.json();
  const now = Date.now();

  const session = updateDb((db) => {
    const id = body.id || createId('chat');
    const record: ChatSessionRecord = {
      id,
      skillId: body.skillId,
      title: body.title || `Hội thoại mới ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
      createdAt: body.createdAt || now,
      updatedAt: now,
      lastMessage: body.lastMessage || '',
      messagesA: body.messagesA || [],
      messagesB: body.messagesB || [],
    };
    db.chatSessions[id] = record;
    return record;
  });

  return NextResponse.json(session);
}

export async function PUT(req: Request) {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'Missing session id' }, { status: 400 });

  const session = updateDb((db) => {
    const current = db.chatSessions[body.id];
    if (!current) throw new Error('Session not found');

    const messagesA = (body.messagesA || current.messagesA || []) as ChatMessage[];
    const messagesB = (body.messagesB || current.messagesB || []) as ChatMessage[];
    const lastAssistant = [...messagesA].reverse().find((message) => message.role === 'assistant');
    const lastMessage = body.lastMessage || lastAssistant?.content || messagesA[messagesA.length - 1]?.content || current.lastMessage || '';

    const updated: ChatSessionRecord = {
      ...current,
      title: body.title || current.title,
      updatedAt: Date.now(),
      lastMessage,
      messagesA,
      messagesB,
    };
    db.chatSessions[body.id] = updated;
    return updated;
  });

  return NextResponse.json(session);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  if (!sessionId) return NextResponse.json({ error: 'Missing session id' }, { status: 400 });

  updateDb((db) => {
    delete db.chatSessions[sessionId];
  });

  return NextResponse.json({ success: true });
}
