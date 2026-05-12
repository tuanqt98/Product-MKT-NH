import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  TrendingUp, 
  Zap,
  Target,
  LayoutGrid,
  ArrowRight
} from 'lucide-react';

const stats = [
  { name: 'Chiến dịch đang chạy', value: '12', icon: Zap, color: 'text-yellow-400' },
  { name: 'Năng suất AI', value: '+45%', icon: TrendingUp, color: 'text-green-400' },
  { name: 'Thời gian tối ưu', value: '120h', icon: Clock, color: 'text-blue-400' },
  { name: 'Mục tiêu tháng', value: '85%', icon: Target, color: 'text-purple-400' },
];

export default function Dashboard() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">Chào buổi sáng, Admin!</h2>
          <p className="text-muted-foreground mt-2">Hôm nay chúng ta sẽ tối ưu hóa những gì cho Nhật Hàn?</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-full flex items-center gap-2 text-primary text-sm font-medium">
          <Sparkles size={16} />
          AI v2.0 Online
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass p-6 rounded-3xl border hover:border-primary/50 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-background/50 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <ArrowUpRight size={20} />
              </button>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.name}</p>
              <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* Main Action Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative p-10 rounded-[3rem] overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-2xl shadow-indigo-500/20 group">
            <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700">
              <Sparkles size={180} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <LayoutGrid size={24} />
                </div>
                <span className="text-sm font-black uppercase tracking-[0.3em]">AI Marketing Intelligence</span>
              </div>
              <h3 className="text-4xl font-black mb-4 leading-tight">Thư viện 29 Kỹ năng<br />Siêu trí tuệ Marketing</h3>
              <p className="text-white/70 mb-10 max-w-md text-lg leading-relaxed">
                Đã sẵn sàng để xây dựng chiến lược, sản xuất nội dung và tối ưu hiệu suất cho Nhật Hàn.
              </p>
              <div className="flex gap-4">
                <Link href="/skills" className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black hover:scale-105 transition-transform flex items-center gap-2 shadow-xl">
                  Truy cập Thư viện
                  <ArrowRight size={20} />
                </Link>
                <button className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-colors">
                  Hướng dẫn sử dụng
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-black flex items-center gap-2 ml-2">
              <Zap size={20} className="text-yellow-500" />
              Kỹ năng gợi ý cho hôm nay
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: '00-ke-hoach-mkt', name: 'Lập Kế hoạch MKT Tổng thể', desc: 'Xây dựng chiến lược Fullstack từ A-Z.', color: 'bg-blue-500' },
                { id: '04-script-video', name: 'Kịch bản Video Viral', desc: 'TikTok/Reels thu hút triệu view.', color: 'bg-purple-500' },
              ].map((skill) => (
                <Link key={skill.id} href={`/skills/${skill.id}`} className="glass p-6 rounded-[2rem] border border-white/5 hover:border-primary/50 transition-all flex items-center gap-5 group">
                  <div className={`w-14 h-14 rounded-2xl ${skill.color} flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform`}>
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm group-hover:text-primary transition-colors">{skill.name}</h4>
                    <p className="text-[11px] text-muted-foreground mt-1">{skill.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Side Info */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border border-white/5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Clock size={18} className="text-blue-400" />
              Lịch sử gần đây
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium">Kế hoạch Fanpage Facebook</p>
                    <p className="text-[10px] text-muted-foreground">12 phút trước</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl text-white">
            <h3 className="font-bold mb-2">Product Context</h3>
            <p className="text-xs text-white/80 mb-4">Dịch vụ In ấn Nhật Hàn hiện đã sẵn sàng cho 29 kỹ năng AI.</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-colors">
              Cập nhật Context
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
