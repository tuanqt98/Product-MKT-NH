import { NextResponse } from 'next/server';

export async function GET() {
  const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
  const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!PAGE_ID || !ACCESS_TOKEN) {
    return NextResponse.json({ error: 'Missing Facebook configuration' }, { status: 500 });
  }

  try {
    // 1. Lấy thông tin cơ bản của Page
    const pageResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}?fields=name,followers_count,fan_count&access_token=${ACCESS_TOKEN}`
    );
    const pageData = await pageResponse.json();

    // 2. Lấy 3 bài viết gần đây nhất
    const postsResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}/posts?fields=message,created_time,insights.metric(post_impressions_unique,post_engagements,post_reactions_by_type_total)&limit=3&access_token=${ACCESS_TOKEN}`
    );
    const postsData = await postsResponse.json();

    // 3. Lấy Insights theo NGÀY (period=day) để lấy dữ liệu mới nhất
    const metrics = [
      'page_views_total',
      'page_impressions_unique',
      'page_post_engagements',
      'page_fan_adds_unique'
    ].join(',');

    // Lấy dữ liệu 7 ngày gần nhất để tính tổng và vẽ chart
    const insightsResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}/insights?metric=${metrics}&period=day&access_token=${ACCESS_TOKEN}`
    );
    const insightsData = await insightsResponse.json();

    // Xử lý dữ liệu Insights (Tổng hợp 7 ngày gần nhất)
    const stats: any = {
      page_views_total: 0,
      page_impressions_unique: 0,
      page_post_engagements: 0,
      page_fan_adds_unique: 0
    };

    if (insightsData.data) {
      insightsData.data.forEach((item: any) => {
        // Cộng dồn giá trị của 7 ngày gần nhất
        const total = item.values.reduce((sum: number, v: any) => sum + (v.value || 0), 0);
        stats[item.name] = total;
      });
    }

    // Xử lý dữ liệu bài viết
    const recentPosts = (postsData.data || []).map((post: any) => {
      const insights = post.insights?.data || [];
      return {
        id: post.id,
        message: post.message || 'Bài viết không có nội dung text',
        created_time: post.created_time,
        likes: insights.find((i: any) => i.name === 'post_reactions_by_type_total')?.values[0]?.value?.like || 0,
        comments: 0,
        shares: 0
      };
    });

    // Tạo dữ liệu chart từ 7 ngày thực tế
    const chartData = (insightsData.data?.find((i: any) => i.name === 'page_impressions_unique')?.values || []).map((v: any, index: number) => {
      const date = new Date(v.end_time);
      const dayName = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()];
      
      return {
        name: dayName,
        reach: v.value || 0,
        engagement: insightsData.data?.find((i: any) => i.name === 'page_post_engagements')?.values[index]?.value || 0
      };
    });

    // Nếu không có dữ liệu thực tế (với Page mới), dùng dữ liệu giả lập có tỉ lệ với tổng
    const finalChartData = chartData.length > 0 ? chartData : [
      { name: 'T2', reach: 0, engagement: 0 },
      { name: 'T3', reach: 0, engagement: 0 },
      { name: 'T4', reach: 0, engagement: 0 },
      { name: 'T5', reach: 0, engagement: 0 },
      { name: 'T6', reach: 0, engagement: 0 },
      { name: 'T7', reach: 0, engagement: 0 },
      { name: 'CN', reach: 0, engagement: 0 },
    ];

    return NextResponse.json({
      connected: true,
      page: {
        name: pageData.name || "In Nhật Hàn",
        followers: pageData.followers_count || 0,
        fans: pageData.fan_count || 0
      },
      stats: {
        reach: stats.page_impressions_unique,
        engagement: stats.page_post_engagements,
        views: stats.page_views_total,
        newFans: stats.page_fan_adds_unique
      },
      recentPosts,
      chartData: finalChartData
    });
  } catch (error) {
    console.error('FB Insights Full Error:', error);
    return NextResponse.json({ error: 'Failed to fetch full insights' }, { status: 500 });
  }
}
