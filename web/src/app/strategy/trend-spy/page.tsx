"use client";

import React, { useEffect, useState } from 'react';
import { 
  Zap, 
  Compass, 
  TrendingUp, 
  ArrowRight, 
  Target, 
  Eye, 
  Sparkles,
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TrendSpyPage() {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  const fetchTrends = () => {
    setLoading(true);
    fetch('/api/trends')
      .then(res => res.json())
      .then(data => {
        setTrends(data.trends);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    // Giả lập quét AI trong 3 giây
    setTimeout(() => {
      setIsScanning(false);
      fetchTrends();
    }, 3000);
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Compass size={24} className={cn(isScanning && "animate-spin")} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Radar Xu hướng</h2>
          </div>
          <p className="text-muted-foreground max-w-lg">AI đang quét hàng ngàn tín hiệu thiết kế từ Pinterest & Behance để tìm "long mạch" marketing cho Nhật Hàn.</p>
        </div>
        
        <button 
          onClick={handleScan}
          disabled={isScanning}
          className={cn(
            "relative overflow-hidden px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3",
            isScanning 
              ? "bg-muted text-muted-foreground" 
              : "bg-primary text-white hover:scale-105 shadow-xl shadow-primary/25"
          )}
        >
          {isScanning ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Đang quét Radar...
            </>
          ) : (
            <>
              <Zap size={18} />
              Quét Xu hướng mới
            </>
          )}
          {isScanning && (
            <div className="absolute inset-0 bg-primary/10 animate-pulse" />
          )}
        </button>
      </header>

      {/* Radar Status Bar */}
      <div className="glass p-4 rounded-2xl border border-indigo-500/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold">
                P
              </div>
            ))}
          </div>
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
            Nguồn: Pinterest, Behance, Meta Ads Library, TikTok Trend Center
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-black text-indigo-400 uppercase">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          Live Signal
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="glass h-96 rounded-[3rem] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trends.map((trend) => (
            <div key={trend.id} className="group relative flex flex-col bg-white/[0.03] border border-white/5 rounded-[3rem] overflow-hidden hover:border-indigo-500/30 transition-all duration-500">
              {/* Image Preview */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={trend.image} 
                  alt={trend.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                    {trend.category}
                  </span>
                </div>
                <div className="absolute bottom-6 right-6">
                  <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-indigo-500/30">
                    {trend.score}%
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-black mb-3 tracking-tighter group-hover:text-indigo-400 transition-colors">
                    {trend.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed line-clamp-3">
                    {trend.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <TrendingUp size={12} />
                      Tại sao lại Hot?
                    </h4>
                    <p className="text-xs text-white/70 leading-relaxed">
                      {trend.whyHot}
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                    <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Target size={12} />
                      Gợi ý cho Nhật Hàn
                    </h4>
                    <p className="text-xs text-white/70 leading-relaxed italic">
                      "{trend.suggestion}"
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                    Chi tiết kỹ thuật
                    <ExternalLink size={14} />
                  </button>
                  <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-indigo-400 hover:scale-105 transition-transform">
                    Lên kịch bản ngay
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Inspiration Section */}
      <div className="relative p-10 rounded-[4rem] bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 overflow-hidden text-center">
        <div className="absolute top-0 left-0 p-10 opacity-5">
          <Sparkles size={200} />
        </div>
        <div className="relative z-10 space-y-6">
          <h3 className="text-3xl font-black tracking-tight">Cần một thiết kế đột phá?</h3>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
            AI có thể tự động tạo ra hàng trăm biến thể mẫu thiết kế dựa trên các xu hướng trên để Sếp lựa chọn cho khách hàng.
          </p>
          <button className="bg-white text-indigo-900 px-10 py-5 rounded-[2rem] font-black hover:scale-105 transition-transform shadow-2xl">
            Kích hoạt AI Designer
          </button>
        </div>
      </div>
    </div>
  );
}
