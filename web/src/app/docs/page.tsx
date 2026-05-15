"use client";

import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Zap, 
  MessageSquare, 
  BarChart3, 
  ShieldCheck, 
  ArrowLeft,
  LayoutGrid,
  CheckCircle2,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const sections = [
  {
    id: 'overview',
    title: 'Tổng quan hệ thống',
    icon: BookOpen,
    color: 'text-blue-400',
    content: 'Hệ điều hành Marketing thông minh thiết kế riêng cho hệ sinh thái Nhật Hàn. Tối ưu hóa quy trình từ lập chiến lược, sản xuất nội dung đến tương tác khách hàng tự động.'
  },
  {
    id: 'skills',
    title: 'Thư viện 29+ Kỹ năng AI',
    icon: LayoutGrid,
    color: 'text-pink-400',
    content: 'Kho kỹ năng chuyên gia: Lập kế hoạch MKT, Viết kịch bản Viral, Copywriting quảng cáo, Nghiên cứu đối thủ, Định vị thương hiệu cá nhân.'
  },
  {
    id: 'messenger',
    title: 'Smart AI Messenger',
    icon: MessageSquare,
    color: 'text-emerald-400',
    content: 'Tự động trả lời khách hàng 24/7 (Full-Auto) hoặc hỗ trợ soạn nháp (Co-pilot). Tự động bàn giao khi có nhân viên vào chat.'
  },
  {
    id: 'radar',
    title: 'Radar Xu hướng',
    icon: Zap,
    color: 'text-yellow-400',
    content: 'Theo dõi thị trường thời gian thực, giải mã lý do xu hướng đang hot và đề xuất cách áp dụng hiệu quả cho ngành in ấn.'
  }
];

export default function DocsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <header className="relative p-10 md:p-16 rounded-[3rem] overflow-hidden bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-white/10 text-center md:text-left">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={14} /> Quay lại Dashboard
        </Link>
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <div className="p-4 bg-primary text-white rounded-[1.5rem] shadow-2xl shadow-primary/40">
            <BookOpen size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">Hướng dẫn sử dụng</h1>
            <p className="text-white/60 text-sm md:text-lg max-w-xl leading-relaxed">
              Làm chủ hệ điều hành Marketing AI để bứt phá hiệu suất công việc tại Nhật Hàn.
            </p>
          </div>
        </div>
      </header>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {sections.map((section) => (
          <div key={section.id} className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all duration-500 group">
            <div className={cn("p-3 w-fit rounded-2xl bg-white/5 mb-6 group-hover:scale-110 transition-transform", section.color)}>
              <section.icon size={24} />
            </div>
            <h3 className="text-xl font-black mb-4">{section.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>

      {/* Main Guide Content */}
      <div className="space-y-16">
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl font-black tracking-tight">1. Khởi động với Kỹ năng AI</h2>
          </div>
          <div className="space-y-6 ml-4">
            {[
              { step: '01', title: 'Chọn kỹ năng phù hợp', desc: 'Truy cập Thư viện AI, sử dụng bộ lọc (Chiến lược, Nội dung, Vận hành) để tìm công cụ bạn cần.' },
              { step: '02', title: 'Nhập yêu cầu (Prompt)', desc: 'Hãy cung cấp đủ thông tin. Ví dụ: "Viết kịch bản TikTok 30s giới thiệu in túi giấy kraft cho shop quần áo".' },
              { step: '03', title: 'Tương tác & Hiệu chỉnh', desc: 'Bạn có thể yêu cầu AI sửa lại, thêm ý tưởng hoặc đổi phong cách viết cho đến khi ưng ý.' }
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <span className="text-3xl font-black text-primary/20">{item.step}</span>
                <div>
                  <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
            <h2 className="text-2xl font-black tracking-tight">2. Quản lý AI Auto-Reply</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ml-4">
            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-3 mb-4 text-emerald-400">
                <ShieldCheck size={20} />
                <h4 className="font-bold">Chế độ Trợ lý (Co-pilot)</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Khuyên dùng trong 2 tuần đầu. AI sẽ soạn nháp câu trả lời, bạn chỉ cần bấm "Duyệt & Gửi" trong Hộp thư.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <Zap size={20} />
                <h4 className="font-bold">Chế độ Tự động (Full-Auto)</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                AI tự động xử lý toàn bộ hội thoại khi bạn vắng mặt. Hệ thống sẽ tự im lặng nếu phát hiện Admin vào chat.
              </p>
            </div>
          </div>
        </section>

        <section className="p-10 md:p-12 rounded-[3rem] bg-gradient-to-br from-primary/10 to-indigo-500/10 border border-primary/20 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Lightbulb size={200} className="text-primary" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
              <Sparkles size={24} className="text-yellow-400" />
              Mẹo cho Sếp
            </h3>
            <ul className="space-y-4">
              {[
                'Sử dụng nút PINK PASTEL ở cuối Sidebar để đổi sang giao diện Rose rực rỡ.',
                'Luôn kiểm tra Radar Xu hướng mỗi sáng để không bỏ lỡ các trend in ấn mới nhất.',
                'Sử dụng phím Enter để gửi nhanh tin nhắn trong mục Messaging.',
                'Cấu hình khung giờ hoạt động cho AI để AI chỉ trực khi bạn đã tan làm.'
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <footer className="text-center pt-12 border-t border-white/5">
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.3em]">
          NHẬT HÀN JKC — MARKETING OS v2.0
        </p>
      </footer>
    </div>
  );
}
