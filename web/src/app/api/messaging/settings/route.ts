import { NextRequest, NextResponse } from 'next/server';
import { getConfig, saveConfig } from '@/lib/auto-reply-config';

/** GET: Lấy cấu hình hiện tại */
export async function GET() {
  const config = getConfig();
  return NextResponse.json(config);
}

/** POST: Cập nhật cấu hình */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = saveConfig(body);
    return NextResponse.json({ success: true, config: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
