import { NextResponse } from 'next/server';

const AUTH_COOKIE = 'nh_auth';

function getExpectedPin() {
  return process.env.APP_LOGIN_PIN || process.env.NH_LOGIN_PIN || '123456';
}

export async function POST(req: Request) {
  const { pin } = await req.json();
  if (!pin || String(pin) !== getExpectedPin()) {
    return NextResponse.json({ error: 'PIN không đúng' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(AUTH_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}
