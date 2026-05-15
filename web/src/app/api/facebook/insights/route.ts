import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
  const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!PAGE_ID || !ACCESS_TOKEN) {
    return NextResponse.json({ connected: false, error: 'Missing configuration' });
  }

  try {
    // 1. Lấy thông tin cơ bản của Page
    const pageResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}?fields=name,fan_count,followers_count,picture&access_token=${ACCESS_TOKEN}`
    );
    const pageData = await pageResponse.json();

    if (pageData.error) {
      throw new Error(pageData.error.message || 'Facebook API Error');
    }

    // 2. Lấy Insights
    const metrics = [
      'page_views_total',
      'page_impressions_unique',
      'page_post_engagements',
      'page_fan_adds_unique',
      'page_fans_gender_age',
      'page_fans_country',
    ].join(',');

    const insightsResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}/insights?metric=${metrics}&period=day&access_token=${ACCESS_TOKEN}`
    );
    const insightsData = await insightsResponse.json();

    // 3. Xử lý dữ liệu Insights
    const stats: any = {};
    let demographics: any = {};
    let countryData: any = {};
    let chartData: any[] = [];
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    if (insightsData.data) {
      const reachItem = insightsData.data.find((i: any) => i.name === 'page_impressions_unique');
      const engagementItem = insightsData.data.find((i: any) => i.name === 'page_post_engagements');

      if (reachItem?.values && engagementItem?.values) {
        const reachValues = reachItem.values.slice(-7);
        const engagementValues = engagementItem.values.slice(-7);
        
        chartData = reachValues.map((v: any, index: number) => {
          const date = new Date(v.end_time);
          return {
            name: days[date.getDay()],
            reach: Number(v.value) || 0,
            engagement: Number(engagementValues[index]?.value) || 0
          };
        });
      }

      insightsData.data.forEach((item: any) => {
        const values = item.values || [];
        const latestValue = values.length > 0 ? (values[values.length - 1]?.value || 0) : 0;
        stats[item.name] = latestValue;
        
        if (item.name === 'page_fans_gender_age') demographics = latestValue;
        if (item.name === 'page_fans_country') countryData = latestValue;
      });
    }

    // 4. Phân tích bài viết
    const postsResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}/posts?fields=message,created_time,type,insights.metric(post_impressions_unique,post_engagements)&limit=10&access_token=${ACCESS_TOKEN}`
    );
    const postsData = await postsResponse.json();
    
    const recentPosts = (postsData.data || []).map((p: any) => ({
      id: p.id,
      message: p.message || "(Nội dung hình ảnh/video)",
      created_time: p.created_time,
      type: p.type,
      reach: p.insights?.data?.find((i: any) => i.name === 'post_impressions_unique')?.values[0]?.value || 0,
      engagement: p.insights?.data?.find((i: any) => i.name === 'post_engagements')?.values[0]?.value || 0,
    }));

    const fanCount = Number(pageData.fan_count) || 1; // Tránh chia cho 0

    return NextResponse.json({
      connected: true,
      page: {
        name: pageData.name || "Fanpage Nhật Hàn",
        fans: pageData.fan_count || 0,
        followers: pageData.followers_count || 0,
        avatar: pageData.picture?.data?.url
      },
      stats: {
        reach: stats.page_impressions_unique || 0,
        engagement: stats.page_post_engagements || 0,
        views: stats.page_views_total || 0,
        newFans: stats.page_fan_adds_unique || 0
      },
      demographics,
      locations: Object.entries(countryData).slice(0, 4).map(([city, val]) => ({
        city: city === 'VN' ? 'Việt Nam' : city,
        percent: Math.round(((val as number) / fanCount) * 100) || 0
      })),
      chartData: chartData.length > 0 ? chartData : [
        { name: 'T2', reach: 0, engagement: 0 },
        { name: 'T3', reach: 0, engagement: 0 },
        { name: 'T4', reach: 0, engagement: 0 },
        { name: 'T5', reach: 0, engagement: 0 },
        { name: 'T6', reach: 0, engagement: 0 },
        { name: 'T7', reach: 0, engagement: 0 },
        { name: 'CN', reach: 0, engagement: 0 },
      ],
      contentAnalysis: recentPosts
    });
  } catch (error: any) {
    console.error("Facebook API Error:", error);
    return NextResponse.json({ connected: false, error: error.message });
  }
}
