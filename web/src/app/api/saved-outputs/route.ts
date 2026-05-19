import { NextRequest, NextResponse } from 'next/server';
import { createId, readDb, SavedOutputRecord, updateDb } from '@/lib/local-db';

function inferType(skillId?: string): SavedOutputRecord['type'] {
  if (!skillId) return 'other';
  if (skillId.includes('script') || skillId.includes('video')) return 'script';
  if (skillId.includes('copy') || skillId.includes('quang-cao')) return 'copy';
  if (skillId.includes('bao-cao') || skillId.includes('report')) return 'report';
  if (skillId.includes('brief')) return 'brief';
  if (skillId.includes('ke-hoach') || skillId.includes('strategy')) return 'plan';
  return 'other';
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get('tag');
  const db = readDb();
  const outputs = Object.values(db.savedOutputs)
    .filter((output) => !tag || output.tags.includes(tag))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return NextResponse.json({ outputs });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.content) return NextResponse.json({ error: 'Missing content' }, { status: 400 });

  const now = new Date().toISOString();
  const output = updateDb((db) => {
    const record: SavedOutputRecord = {
      id: createId('out'),
      title: body.title || `Output ${new Date().toLocaleString('vi-VN')}`,
      skillId: body.skillId,
      sessionId: body.sessionId,
      content: body.content,
      tags: Array.isArray(body.tags) ? body.tags : [],
      type: body.type || inferType(body.skillId),
      createdAt: now,
      updatedAt: now,
    };
    db.savedOutputs[record.id] = record;
    return record;
  });

  return NextResponse.json(output);
}

export async function PUT(req: Request) {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'Missing output id' }, { status: 400 });

  const output = updateDb((db) => {
    const current = db.savedOutputs[body.id];
    if (!current) throw new Error('Output not found');
    const updated = {
      ...current,
      ...body,
      tags: Array.isArray(body.tags) ? body.tags : current.tags,
      updatedAt: new Date().toISOString(),
    };
    db.savedOutputs[body.id] = updated;
    return updated;
  });

  return NextResponse.json(output);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing output id' }, { status: 400 });
  updateDb((db) => {
    delete db.savedOutputs[id];
  });
  return NextResponse.json({ success: true });
}
