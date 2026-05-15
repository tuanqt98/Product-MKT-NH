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

    if (pageData.error) {
      return NextResponse.json({ connected: false, error: pageData.error.message });
    }

    // 2. Lấy dữ liệu 35 ngày để chắc chắn bao phủ 28 ngày gần nhất (trừ đi độ trễ 2 ngày)
    const until = Math.floor(Date.now() / 1000);
    const since = until - (35 * 24 * 60 * 60);

    const metrics = [
      'page_views_total',
      'page_impressions_unique',
      'page_post_engagements',
      'page_daily_follows_unique',
    ].join(',');

    const insightsResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}/insights?metric=${metrics}&period=day&since=${since}&until=${until}&access_token=${ACCESS_TOKEN}`
    );
    const insightsData = await insightsResponse.json();

    if (insightsData.error) {
      console.error("FB API Error Details:", JSON.stringify(insightsData.error, null, 2));
      return NextResponse.json({ connected: false, error: insightsData.error.message });
    }

    const stats: any = { reach: 0, engagement: 0, views: 0, newFans: 0 };
    const dailyData: Record<string, { name: string, reach: number, engagement: number }> = {};
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    if (insightsData.data) {
      insightsData.data.forEach((item: any) => {
        const values = item.values || [];
        // Lấy 28 ngày gần nhất có dữ liệu
        const last28Values = values.slice(-28);
        const total = last28Values.reduce((acc: number, curr: any) => acc + (Number(curr.value) || 0), 0);

        if (item.name === 'page_impressions_unique') {
          stats.reach = total;
          // Chuẩn bị dữ liệu cho chart 7 ngày cuối
          values.slice(-7).forEach((v: any) => {
            const date = new Date(v.end_time);
            const dateKey = date.toISOString().split('T')[0];
            if (!dailyData[dateKey]) {
              dailyData[dateKey] = { name: days[date.getDay()], reach: 0, engagement: 0 };
            }
            dailyData[dateKey].reach = Number(v.value) || 0;
          });
        }
        if (item.name === 'page_post_engagements') {
          stats.engagement = total;
          values.slice(-7).forEach((v: any) => {
            const date = new Date(v.end_time);
            const dateKey = date.toISOString().split('T')[0];
            if (!dailyData[dateKey]) {
              dailyData[dateKey] = { name: days[date.getDay()], reach: 0, engagement: 0 };
            }
            dailyData[dateKey].engagement = Number(v.value) || 0;
          });
        }
        if (item.name === 'page_views_total') stats.views = total;
        if (item.name === 'page_daily_follows_unique') stats.newFans = total;
      });
    }

    const chartData = Object.entries(dailyData)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([_, value]) => value);

    // 3. Lấy nhân khẩu học (Lifetime)
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

    // 4. Lấy 5 bài viết mới nhất
    const postsResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PAGE_ID}/posts?fields=message,created_time,type,insights.metric(post_impressions_unique,post_engagements)&limit=5&access_token=${ACCESS_TOKEN}`
    );
    const postsData = await postsResponse.json();
    
    const recentPosts = (postsData.data || []).map((p: any) => ({
      id: p.id,
      message: p.message || "(Bài viết không có text)",
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
