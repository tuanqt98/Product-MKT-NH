"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  Compass, 
  TrendingUp, 
  ArrowRight, 
  Target, 
  Sparkles,
  RefreshCw,
  Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TrendSpyPage() {
  const router = useRouter();
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState<any>(null);

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
    setTimeout(() => {
      setIsScanning(false);
      fetchTrends();
    }, 3000);
  };

  const handleCreateScript = (trend: any) => {
    localStorage.setItem('pending_trend', JSON.stringify(trend));
    router.push('/skills/04-script-video');
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Modal Chi tiết Kỹ thuật */}
      {selectedTrend && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedTrend(null)} />
          <div className="relative w-full max-w-2xl glass p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl animate-in zoom-in duration-300">
            <button 
              onClick={() => setSelectedTrend(null)}
              className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="rotate-45" size={20} />
            </button>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white">
                  <Settings2 size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black">{selectedTrend.title}</h3>
                  <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest">Thông số kỹ thuật đề xuất</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-white/40 uppercase text-[10px] tracking-widest">Vật liệu & Gia công</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      Giấy: Art Paper 300gsm / Kraft 250gsm
                    </li>
                    <li className="flex items-center gap-3 text-sm font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      In: Offset 4 màu / Kỹ thuật số chất lượng cao
                    </li>
                    <li className="flex items-center gap-3 text-sm font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      Gia công: Ép kim, Dập nổi, Phủ UV định hình
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-white/40 uppercase text-[10px] tracking-widest">Màu sắc chủ đạo (CMYK)</h4>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600" />
                    <div className="w-10 h-10 rounded-lg bg-purple-600" />
                    <div className="w-10 h-10 rounded-lg bg-slate-800" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 italic text-sm text-white/60">
                "Kỹ thuật này giúp tăng độ sang trọng và tính thẩm mỹ cao cho các sản phẩm bao bì cao cấp tại Nhật Hàn."
              </div>

              <button 
                onClick={() => handleCreateScript(selectedTrend)}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
              >
                <Zap size={18} />
                Lên kịch bản Video cho xu hướng này
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Compass size={24} className={cn(isScanning && "animate-spin")} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Radar Xu hướng</h2>
          </div>
          <p className="text-muted-foreground max-w-lg">Phát hiện các "long mạch" marketing và thiết kế bao bì mới nhất cho Nhật Hàn.</p>
        </div>
        
        <button 
          onClick={handleScan}
          disabled={isScanning}
          className={cn(
            "relative overflow-hidden px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3",
            isScanning ? "bg-muted text-muted-foreground" : "bg-primary text-white hover:scale-105 shadow-xl shadow-primary/25"
          )}
        >
          {isScanning ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} />}
          {isScanning ? "Đang quét Radar..." : "Quét Xu hướng mới"}
        </button>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="glass h-96 rounded-[3rem] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trends.map((trend) => (
            <div key={trend.id} className="group relative flex flex-col bg-white/[0.03] border border-white/5 rounded-[3rem] overflow-hidden hover:border-indigo-500/30 transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <img src={trend.image} alt={trend.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
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
                  <h3 className="text-2xl font-black mb-3 tracking-tighter group-hover:text-indigo-400 transition-colors">{trend.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed line-clamp-3">{trend.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-xs text-white/70">
                    <h4 className="font-black text-indigo-400 uppercase text-[10px] mb-1">Tại sao Hot?</h4>
                    {trend.whyHot}
                  </div>
                  <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-xs text-white/70 italic">
                    <h4 className="font-black text-emerald-400 uppercase text-[10px] mb-1">Gợi ý cho Nhật Hàn</h4>
                    "{trend.suggestion}"
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <button onClick={() => setSelectedTrend(trend)} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                    Chi tiết kỹ thuật
                    <Settings2 size={14} />
                  </button>
                  <button onClick={() => handleCreateScript(trend)} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-indigo-400 hover:scale-105 transition-transform">
                    Lên kịch bản ngay
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
