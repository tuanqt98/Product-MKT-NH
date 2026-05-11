import React from 'react';
import { 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  TrendingUp, 
  Zap,
  Target
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
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={120} className="text-primary" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Khởi tạo kế hoạch Marketing mới</h3>
              <p className="text-muted-foreground mb-8 max-w-md">
                Sử dụng 29 kỹ năng AI chuyên sâu để xây dựng chiến lược truyền thông toàn diện cho xưởng in.
              </p>
              <div className="flex gap-4">
                <button className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
                  Bắt đầu ngay
                </button>
                <button className="glass px-8 py-3 rounded-xl font-bold hover:bg-accent transition-colors">
                  Xem thư viện
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="glass p-6 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-colors">
              <h4 className="font-bold mb-2">Chiến lược In ấn</h4>
              <p className="text-xs text-muted-foreground">Tối ưu quy trình bao bì & nhãn mác.</p>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-colors">
              <h4 className="font-bold mb-2">Content Facebook</h4>
              <p className="text-xs text-muted-foreground">Thu hút khách hàng tiềm năng B2B.</p>
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
