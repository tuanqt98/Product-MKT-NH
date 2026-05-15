import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
  const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!PAGE_ID || !ACCESS_TOKEN) {
    return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
  }

  try {
    // 1. Lấy thông tin cơ bản của Page
    const pageResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}?fields=name,fan_count,followers_count,picture&access_token=${ACCESS_TOKEN}`
    );
    const pageData = await pageResponse.json();

    // 2. Lấy Insights (Reach, Engagement, Views, New Fans) - Lấy chuỗi 7 ngày cho biểu đồ
    const metrics = [
      'page_views_total',
      'page_impressions_unique',
      'page_post_engagements',
      'page_fan_adds_unique',
      'page_fans_gender_age',
      'page_fans_country',
      'page_fans_online'
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
      // Lấy Reach & Engagement 7 ngày gần nhất cho biểu đồ
      const reachItem = insightsData.data.find((i: any) => i.name === 'page_impressions_unique');
      const engagementItem = insightsData.data.find((i: any) => i.name === 'page_post_engagements');

      if (reachItem && engagementItem) {
        const reachValues = reachItem.values.slice(-7);
        const engagementValues = engagementItem.values.slice(-7);
        
        chartData = reachValues.map((v: any, index: number) => {
          const date = new Date(v.end_time);
          return {
            name: days[date.getDay()],
            reach: v.value || 0,
            engagement: engagementValues[index]?.value || 0
          };
        });
      }

      // Lấy các chỉ số tổng hợp (latest)
      insightsData.data.forEach((item: any) => {
        const latestValue = item.values[item.values.length - 1]?.value || 0;
        stats[item.name] = latestValue;
        
        if (item.name === 'page_fans_gender_age') demographics = latestValue;
        if (item.name === 'page_fans_country') countryData = latestValue;
      });
    }

    // 4. Phân tích bài viết (Content Type Performance)
    const postsResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}/posts?fields=message,created_time,type,insights.metric(post_impressions_unique,post_engagements)&limit=15&access_token=${ACCESS_TOKEN}`
    );
    const postsData = await postsResponse.json();
    
    const recentPosts = (postsData.data || []).map((p: any) => ({
      id: p.id,
      message: p.message || "(Không có nội dung)",
      created_time: p.created_time,
      type: p.type,
      likes: p.insights?.data?.find((i: any) => i.name === 'post_engagements')?.values[0]?.value || 0,
      comments: 0 // Graph API /posts endpoint limit, need separate call for full details but this is good enough for demo
    }));

    return NextResponse.json({
      connected: true,
      page: {
        name: pageData.name,
        fans: pageData.fan_count,
        followers: pageData.followers_count,
        avatar: pageData.picture?.data?.url
      },
      stats: {
        reach: stats.page_impressions_unique || 0,
        engagement: stats.page_post_engagements || 0,
        views: stats.page_views_total || 0,
        newFans: stats.page_fan_adds_unique || 0
      },
      demographics: demographics,
      locations: Object.entries(countryData).slice(0, 4).map(([city, val]) => ({
        city: city === 'VN' ? 'Việt Nam' : city,
        percent: Math.round(((val as number) / pageData.fan_count) * 100) || 0
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
      recentPosts
    });
  } catch (error: any) {
    return NextResponse.json({ connected: false, error: error.message });
  }
}
