import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
  const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!PAGE_ID || !ACCESS_TOKEN) {
    return NextResponse.json({ connected: false, error: 'Thiếu cấu hình Token/Page ID' });
  }

  try {
    // 1. Lấy thông tin cơ bản Page
    const pageResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}?fields=name,fan_count,followers_count,picture&access_token=${ACCESS_TOKEN}`
    );
    const pageData = await pageResponse.json();

    // 2. Tính toán khoảng thời gian 28 ngày để khớp với Business Suite
    const until = Math.floor(Date.now() / 1000);
    const since = until - (28 * 24 * 60 * 60); // 28 ngày trước

    const metrics = [
      'page_views_total',
      'page_impressions_unique',
      'page_post_engagements',
      'page_fan_adds_unique',
      'page_fans_gender_age',
      'page_fans_country',
    ].join(',');

    const insightsResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}/insights?metric=${metrics}&period=day&since=${since}&until=${until}&access_token=${ACCESS_TOKEN}`
    );
    const insightsData = await insightsResponse.json();

    const stats: any = { reach: 0, engagement: 0, views: 0, newFans: 0 };
    let demographics: any = {};
    let countryData: any = {};
    let chartData: any[] = [];
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    if (insightsData.data) {
      insightsData.data.forEach((item: any) => {
        const values = item.values || [];
        // Cộng dồn tất cả giá trị trong 28 ngày
        const totalValue = values.reduce((acc: number, curr: any) => acc + (Number(curr.value) || 0), 0);
        const latestValue = values.length > 0 ? values[values.length - 1].value : 0;

        if (item.name === 'page_impressions_unique') {
          stats.reach = totalValue;
          // Chart data lấy 7 ngày gần nhất cho biểu đồ tuần
          chartData = values.slice(-7).map((v: any) => ({
            name: days[new Date(v.end_time).getDay()],
            reach: Number(v.value) || 0,
            engagement: 0
          }));
        }
        if (item.name === 'page_post_engagements') {
          stats.engagement = totalValue;
          values.slice(-7).forEach((v: any, idx: number) => {
            if (chartData[idx]) chartData[idx].engagement = Number(v.value) || 0;
          });
        }
        if (item.name === 'page_views_total') stats.views = totalValue;
        if (item.name === 'page_fan_adds_unique') stats.newFans = totalValue;
        
        if (item.name === 'page_fans_gender_age') demographics = latestValue || {};
        if (item.name === 'page_fans_country') countryData = latestValue || {};
      });
    }

    // 3. Lấy bài viết
    const postsResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}/posts?fields=message,created_time,type,insights.metric(post_impressions_unique,post_engagements)&limit=5&access_token=${ACCESS_TOKEN}`
    );
    const postsData = await postsResponse.json();
    
    const recentPosts = (postsData.data || []).map((p: any) => ({
      id: p.id,
      message: p.message || "(Nội dung không có text)",
      type: p.type,
      reach: p.insights?.data?.find((i: any) => i.name === 'post_impressions_unique')?.values[0]?.value || 0,
      engagement: p.insights?.data?.find((i: any) => i.name === 'post_engagements')?.values[0]?.value || 0,
    }));

    return NextResponse.json({
      connected: true,
      page: {
        name: pageData.name,
        fans: pageData.fan_count || 0,
        followers: pageData.followers_count || 0,
        avatar: pageData.picture?.data?.url
      },
      stats,
      demographics,
      locations: Object.entries(countryData).slice(0, 4).map(([city, val]) => ({
        city: city === 'VN' ? 'Việt Nam' : city,
        percent: Math.round(((val as number) / (pageData.fan_count || 1)) * 100) || 0
      })),
      chartData,
      contentAnalysis: recentPosts
    });

  } catch (error: any) {
    return NextResponse.json({ connected: false, error: error.message });
  }
}
