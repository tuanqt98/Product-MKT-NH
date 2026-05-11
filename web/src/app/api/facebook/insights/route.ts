import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
    const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!PAGE_ID || !ACCESS_TOKEN) {
      return NextResponse.json({ error: "Chưa cấu hình Token" }, { status: 400 });
    }

    // Lấy dữ liệu Insights trong 7 ngày qua
    // Các metric phổ biến: 
    // - page_impressions_unique (Reach)
    // - page_post_engagements (Engagement)
    const url = `https://graph.facebook.com/v19.0/${PAGE_ID}/insights?metric=page_impressions_unique,page_post_engagements&period=day&access_token=${ACCESS_TOKEN}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Lỗi API Facebook");
    }

    // Format lại dữ liệu cho Recharts
    // Ở đây chúng ta sẽ map dữ liệu từ Facebook sang format { name: 'Thứ...', reach: ..., engagement: ... }
    const formattedData = data.data[0].values.map((item: any, index: number) => {
      const date = new Date(item.end_time);
      const dayName = date.toLocaleDateString('vi-VN', { weekday: 'short' });
      
      return {
        name: dayName,
        reach: item.value,
        engagement: data.data[1].values[index].value,
        clicks: Math.floor(item.value * 0.02) // Giả lập click dựa trên reach nếu chưa có Ads API
      };
    });

    return NextResponse.json(formattedData);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
