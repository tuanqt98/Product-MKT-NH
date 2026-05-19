"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  TrendingUp, 
  Zap,
  Target,
  LayoutGrid,
  ArrowRight,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';

interface FacebookPost {
  id: string;
  message?: string;
  likes: number;
  comments: number;
  created_time: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState([
    { name: 'Lượt tiếp cận (28đ)', value: '0', icon: Zap, color: 'text-yellow-400' },
    { name: 'Lượt tương tác', value: '0', icon: TrendingUp, color: 'text-green-400' },
    { name: 'Lượt xem Trang', value: '0', icon: Clock, color: 'text-blue-400' },
    { name: 'Followers mới', value: '0', icon: Target, color: 'text-purple-400' },
  ]);

  const [history, setHistory] = useState<FacebookPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/facebook/insights')
      .then(res => res.json())
      .then(data => {
        if (data.connected && data.stats) {
          setStats([
            { name: 'Lượt tiếp cận (28đ)', value: data.stats.reach.toLocaleString(), icon: Zap, color: 'text-yellow-400' },
            { name: 'Lượt tương tác', value: data.stats.engagement.toLocaleString(), icon: TrendingUp, color: 'text-green-400' },
            { name: 'Lượt xem Trang', value: data.stats.views.toLocaleString(), icon: Clock, color: 'text-blue-400' },
            { name: 'Followers mới', value: data.stats.newFans.toLocaleString(), icon: Target, color: 'text-purple-400' },
          ]);
          setHistory(data.contentAnalysis || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">Chào buổi sáng, Sếp!</h2>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">Hôm nay chúng ta sẽ tối ưu hóa những gì cho Nhật Hàn?</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/special" className="group relative px-6 py-3 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-2xl font-black text-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-pink-200/50 flex items-center gap-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 to-purple-400/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Sparkles size={16} className="animate-pulse" />
            Click me
          </Link>
          <div className="w-fit bg-primary/10 border border-primary/20 px-4 py-2 rounded-full flex items-center gap-2 text-primary text-xs md:text-sm font-bold">
            <Sparkles size={14} />
            {loading ? "Đang đồng bộ..." : "AI v2.0 Online"}
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass p-5 md:p-6 rounded-[2rem] border border-white/5 hover:border-primary/50 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-background/50 ${stat.color} shadow-inner`}>
                <stat.icon size={20} />
              </div>
              <Link href="/strategy/facebook-insights" className="text-muted-foreground hover:text-foreground p-1">
                <ArrowUpRight size={18} />
              </Link>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.name}</p>
              <h3 className="text-2xl md:text-3xl font-black mt-1 tracking-tighter">
                {loading ? "..." : stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-10">
        {/* Main Action Area */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="relative p-6 md:p-10 lg:p-12 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-2xl shadow-indigo-500/20 group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 hidden md:block">
              <Sparkles size={180} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <LayoutGrid size={20} />
                </div>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] opacity-80">AI Marketing Intelligence</span>
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight tracking-tighter">Thư viện 30 Kỹ năng<br />Siêu trí tuệ Marketing</h3>
              <p className="text-white/70 mb-8 md:mb-12 max-w-md text-sm md:text-lg leading-relaxed font-medium">
                Đã sẵn sàng để xây dựng chiến lược, sản xuất nội dung và tối ưu hiệu suất cho Nhật Hàn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/skills" className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-xl text-sm">
                  Truy cập Thư viện
                  <ArrowRight size={18} />
                </Link>
                <Link href="/docs" className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-colors text-sm flex items-center justify-center">
                  Hướng dẫn sử dụng
                </Link>
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
          <div className="glass p-6 rounded-[2.5rem] border border-white/5">
            <h3 className="font-black mb-6 flex items-center gap-2 text-sm uppercase tracking-widest opacity-60">
              <Clock size={16} className="text-blue-400" />
              Lịch sử FB Fanpage
            </h3>
            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="h-16 w-full bg-white/5 animate-pulse rounded-2xl" />)
              ) : history.length > 0 ? (
                history.slice(0, 5).map((post) => (
                  <div key={post.id} className="group flex flex-col gap-2 p-4 hover:bg-white/5 rounded-[1.5rem] transition-all cursor-pointer border border-transparent hover:border-white/5">
                    <p className="text-[13px] font-medium line-clamp-2 leading-relaxed text-white/80 group-hover:text-white transition-colors">
                      {post.message}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex gap-3 text-[10px] font-bold text-white/30 uppercase tracking-tighter">
                        <span className="flex items-center gap-1"><ThumbsUp size={10} /> {post.likes}</span>
                        <span className="flex items-center gap-1"><MessageSquare size={10} /> {post.comments}</span>
                      </div>
                      <span className="text-[10px] font-bold text-primary/60">{formatTime(post.created_time)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-10">Chưa có dữ liệu bài viết.</p>
              )}
            </div>
            
            {!loading && history.length > 0 && (
              <Link href="/strategy/facebook-insights" className="mt-6 w-full flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl transition-all">
                Xem tất cả Insights
                <ArrowRight size={14} />
              </Link>
            )}
          </div>

          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-700/20 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <Target size={120} />
            </div>
            <h3 className="text-lg font-black mb-2 relative z-10">Product Context</h3>
            <p className="text-xs text-white/50 mb-6 leading-relaxed relative z-10">Dịch vụ In ấn Nhật Hàn hiện đã sẵn sàng cho 30 kỹ năng AI.</p>
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[11px] font-black uppercase tracking-widest transition-colors border border-white/5 relative z-10">
              Cập nhật Context
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
