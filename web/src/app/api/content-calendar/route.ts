import { NextRequest, NextResponse } from 'next/server';
import { ContentItemRecord, createId, readDb, updateDb } from '@/lib/local-db';

export async function GET() {
  const db = readDb();
  const items = Object.values(db.contentItems)
    .sort((a, b) => {
      const dateA = a.scheduledAt ? new Date(a.scheduledAt).getTime() : new Date(a.createdAt).getTime();
      const dateB = b.scheduledAt ? new Date(b.scheduledAt).getTime() : new Date(b.createdAt).getTime();
      return dateA - dateB;
    });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.title || !body.content) return NextResponse.json({ error: 'Missing title/content' }, { status: 400 });

  const now = new Date().toISOString();
  const item = updateDb((db) => {
    const record: ContentItemRecord = {
      id: createId('content'),
      title: body.title,
      channel: body.channel || 'facebook',
      status: body.status || 'draft',
      scheduledAt: body.scheduledAt,
      content: body.content,
      sourceOutputId: body.sourceOutputId,
      tags: Array.isArray(body.tags) ? body.tags : [],
      createdAt: now,
      updatedAt: now,
    };
    db.contentItems[record.id] = record;
    return record;
  });

  return NextResponse.json(item);
}

export async function PUT(req: Request) {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'Missing item id' }, { status: 400 });

  const item = updateDb((db) => {
    const current = db.contentItems[body.id];
    if (!current) throw new Error('Content item not found');
    const updated = {
      ...current,
      ...body,
      tags: Array.isArray(body.tags) ? body.tags : current.tags,
      updatedAt: new Date().toISOString(),
    };
    db.contentItems[body.id] = updated;
    return updated;
  });

  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing item id' }, { status: 400 });
  updateDb((db) => {
    delete db.contentItems[id];
  });
  return NextResponse.json({ success: true });
}
