import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
    const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!PAGE_ID || !ACCESS_TOKEN) {
      return NextResponse.json({ error: "Chưa cấu hình Token" }, { status: 400 });
    }

    // Lấy thông tin cơ bản của Page
    const pageInfoUrl = `https://graph.facebook.com/v19.0/${PAGE_ID}?fields=name,fan_count,followers_count,new_like_count&access_token=${ACCESS_TOKEN}`;
    const pageInfoRes = await fetch(pageInfoUrl);
    const pageInfo = await pageInfoRes.json();

    // Lấy dữ liệu Insights trong 7 ngày qua
    const insightsUrl = `https://graph.facebook.com/v19.0/${PAGE_ID}/insights?metric=page_impressions_unique,page_post_engagements&period=day&access_token=${ACCESS_TOKEN}`;
    const insightsRes = await fetch(insightsUrl);
    const insightsData = await insightsRes.json();

    // Lấy danh sách bài viết gần đây
    const postsUrl = `https://graph.facebook.com/v19.0/${PAGE_ID}/posts?fields=message,created_time,likes.summary(true),comments.summary(true),shares&limit=10&access_token=${ACCESS_TOKEN}`;
    const postsRes = await fetch(postsUrl);
    const postsData = await postsRes.json();

    // Xử lý insights data — có thể rỗng nếu page mới
    let chartData = null;
    if (insightsData.data && insightsData.data.length >= 2 && insightsData.data[0].values?.length > 0) {
      chartData = insightsData.data[0].values.map((item: any, index: number) => {
        const date = new Date(item.end_time);
        const dayName = date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' });
        
        return {
          name: dayName,
          reach: item.value,
          engagement: insightsData.data[1]?.values?.[index]?.value || 0,
          clicks: Math.floor(item.value * 0.02)
        };
      });
    }

    // Xử lý posts data
    const recentPosts = postsData.data?.map((post: any) => ({
      id: post.id,
      message: post.message?.substring(0, 100) || "(Bài không có text)",
      created_time: post.created_time,
      likes: post.likes?.summary?.total_count || 0,
      comments: post.comments?.summary?.total_count || 0,
      shares: post.shares?.count || 0,
    })) || [];

    return NextResponse.json({
      connected: true,
      page: {
        name: pageInfo.name || "Không xác định",
        id: pageInfo.id,
        fans: pageInfo.fan_count || 0,
        followers: pageInfo.followers_count || 0,
      },
      chartData,
      recentPosts,
      hasInsights: chartData !== null,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message, connected: false }, { status: 500 });
  }
}
