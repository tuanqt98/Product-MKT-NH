import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Smart prompt suggestions based on skill category and triggers
const SMART_SUGGESTIONS: Record<string, string[]> = {
  "00-ke-hoach-mkt": [
    "Lập kế hoạch marketing tổng thể cho dịch vụ in ấn bao bì Q3/2026",
    "Phân bổ ngân sách marketing 50 triệu/tháng cho các kênh hiệu quả nhất",
    "Xây dựng chiến lược GTM cho dòng sản phẩm bao bì thực phẩm mới"
  ],
  "01-lich-noi-dung": [
    "Lên lịch nội dung Fanpage 1 tháng cho ngành in ấn bao bì",
    "Tạo content calendar cho TikTok và Facebook tuần này",
    "Lập kế hoạch nội dung theo mùa lễ hội (Tết, 8/3, Black Friday)"
  ],
  "02-brief-chien-dich": [
    "Viết brief chiến dịch quảng cáo cho dịch vụ in ấn bao bì cao cấp",
    "Brief chiến dịch giảm giá mùa hè cho khách hàng B2B",
    "Tạo brief chiến dịch ra mắt dịch vụ in tem nhãn mới"
  ],
  "03-danh-gia-hieu-suat": [
    "Đánh giá hiệu suất chiến dịch Facebook Ads tháng trước",
    "Phân tích ROI các kênh marketing hiện tại của Nhật Hàn",
    "So sánh hiệu suất content giữa Facebook vs TikTok"
  ],
  "04-script-video": [
    "Viết kịch bản video giới thiệu nhà máy in ấn Nhật Hàn (60 giây)",
    "Script video TikTok về quy trình in ấn bao bì thực phẩm",
    "Kịch bản video testimonial khách hàng sử dụng dịch vụ in ấn"
  ],
  "05-copy-quang-cao": [
    "Viết 6 biến thể copy quảng cáo Facebook cho dịch vụ in bao bì",
    "Copy quảng cáo TikTok Ads cho dòng sản phẩm tem nhãn cao cấp",
    "Tạo copy retarget cho khách hàng đã xem trang dịch vụ in ấn"
  ],
  "06-brief-ugc-egc": [
    "Viết brief UGC cho khách hàng review dịch vụ in ấn",
    "Brief EGC cho nhân viên chia sẻ quy trình sản xuất bao bì",
    "Lập brief video unboxing sản phẩm in ấn cho KOL ngành F&B"
  ],
  "07-bao-cao-marketing": [
    "Tạo báo cáo marketing tháng này cho ban giám đốc",
    "Phân tích chi tiết hiệu suất quảng cáo Facebook tháng 5/2026",
    "Báo cáo tổng hợp hoạt động marketing quý 2/2026"
  ],
  "08-nghien-cuu-doi-thu": [
    "Phân tích 5 đối thủ chính trong ngành in ấn bao bì tại TP.HCM",
    "So sánh chiến lược marketing của Nhật Hàn vs đối thủ lớn nhất",
    "Nghiên cứu điểm mạnh/yếu của đối thủ trên mạng xã hội"
  ],
  "09-insight-khach-hang": [
    "Phân tích chân dung khách hàng B2B ngành thực phẩm cần in bao bì",
    "Tìm insight khách hàng về nhu cầu in ấn tem nhãn cao cấp",
    "Xây dựng persona cho nhóm khách hàng startup cần bao bì sản phẩm"
  ],
  "10-tinh-kpi-nguoc": [
    "Tính KPI ngược: Cần bao nhiêu leads để đạt 500 triệu doanh thu/tháng?",
    "Từ mục tiêu 100 đơn hàng in ấn/tháng, tính ngược chi phí quảng cáo",
    "Dự toán funnel marketing từ awareness đến closing cho Q3"
  ],
  "11-thiet-lap-kenh": [
    "Hướng dẫn thiết lập Fanpage chuyên nghiệp cho Nhật Hàn",
    "Setup TikTok Business Account cho ngành in ấn bao bì",
    "Thiết lập Zalo OA và chiến lược tin nhắn tự động cho khách hàng"
  ],
  "12-brief-landing-page": [
    "Viết brief landing page cho dịch vụ in bao bì thực phẩm",
    "Brief landing page thu thập lead khách hàng B2B cần in tem nhãn",
    "Tạo wireframe + copy cho trang đích quảng cáo Google Ads"
  ],
  "13-phan-tich-du-lieu": [
    "Phân tích dữ liệu Facebook Insights của Fanpage Nhật Hàn",
    "Đánh giá traffic và conversion rate website nhathanjsc.com",
    "Phân tích hành vi khách hàng trên các kênh digital"
  ],
  "14-email-marketing": [
    "Viết chuỗi 5 email nurture cho khách hàng B2B ngành in ấn",
    "Tạo email chào mừng khách hàng mới đăng ký dịch vụ",
    "Email khuyến mãi đặc biệt cho khách hàng cũ chưa quay lại 3 tháng"
  ],
  "15-social-listening": [
    "Lập kế hoạch social listening cho brand Nhật Hàn",
    "Phân tích những gì khách hàng nói về ngành in ấn bao bì trên mạng",
    "Theo dõi sentiment và trending topics liên quan đến packaging"
  ],
  "16-marketing-psychology": [
    "Áp dụng tâm lý học vào copy quảng cáo dịch vụ in ấn",
    "Phân tích hành vi mua hàng B2B trong ngành bao bì",
    "Sử dụng nguyên tắc khan hiếm và social proof cho chiến dịch mới"
  ],
  "17-pricing-strategy": [
    "Xây dựng chiến lược giá cho dịch vụ in ấn bao bì",
    "So sánh mô hình pricing: theo đơn hàng vs gói dịch vụ",
    "Tạo bảng giá cạnh tranh cho dòng sản phẩm tem nhãn cao cấp"
  ],
  "18-referral-program": [
    "Thiết kế chương trình giới thiệu khách hàng cho Nhật Hàn",
    "Xây dựng referral program B2B: Giới thiệu 1 KH nhận ưu đãi 10%",
    "Tạo hệ thống affiliate cho đại lý/đối tác phân phối"
  ],
  "19-ab-test-setup": [
    "Thiết kế A/B test cho landing page dịch vụ in ấn",
    "Lập kế hoạch A/B test tiêu đề quảng cáo Facebook Ads",
    "So sánh 2 phiên bản email marketing để tối ưu open rate"
  ],
  "21-audit-ads-performance": [
    "Audit toàn bộ chiến dịch Facebook Ads đang chạy",
    "Đánh giá hiệu quả chi tiêu quảng cáo Google Ads tháng này",
    "Kiểm tra và đề xuất tối ưu quảng cáo TikTok Ads"
  ],
  "29-xuat-khau-b2b": [
    "Tạo company profile tiếng Anh cho sản phẩm xuất khẩu của Nhật Hàn",
    "Viết email chào hàng quốc tế cho buyer B2B ngành bao bì",
    "Lập kế hoạch tham dự hội chợ và follow-up buyer nước ngoài"
  ]
};

// Fallback suggestions based on category
const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  strategy: [
    "Lập chiến lược marketing tổng thể cho Nhật Hàn",
    "Phân tích SWOT cho dịch vụ in ấn bao bì",
    "Xây dựng kế hoạch phát triển thương hiệu 6 tháng"
  ],
  content: [
    "Viết nội dung quảng cáo cho dịch vụ in ấn",
    "Tạo series bài viết giáo dục về quy trình in ấn",
    "Lên ý tưởng content viral cho ngành bao bì"
  ],
  performance: [
    "Phân tích hiệu suất marketing tháng này",
    "Tính ROI cho các chiến dịch quảng cáo đang chạy",
    "Đánh giá và đề xuất tối ưu ngân sách marketing"
  ],
  operations: [
    "Hướng dẫn thiết lập kênh marketing mới",
    "Quy trình vận hành marketing hàng ngày",
    "Checklist kiểm tra chất lượng nội dung trước khi đăng"
  ]
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const skillsPath = fs.existsSync(path.join(process.cwd(), 'skills'))
      ? path.join(process.cwd(), 'skills')
      : path.join(process.cwd(), '../skills');
    const skillFile = path.join(skillsPath, id, 'SKILL.md');

    if (!fs.existsSync(skillFile)) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    const content = fs.readFileSync(skillFile, 'utf8');
    
    // Extract frontmatter fields
    const nameMatch = content.match(/name:\s*(.*)/);
    const descMatch = content.match(/description:\s*(.*)/);
    const categoryMatch = content.match(/category:\s*(.*)/);
    const triggersMatch = content.match(/triggers:\s*\n([\s\S]*?)(?=\n\w|---)/);
    
    // Parse triggers
    let triggers: string[] = [];
    if (triggersMatch) {
      triggers = triggersMatch[1]
        .split('\n')
        .map(line => line.replace(/^\s*-\s*"?/, '').replace(/"?\s*$/, ''))
        .filter(t => t.length > 0);
    }

    // Get smart suggestions
    const category = categoryMatch ? categoryMatch[1].trim() : 'strategy';
    const suggestions = SMART_SUGGESTIONS[id] || CATEGORY_SUGGESTIONS[category] || [
      "Hãy giúp tôi thực hiện skill này cho Nhật Hàn",
      "Phân tích và đề xuất chiến lược phù hợp",
      "Tạo kế hoạch chi tiết theo hướng dẫn skill này"
    ];

    return NextResponse.json({
      id,
      name: nameMatch ? nameMatch[1].trim() : id,
      description: descMatch ? descMatch[1].trim().replace(/"/g, '') : '',
      category,
      triggers,
      suggestions,
      content
    });
  } catch (error) {
    console.error('Error reading skill detail:', error);
    return NextResponse.json({ error: 'Failed to read skill' }, { status: 500 });
  }
}
