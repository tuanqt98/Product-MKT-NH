import { NextResponse } from 'next/server';
import { addIntegrationLog } from '@/lib/local-db';
import { generateTextWithGeminiFallback } from '@/lib/gemini-models';

export const dynamic = 'force-dynamic';

async function checkGemini() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  if (!apiKey) {
    return { configured: false, connected: false, message: 'Thiếu GOOGLE_GENERATIVE_AI_API_KEY' };
  }

  try {
    const result = await generateTextWithGeminiFallback(apiKey, 'Reply with OK only.');
    const text = result.text;
    return {
      configured: true,
      connected: Boolean(text),
      message: Boolean(text) ? `Gemini hoạt động (${result.modelName})` : 'Gemini không trả nội dung',
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gemini health check failed';
    addIntegrationLog({ service: 'gemini', level: 'error', message });
    return { configured: true, connected: false, message };
  }
}

async function checkFacebook() {
  const pageId = process.env.FACEBOOK_PAGE_ID?.trim();
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();

  if (!pageId || !token) {
    return {
      configured: false,
      connected: false,
      message: 'Thiếu FACEBOOK_PAGE_ID hoặc FACEBOOK_PAGE_ACCESS_TOKEN',
      page: null,
    };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${pageId}?fields=id,name,fan_count,followers_count&access_token=${token}`,
      { cache: 'no-store' }
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    return {
      configured: true,
      connected: true,
      message: 'Facebook Page hoạt động',
      page: {
        id: data.id,
        name: data.name,
        fans: data.fan_count || 0,
        followers: data.followers_count || 0,
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Facebook health check failed';
    addIntegrationLog({ service: 'facebook', level: 'error', message });
    return { configured: true, connected: false, message, page: null };
  }
}

export async function GET() {
  const [gemini, facebook] = await Promise.all([checkGemini(), checkFacebook()]);

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    env: {
      GOOGLE_GENERATIVE_AI_API_KEY: Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY),
      FACEBOOK_PAGE_ID: Boolean(process.env.FACEBOOK_PAGE_ID),
      FACEBOOK_PAGE_ACCESS_TOKEN: Boolean(process.env.FACEBOOK_PAGE_ACCESS_TOKEN),
      APP_LOGIN_PIN: Boolean(process.env.APP_LOGIN_PIN || process.env.NH_LOGIN_PIN),
    },
    gemini,
    facebook,
  });
}
