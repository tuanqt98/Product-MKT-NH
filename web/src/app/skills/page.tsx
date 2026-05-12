"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ArrowRight, Search, LayoutGrid, Filter, 
  Target, PenTool, BarChart3, Settings2, UserCircle2, 
  ChevronRight, Star, Zap, ShieldCheck, Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mapping cho tên kỹ năng và giới thiệu tiếng Việt
const SKILL_DETAILS: Record<string, { name: string, intro: string, icon?: any, color?: string }> = {
  "00-ke-hoach-mkt": { name: "Lập Kế hoạch Marketing Tổng thể", intro: "Xây dựng chiến lược Fullstack từ A-Z cho doanh nghiệp.", color: "from-blue-500 to-indigo-600" },
  "01-lich-noi-dung": { name: "Lập Lịch Nội dung Tháng", intro: "Quản lý kế hoạch đăng bài đa kênh khoa học và nhất quán.", color: "from-pink-500 to-rose-600" },
  "02-brief-chien-dich": { name: "Brief Chiến dịch Sáng tạo", intro: "Tạo bản yêu cầu chi tiết cho các chiến dịch quảng cáo bùng nổ.", color: "from-orange-500 to-amber-600" },
  "03-danh-gia-hieu-suat": { name: "Đánh giá Hiệu quả Chiến dịch", intro: "Phân tích chỉ số và tối ưu hóa các chiến dịch đang thực thi.", color: "from-emerald-500 to-teal-600" },
  "04-script-video": { name: "Kịch bản Video Viral", intro: "Viết kịch bản ngắn (TikTok/Reels) thu hút hàng triệu lượt xem.", color: "from-purple-500 to-violet-600" },
  "05-copy-quang-cao": { name: "Copywriting Quảng cáo Thôi miên", intro: "Viết nội dung quảng cáo tập trung vào chuyển đổi đơn hàng.", color: "from-red-500 to-orange-600" },
  "06-brief-ugc-egc": { name: "Brief Video UGC/Review", intro: "Hướng dẫn sản xuất video trải nghiệm sản phẩm thực tế từ khách hàng.", color: "from-cyan-500 to-blue-600" },
  "07-bao-cao-marketing": { name: "Báo cáo Marketing Tự động", intro: "Tổng hợp kết quả công việc hàng tuần/tháng một cách trực quan.", color: "from-slate-500 to-gray-600" },
  "08-nghien-cuu-doi-thu": { name: "Nghiên cứu Đối thủ Chuyên sâu", intro: "Phân tích điểm mạnh, điểm yếu và tìm khe hở thị trường.", color: "from-indigo-500 to-purple-600" },
  "09-insight-khach-hang": { name: "Giải mã Insight Khách hàng", intro: "Thấu hiểu nỗi đau và những mong muốn thầm kín của khách.", color: "from-amber-500 to-yellow-600" },
  "10-tinh-kpi-nguoc": { name: "Tính KPI & Ngân sách Ngược", intro: "Xác định ngân sách cần thiết dựa trên mục tiêu doanh thu mong muốn.", color: "from-green-500 to-emerald-600" },
  "11-thiet-lap-kenh": { name: "Thiết lập Kênh Social Chuẩn SEO", intro: "Cấu hình chuyên nghiệp cho các nền tảng mạng xã hội.", color: "from-sky-500 to-indigo-600" },
  "12-brief-landing-page": { name: "Cấu trúc Landing Page Chuyển đổi", intro: "Thiết kế trang đích tối ưu hóa trải nghiệm người dùng.", color: "from-violet-500 to-fuchsia-600" },
  "13-phan-tich-du-lieu": { name: "Phân tích Dữ liệu Marketing", intro: "Tìm ra các điểm nghẽn trong phễu bán hàng của bạn.", color: "from-blue-600 to-cyan-600" },
  "14-email-marketing": { name: "Email Marketing Automation", intro: "Xây dựng chuỗi email chăm sóc khách hàng tự động.", color: "from-rose-500 to-pink-600" },
  "15-social-listening": { name: "Theo dõi Dư luận & Thương hiệu", intro: "Lắng nghe phản hồi của khách hàng trên toàn bộ internet.", color: "from-teal-500 to-green-600" },
  "16-marketing-psychology": { name: "Tâm lý học trong Marketing", intro: "Ứng dụng các hiệu ứng tâm lý để tác động hành vi mua hàng.", color: "from-indigo-600 to-blue-700" },
  "17-pricing-strategy": { name: "Chiến lược Giá & Khuyến mãi", intro: "Tối ưu giá bán để tăng trưởng cả doanh thu và lợi nhuận.", color: "from-orange-600 to-red-600" },
  "18-referral-program": { name: "Hệ thống Giới thiệu (Referral)", intro: "Xây dựng chương trình khách hàng giới thiệu khách hàng bền vững.", color: "from-emerald-600 to-green-700" },
  "19-ab-test-setup": { name: "Thiết lập Thử nghiệm A/B", intro: "Kiểm chứng các phương án marketing để chọn ra cái tốt nhất.", color: "from-blue-500 to-sky-600" },
  "20-brief-client-intake": { name: "Tiếp nhận Thông tin Khách hàng", intro: "Quy trình lấy thông tin dự án chuyên nghiệp và đầy đủ.", color: "from-gray-600 to-slate-700" },
  "21-audit-ads-performance": { name: "Kiểm toán Quảng cáo (Ads Audit)", intro: "Soát lỗi và tối ưu hóa ngân sách quảng cáo hiện có.", color: "from-red-600 to-rose-700" },
  "22-personal-brand-context": { name: "Định vị Thương hiệu Cá nhân", intro: "Xác định giá trị cốt lõi và hình ảnh cá nhân độc bản.", color: "from-fuchsia-500 to-purple-600" },
  "23-personal-brand-strategy": { name: "Chiến lược Phủ thương hiệu", intro: "Lộ trình xây dựng tầm ảnh hưởng trên đa nền tảng.", color: "from-violet-600 to-indigo-700" },
  "24-ai-avatar-production": { name: "Sản xuất AI Avatar & Virtual Human", intro: "Tạo nhân vật ảo đại diện cho thương hiệu cá nhân/doanh nghiệp.", color: "from-indigo-500 to-blue-600" },
  "25-voice-clone-podcast": { name: "Voice Clone & Podcast AI", intro: "Chuyển văn bản thành giọng nói cá nhân hóa cho nội dung.", color: "from-rose-600 to-orange-600" },
  "26-thought-leadership-content": { name: "Nội dung Chuyên gia dẫn dắt", intro: "Viết bài khẳng định vị thế và uy tín trong ngành.", color: "from-amber-600 to-yellow-700" },
  "27-personal-brand-monetize": { name: "Khai thác Doanh thu từ Thương hiệu", intro: "Các phương án chuyển đổi tầm ảnh hưởng thành lợi nhuận.", color: "from-green-600 to-teal-700" },
  "28-community-building": { name: "Xây dựng Cộng đồng trung thành", intro: "Phát triển nhóm khách hàng đồng hành lâu dài cùng thương hiệu.", color: "from-sky-600 to-blue-700" },
};

export default function AllSkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        setSkills(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = [
    { id: 'all', name: 'Tất cả kỹ năng', icon: LayoutGrid },
    { id: 'strategy', name: 'Chiến lược', icon: Target },
    { id: 'content', name: 'Nội dung', icon: PenTool },
    { id: 'performance', name: 'Hiệu suất', icon: BarChart3 },
    { id: 'operations', name: 'Vận hành', icon: Settings2 },
    { id: 'personal', name: 'Personal Brand', icon: UserCircle2 },
  ];

  const filteredSkills = useMemo(() => {
    return skills.filter(s => {
      const detail = SKILL_DETAILS[s.id] || { name: s.name, intro: s.description };
      const matchesSearch = detail.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            detail.intro.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Map category 'personal' if skill id starts with 22-28
      let cat = s.category;
      const skillNum = parseInt(s.id.split('-')[0]);
      if (skillNum >= 22 && skillNum <= 28) cat = 'personal';

      const matchesCategory = activeCategory === 'all' || cat === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [skills, searchTerm, activeCategory]);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="relative py-10 px-8 rounded-[3rem] overflow-hidden bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-white/10">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <Sparkles size={150} className="text-primary" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/30">
              <LayoutGrid size={28} />
            </div>
            <h2 className="text-4xl font-black tracking-tight">Thư viện Kỹ năng AI</h2>
          </div>
          <p className="text-lg text-white/60 leading-relaxed">
            Hệ thống 29 kỹ năng chuyên gia được huấn luyện riêng biệt cho đội ngũ Marketing Nhật Hàn. 
            Tối ưu hóa quy trình từ lập kế hoạch đến thực thi đa kênh.
          </p>
        </div>
      </header>

      <div className="sticky top-4 z-30 flex flex-col md:flex-row gap-4 items-center bg-background/60 backdrop-blur-2xl p-4 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={20} />
          <input 
            type="text" 
            placeholder="Tìm kiếm sức mạnh AI..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-3xl py-3.5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-medium"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-6 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border",
                activeCategory === cat.id 
                  ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105" 
                  : "bg-white/5 text-white/40 border-transparent hover:bg-white/10 hover:text-white"
              )}
            >
              <cat.icon size={14} />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass h-64 rounded-[2.5rem] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSkills.length > 0 ? filteredSkills.map((skill) => {
            const detail = SKILL_DETAILS[skill.id] || { name: skill.name, intro: skill.description, color: "from-gray-500 to-slate-600" };
            return (
              <Link 
                key={skill.id} 
                href={`/skills/${skill.id}`}
                className="group relative flex flex-col bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 hover:bg-white/[0.06] hover:border-primary/30 transition-all duration-500 overflow-hidden"
              >
                {/* Background Gradient Glow */}
                <div className={cn("absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br", detail.color)} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-8">
                    <div className={cn(
                      "w-16 h-16 rounded-3xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500",
                      detail.color
                    )}>
                      <Zap size={28} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black px-3 py-1.5 bg-white/5 rounded-full text-white/40 border border-white/5">
                        {skill.id.split('-')[0]}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-black mb-3 group-hover:text-primary transition-colors leading-tight">
                    {detail.name}
                  </h3>
                  
                  <p className="text-sm text-white/40 leading-relaxed mb-8 flex-1 group-hover:text-white/60 transition-colors">
                    {detail.intro}
                  </p>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-wider">
                      Thực thi ngay
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                    <Star size={14} className="text-white/10 group-hover:text-yellow-500/40 transition-colors" />
                  </div>
                </div>
              </Link>
            );
          }) : (
            <div className="col-span-full py-32 text-center glass rounded-[3rem] border border-dashed border-white/10">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/20">
                <Search size={32} />
              </div>
              <h4 className="text-xl font-bold text-white/60">Không tìm thấy kỹ năng phù hợp</h4>
              <p className="text-sm text-white/30 mt-2">Thử tìm kiếm với từ khóa khác nhé Sếp!</p>
            </div>
          )}
        </div>
      )}

      <footer className="mt-20 p-10 glass rounded-[3rem] border border-white/5 text-center">
        <div className="max-w-xl mx-auto">
          <ShieldCheck size={40} className="mx-auto mb-6 text-primary/60" />
          <h3 className="text-xl font-bold mb-3">Hệ thống Kỹ năng Độc quyền</h3>
          <p className="text-sm text-white/40 leading-relaxed">
            Mọi kỹ năng đều được bảo mật và tối ưu theo ngữ cảnh kinh doanh của Nhật Hàn. 
            Dữ liệu đầu ra được chuẩn hóa cho việc triển khai thực tế trên các nền tảng quảng cáo và mạng xã hội.
          </p>
        </div>
      </footer>
    </div>
  );
}
