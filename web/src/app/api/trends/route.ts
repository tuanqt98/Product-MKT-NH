import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const TREND_POOL = [
  {
    id: 'trend-04',
    title: "Y2K Revival (Thẩm mỹ năm 2000)",
    category: "Design Concept",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop",
    description: "Font chữ bong bóng, màu sắc ánh kim (metallic) và họa tiết cánh bướm, trái tim.",
    whyHot: "Sự quay lại mạnh mẽ của thời trang và đồ họa thập niên 2000, tạo cảm giác hoài niệm nhưng hiện đại.",
    suggestion: "Thiết kế bộ Sticker hoặc tem nhãn cho các thương hiệu mỹ phẩm, phụ kiện trẻ trung.",
    score: 90
  },
  {
    id: 'trend-05',
    title: "Augmented Reality (Nhãn dán AR)",
    category: "Công nghệ in",
    image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?q=80&w=1000&auto=format&fit=crop",
    description: "Tích hợp mã QR dẫn đến trải nghiệm thực tế ảo tăng cường trên điện thoại.",
    whyHot: "Xóa nhòa khoảng cách giữa sản phẩm vật lý và kỹ thuật số. Tạo sự thích thú cho người dùng.",
    suggestion: "Áp dụng cho thiệp mời sự kiện hoặc bao bì sản phẩm quà tặng Tết của Nhật Hàn.",
    score: 96
  },
  {
    id: 'trend-06',
    title: "Mono-material (Bao bì đơn chất)",
    category: "Bền vững",
    image: "https://images.unsplash.com/photo-1605600611284-195205ef91b2?q=80&w=1000&auto=format&fit=crop",
    description: "Toàn bộ sản phẩm chỉ dùng một loại chất liệu để dễ dàng tái chế hoàn toàn.",
    whyHot: "Quy định khắt khe về môi trường và mong muốn cắt giảm rác thải nhựa của doanh nghiệp.",
    suggestion: "Tư vấn cho khách hàng các mẫu túi giấy thay thế hoàn toàn cho túi nilon cán màng.",
    score: 94
  },
  {
    id: 'trend-07',
    title: "Maximalist Typography",
    category: "Layout",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop",
    description: "Sử dụng chữ cái khổng lồ, biến dạng hoặc chồng lấp lên nhau để làm điểm nhấn chính.",
    whyHot: "Phá vỡ các quy tắc thiết kế an toàn, tạo sự phá cách và ấn tượng mạnh mẽ ngay lập tức.",
    suggestion: "Áp dụng cho bìa sổ tay quà tặng hoặc poster quảng bá chiến dịch MKT mới.",
    score: 87
  },
  {
    id: 'trend-08',
    title: "Pastel Memphis (Họa tiết hình học)",
    category: "Decor",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop",
    description: "Kết hợp các hình khối cơ bản (tròn, tam giác, zigzag) với tông màu pastel dịu nhẹ.",
    whyHot: "Tạo cảm giác vui nhộn, năng động nhưng vẫn thanh lịch và không quá gắt.",
    suggestion: "Thiết kế họa tiết lót cho hộp quà hoặc bao bì văn phòng phẩm cao cấp.",
    score: 89
  },
  {
    id: 'trend-09',
    title: "Botanical Illustrations",
    category: "Art Style",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1000&auto=format&fit=crop",
    description: "Hình vẽ minh họa cỏ cây hoa lá theo phong cách sách bách khoa toàn thư cổ điển.",
    whyHot: "Phù hợp với xu hướng 'Wellness' và 'Self-care'. Tạo cảm giác thủ công và sang trọng.",
    suggestion: "Áp dụng cho bao bì trà, nến thơm hoặc các sản phẩm thủ công nghệ thuật.",
    score: 93
  },
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

export async function GET() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Offset để đảm bảo hôm nay (ngày 135) sẽ không ra nhóm đầu tiên
  const offset = 1; 
  const startIndex = ((dayOfYear + offset) % (TREND_POOL.length / 3 | 0)) * 3;
  const dailyTrends = TREND_POOL.slice(startIndex, startIndex + 3);

  if (dailyTrends.length < 3) {
    dailyTrends.push(...TREND_POOL.slice(0, 3 - dailyTrends.length));
  }

  return NextResponse.json({ trends: dailyTrends });
}
