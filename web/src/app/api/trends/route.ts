import { NextResponse } from 'next/server';

export async function GET() {
  // Giả lập dữ liệu từ AI Trend Spy quét từ Pinterest/FB/Behance
  const trends = [
    {
      id: 'trend-01',
      title: "Eco-Minimalism (Tối giản sinh thái)",
      category: "Bao bì",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop",
      description: "Sử dụng giấy kraft thô kết hợp với mực in thực vật và font chữ không chân mảnh.",
      whyHot: "Người tiêu dùng Gen Z đang cực kỳ quan tâm đến môi trường. Bao bì trông 'mộc' tạo cảm giác an tâm.",
      suggestion: "Áp dụng cho các dòng hộp quà tặng cao cấp hoặc túi giấy cho shop thời trang organic của Nhật Hàn.",
      score: 95
    },
    {
      id: 'trend-02',
      title: "Cyberpunk Gradient (Hiệu ứng Neon)",
      category: "Ấn phẩm Marketing",
      image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop",
      description: "Sử dụng các dải màu chuyển động mạnh giữa tím, xanh neon và hồng.",
      whyHot: "Ảnh hưởng từ văn hóa Game và Tech. Cực kỳ bắt mắt trên Facebook/TikTok Feed.",
      suggestion: "Dùng cho các banner quảng cáo dịch vụ in nhanh hoặc các mẫu tờ rơi cho sự kiện công nghệ.",
      score: 88
    },
    {
      id: 'trend-03',
      title: "Tactile Textures (Bề mặt xúc giác)",
      category: "Kỹ thuật in",
      image: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?q=80&w=1000&auto=format&fit=crop",
      description: "In dập nổi (Embossing) hoặc phủ UV định hình tạo chiều sâu cho bề mặt giấy.",
      whyHot: "Khách hàng muốn cảm giác 'chạm' thật khi cầm sản phẩm. Tăng giá trị cảm nhận của thương hiệu.",
      suggestion: "Đẩy mạnh dịch vụ in dập nổi cho danh thiếp cao cấp và bìa Catalogue của khách hàng Nhật Hàn.",
      score: 92
    }
  ];

  return NextResponse.json({ trends });
}
