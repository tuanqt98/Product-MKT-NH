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
    // 1. Thông tin Page cơ bản
    const pageResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}?fields=name,fan_count,followers_count,picture&access_token=${ACCESS_TOKEN}`
    );
    const pageData = await pageResponse.json();

    // 2. Lấy Insights với Period = days_28 để khớp tuyệt đối với Business Suite
    // Chúng ta sẽ lấy cả 'day' cho biểu đồ và 'days_28' cho con số tổng
    const metrics = [
      'page_views_total',
      'page_impressions_unique',
      'page_post_engagements',
      'page_fan_adds_unique',
    ].join(',');

    // Gọi API lấy cả dữ liệu ngày và dữ liệu 28 ngày
    const insightsResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}/insights?metric=${metrics}&period=day,days_28&access_token=${ACCESS_TOKEN}`
    );
    const insightsData = await insightsResponse.json();

    const stats: any = { reach: 0, engagement: 0, views: 0, newFans: 0 };
    let chartData: any[] = [];
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    if (insightsData.data) {
      insightsData.data.forEach((item: any) => {
        // Nếu là dữ liệu 28 ngày -> Lấy làm số tổng (Card chính)
        if (item.period === 'days_28') {
          const total = item.values?.[item.values.length - 1]?.value || 0;
          if (item.name === 'page_impressions_unique') stats.reach = total;
          if (item.name === 'page_post_engagements') stats.engagement = total;
          if (item.name === 'page_views_total') stats.views = total;
          if (item.name === 'page_fan_adds_unique') stats.newFans = total;
        }
        
        // Nếu là dữ liệu theo ngày -> Dùng vẽ biểu đồ
        if (item.period === 'day') {
          if (item.name === 'page_impressions_unique') {
            chartData = (item.values || []).slice(-7).map((v: any) => ({
              name: days[new Date(v.end_time).getDay()],
              reach: Number(v.value) || 0,
              engagement: 0
            }));
          }
          if (item.name === 'page_post_engagements') {
            (item.values || []).slice(-7).forEach((v: any, idx: number) => {
              if (chartData[idx]) chartData[idx].engagement = Number(v.value) || 0;
            });
          }
        }
      });
    }

    // 3. Lấy thêm giới tính/độ tuổi (chỉ hỗ trợ period=lifetime)
    const extraResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}/insights?metric=page_fans_gender_age,page_fans_country&period=lifetime&access_token=${ACCESS_TOKEN}`
    );
    const extraData = await extraResponse.json();
    let demographics = {};
    let countryData = {};
    if (extraData.data) {
      demographics = extraData.data.find((i: any) => i.name === 'page_fans_gender_age')?.values?.[0]?.value || {};
      countryData = extraData.data.find((i: any) => i.name === 'page_fans_country')?.values?.[0]?.value || {};
    }

    // 4. Lấy bài viết mới nhất
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
    console.error("Aggregation Error:", error);
    return NextResponse.json({ connected: false, error: error.message });
  }
}
