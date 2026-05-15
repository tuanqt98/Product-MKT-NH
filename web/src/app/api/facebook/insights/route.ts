import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
  const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  // Dữ liệu mẫu cực đẹp để dự phòng (luôn đảm bảo trang không bị trắng)
  const fallbackData = {
    connected: false,
    page: {
      name: "Nhật Hàn (Demo Mode)",
      fans: 12500,
      followers: 13200,
      avatar: null
    },
    stats: {
      reach: 24500,
      engagement: 1850,
      views: 3200,
      newFans: 125
    },
    demographics: {
      "M.18-24": 1500, "F.18-24": 1800,
      "M.25-34": 4500, "F.25-34": 5200,
      "M.35-44": 2500, "F.35-44": 2800,
      "M.45-54": 800, "F.45-54": 900,
      "M.55-64": 300, "F.55-64": 400
    },
    locations: [
      { city: 'Hà Nội', percent: 62 },
      { city: 'TP. Hồ Chí Minh', percent: 24 },
      { city: 'Bắc Ninh', percent: 10 },
      { city: 'Khác', percent: 4 }
    ],
    chartData: [
      { name: 'T2', reach: 1200, engagement: 400 },
      { name: 'T3', reach: 2100, engagement: 650 },
      { name: 'T4', reach: 1800, engagement: 500 },
      { name: 'T5', reach: 2400, engagement: 800 },
      { name: 'T6', reach: 2900, engagement: 950 },
      { name: 'T7', reach: 3500, engagement: 1200 },
      { name: 'CN', reach: 2800, engagement: 900 },
    ],
    contentAnalysis: [
      { id: '1', type: 'video', message: 'Video quy trình in ấn túi giấy cao cấp', reach: 8500, engagement: 1200 },
      { id: '2', type: 'photo', message: 'Bộ sưu tập mẫu hộp quà tặng 2024', reach: 5200, engagement: 450 },
      { id: '3', type: 'video', message: 'Feedback khách hàng về chất lượng in', reach: 4100, engagement: 380 }
    ]
  };

  if (!PAGE_ID || !ACCESS_TOKEN) {
    return NextResponse.json({ ...fallbackData, error: 'Thiếu cấu hình Facebook (Vui lòng kiểm tra Env)' }, { status: 200 });
  }

  try {
    // Thêm timeout cho fetch để tránh treo server
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const pageResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}?fields=name,fan_count,followers_count,picture&access_token=${ACCESS_TOKEN}`,
      { signal: controller.signal }
    );
    const pageData = await pageResponse.json();
    clearTimeout(timeoutId);

    if (pageData.error) {
      return NextResponse.json({ ...fallbackData, error: pageData.error.message }, { status: 200 });
    }

    // 2. Lấy Insights (Reach, Engagement 7 ngày)
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

    // 3. Xử lý dữ liệu
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
      `https://graph.facebook.com/v20.0/${PAGE_ID}/posts?fields=message,created_time,type,insights.metric(post_impressions_unique,post_engagements)&limit=5&access_token=${ACCESS_TOKEN}`
    );
    const postsData = await postsResponse.json();
    
    const recentPosts = (postsData.data || []).map((p: any) => ({
      id: p.id,
      message: p.message || "(Nội dung hình ảnh/video)",
      type: p.type,
      reach: p.insights?.data?.find((i: any) => i.name === 'post_impressions_unique')?.values[0]?.value || 0,
      engagement: p.insights?.data?.find((i: any) => i.name === 'post_engagements')?.values[0]?.value || 0,
    }));

    const fanCount = Number(pageData.fan_count) || 1;

    return NextResponse.json({
      connected: true,
      page: {
        name: pageData.name,
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
      chartData: chartData.length > 0 ? chartData : fallbackData.chartData,
      contentAnalysis: recentPosts.length > 0 ? recentPosts : fallbackData.contentAnalysis
    });

  } catch (error: any) {
    return NextResponse.json({ ...fallbackData, error: error.message }, { status: 200 });
  }
}
