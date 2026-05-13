import { NextResponse } from 'next/server';

export async function GET() {
  const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
  const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!PAGE_ID || !ACCESS_TOKEN) {
    return NextResponse.json({ error: 'Missing env configuration' }, { status: 500 });
  }

  try {
    // Thử lấy thông tin Page trước (để check Token còn sống không)
    const pageResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}?fields=name,followers_count,fan_count&access_token=${ACCESS_TOKEN}`
    );
    const pageData = await pageResponse.json();

    if (pageData.error) {
      return NextResponse.json({ error: 'Page API Error', details: pageData.error }, { status: 400 });
    }

    // Lấy Insights với khoảng thời gian rõ ràng (30 ngày qua)
    const metrics = [
      'page_views_total',
      'page_impressions_unique',
      'page_post_engagements',
      'page_fan_adds_unique'
    ].join(',');

    // Lấy dữ liệu từ 30 ngày trước đến nay
    const until = Math.floor(Date.now() / 1000);
    const since = until - (30 * 24 * 60 * 60);

    const insightsUrl = `https://graph.facebook.com/v20.0/${PAGE_ID}/insights?metric=${metrics}&period=day&since=${since}&until=${until}&access_token=${ACCESS_TOKEN}`;
    const insightsResponse = await fetch(insightsUrl);
    const insightsData = await insightsResponse.json();

    if (insightsData.error) {
      return NextResponse.json({ error: 'Insights API Error', details: insightsData.error }, { status: 400 });
    }

    // Xử lý dữ liệu
    const stats: any = {
      page_views_total: 0,
      page_impressions_unique: 0,
      page_post_engagements: 0,
      page_fan_adds_unique: 0
    };

    if (insightsData.data) {
      insightsData.data.forEach((item: any) => {
        // Lấy giá trị của ngày có dữ liệu gần nhất (không phải lúc nào cũng là hôm nay)
        const validValues = item.values.filter((v: any) => v.value > 0);
        const latestValue = validValues.length > 0 ? validValues[validValues.length - 1].value : 0;
        stats[item.name] = latestValue;
      });
    }

    // Nếu vẫn là 0, thử lấy dữ liệu tổng hợp (period=days_28) làm dự phòng
    if (stats.page_impressions_unique === 0) {
      const summaryResponse = await fetch(
        `https://graph.facebook.com/v20.0/${PAGE_ID}/insights?metric=${metrics}&period=days_28&access_token=${ACCESS_TOKEN}`
      );
      const summaryData = await summaryResponse.json();
      if (summaryData.data) {
        summaryData.data.forEach((item: any) => {
          stats[item.name] = item.values[item.values.length - 1]?.value || 0;
        });
      }
    }

    // Lấy bài viết
    const postsResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}/posts?fields=message,created_time&limit=5&access_token=${ACCESS_TOKEN}`
    );
    const postsData = await postsResponse.json();

    return NextResponse.json({
      connected: true,
      debug: {
        hasData: !!insightsData.data,
        metricsCount: insightsData.data?.length || 0
      },
      page: {
        name: pageData.name,
        followers: pageData.followers_count,
        fans: pageData.fan_count
      },
      stats: {
        reach: stats.page_impressions_unique,
        engagement: stats.page_post_engagements,
        views: stats.page_views_total,
        newFans: stats.page_fan_adds_unique
      },
      recentPosts: (postsData.data || []).map((p: any) => ({
        id: p.id,
        message: p.message || 'No text content',
        created_time: p.created_time,
        likes: 0, comments: 0, shares: 0
      })),
      chartData: [
        { name: 'T2', reach: 10, engagement: 5 }, // Tạm thời để số nhỏ để thấy chart chạy
        { name: 'T3', reach: 25, engagement: 12 },
        { name: 'T4', reach: 15, engagement: 8 },
        { name: 'T5', reach: 30, engagement: 20 },
        { name: 'T6', reach: 20, engagement: 15 },
        { name: 'T7', reach: 45, engagement: 25 },
        { name: 'CN', reach: 35, engagement: 18 },
      ]
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
