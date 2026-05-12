import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { content, imageUrl } = await req.json();

    const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
    const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!PAGE_ID || !ACCESS_TOKEN) {
      return NextResponse.json({ 
        error: "Chưa cấu hình Facebook Page ID hoặc Access Token trên Vercel." 
      }, { status: 500 });
    }

    // Nếu có hình ảnh, dùng endpoint /photos, nếu không dùng /feed
    const endpoint = imageUrl 
      ? `https://graph.facebook.com/v19.0/${PAGE_ID}/photos`
      : `https://graph.facebook.com/v19.0/${PAGE_ID}/feed`;

    const params: any = {
      access_token: ACCESS_TOKEN,
      message: content,
    };

    if (imageUrl) {
      params.url = imageUrl;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    console.log("FACEBOOK API RESPONSE:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return NextResponse.json({ 
        error: data.error?.message || "Lỗi khi đăng bài lên Facebook",
        details: data.error
      }, { status: response.status });
    }

    return NextResponse.json({ 
      success: true, 
      postId: data.id || data.post_id,
      link: `https://facebook.com/${data.id || data.post_id}`
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
