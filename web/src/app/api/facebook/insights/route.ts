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

    // Lấy dữ liệu Insights trong 7 ngày qua với nhiều chỉ số hơn
    const metrics = [
      'page_impressions_unique', // Reach
      'page_post_engagements',   // Engagement
      'page_views_total',        // Page Views
      'page_fan_adds_unique'     // New Fans
    ].join(',');

    const insightsUrl = `https://graph.facebook.com/v19.0/${PAGE_ID}/insights?metric=${metrics}&period=day&access_token=${ACCESS_TOKEN}`;
    const insightsRes = await fetch(insightsUrl);
    const insightsData = await insightsRes.json();

    // Lấy danh sách bài viết gần đây
    const postsUrl = `https://graph.facebook.com/v19.0/${PAGE_ID}/posts?fields=message,created_time,likes.summary(true),comments.summary(true),shares,insights.metric(post_impressions_unique,post_engaged_users)&limit=10&access_token=${ACCESS_TOKEN}`;
    const postsRes = await fetch(postsUrl);
    const postsData = await postsRes.json();

    // Xử lý insights data
    let chartData = null;
    let stats = {
      reach: 0,
      engagement: 0,
      views: 0,
      newFans: 0
    };

    if (insightsData.data && insightsData.data.length > 0) {
      const getMetric = (name: string) => insightsData.data.find((m: any) => m.name === name)?.values || [];
      const reachValues = getMetric('page_impressions_unique');
      const engageValues = getMetric('page_post_engagements');
      const viewValues = getMetric('page_views_total');
      const fanValues = getMetric('page_fan_adds_unique');

      if (reachValues.length > 0) {
        chartData = reachValues.map((item: any, index: number) => {
          const date = new Date(item.end_time);
          return {
            name: date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' }),
            reach: item.value,
            engagement: engageValues[index]?.value || 0,
            views: viewValues[index]?.value || 0,
            fans: fanValues[index]?.value || 0
          };
        });

        // Tính tổng stats trong 7 ngày
        stats = {
          reach: reachValues.reduce((a: number, b: any) => a + b.value, 0),
          engagement: engageValues.reduce((a: number, b: any) => a + (b.value || 0), 0),
          views: viewValues.reduce((a: number, b: any) => a + (b.value || 0), 0),
          newFans: fanValues.reduce((a: number, b: any) => a + (b.value || 0), 0)
        };
      }
    }

    // Xử lý bài viết chi tiết hơn (có reach từng bài)
    const recentPosts = postsData.data?.map((post: any) => ({
      id: post.id,
      message: post.message?.substring(0, 100) || "(Bài không có text)",
      created_time: post.created_time,
      likes: post.likes?.summary?.total_count || 0,
      comments: post.comments?.summary?.total_count || 0,
      shares: post.shares?.count || 0,
      reach: post.insights?.data?.find((i: any) => i.name === 'post_impressions_unique')?.values?.[0]?.value || 0
    })) || [];

    return NextResponse.json({
      connected: true,
      page: {
        name: pageInfo.name || "Không xác định",
        id: pageInfo.id,
        fans: pageInfo.fan_count || 0,
        followers: pageInfo.followers_count || 0,
      },
      stats,
      chartData,
      recentPosts,
      hasInsights: chartData !== null,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message, connected: false }, { status: 500 });
  }
}
