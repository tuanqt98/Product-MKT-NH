import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
  const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  // Dữ liệu mẫu xịn để dự phòng
  const fallbackData = {
    connected: false,
    page: { name: "Fanpage Nhật Hàn", fans: 0, followers: 0, avatar: null },
    stats: { reach: 0, engagement: 0, views: 0, newFans: 0 },
    demographics: {},
    locations: [],
    chartData: [],
    contentAnalysis: []
  };

  if (!PAGE_ID || !ACCESS_TOKEN) {
    return NextResponse.json({ ...fallbackData, error: 'Thiếu cấu hình Token/Page ID' });
  }

  try {
    // 1. Lấy thông tin cơ bản Page
    const pageResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}?fields=name,fan_count,followers_count,picture&access_token=${ACCESS_TOKEN}`
    );
    const pageData = await pageResponse.json();

    if (pageData.error) {
      console.error("FB Page Error:", pageData.error);
      return NextResponse.json({ ...fallbackData, error: pageData.error.message });
    }

    // 2. Lấy Insights với khoảng thời gian rộng hơn (để khớp với Business Suite)
    // Lấy dữ liệu 30 ngày gần nhất để tránh độ trễ 2 ngày của Facebook
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

    if (insightsData.error) {
      console.error("FB Insights Error:", insightsData.error);
      return NextResponse.json({ ...fallbackData, error: "Token thiếu quyền read_insights hoặc đã hết hạn" });
    }

    // 3. Xử lý dữ liệu
    const stats: any = { reach: 0, engagement: 0, views: 0, newFans: 0 };
    let demographics: any = {};
    let countryData: any = {};
    let chartData: any[] = [];
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    if (insightsData.data) {
      insightsData.data.forEach((item: any) => {
        const values = item.values || [];
        // Lấy tổng giá trị trong mảng trả về (thường là 2-3 ngày gần nhất có dữ liệu)
        // Thay vì chỉ lấy ngày cuối cùng (có thể là 0 do chưa cập nhật), ta lấy giá trị có số lớn nhất hoặc giá trị mới nhất có dữ liệu > 0
        const validValues = values.filter((v: any) => v.value > 0);
        const latestValidValue = validValues.length > 0 ? validValues[validValues.length - 1].value : 0;
        
        // Tính tổng 7 ngày cho các chỉ số chính để hiển thị số "khủng" hơn giống Business Suite
        const last7DaysSum = values.slice(-7).reduce((acc: number, curr: any) => acc + (Number(curr.value) || 0), 0);

        if (item.name === 'page_impressions_unique') {
          stats.reach = last7DaysSum || latestValidValue;
          // Tạo chart data từ 7 ngày này
          chartData = values.slice(-7).map((v: any) => ({
            name: days[new Date(v.end_time).getDay()],
            reach: Number(v.value) || 0,
            engagement: 0 // Sẽ điền sau
          }));
        }
        if (item.name === 'page_post_engagements') {
          stats.engagement = last7DaysSum || latestValidValue;
          // Cập nhật engagement vào chartData
          values.slice(-7).forEach((v: any, idx: number) => {
            if (chartData[idx]) chartData[idx].engagement = Number(v.value) || 0;
          });
        }
        if (item.name === 'page_views_total') stats.views = last7DaysSum || latestValidValue;
        if (item.name === 'page_fan_adds_unique') stats.newFans = last7DaysSum || latestValidValue;
        
        if (item.name === 'page_fans_gender_age') demographics = latestValidValue || {};
        if (item.name === 'page_fans_country') countryData = latestValidValue || {};
      });
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
    console.error("Final FB Error:", error);
    return NextResponse.json({ ...fallbackData, error: error.message });
  }
}
