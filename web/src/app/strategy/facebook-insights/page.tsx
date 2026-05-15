"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Users,
  MousePointer2,
  Eye,
  TrendingUp,
  Target,
  BarChart3,
  Clock,
  MapPin,
  Smartphone,
  Download,
  Filter
} from 'lucide-react';

// Lazy load recharts to avoid SSR issues
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });

export default function FacebookInsightsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/facebook/insights', { cache: 'no-store' })
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-400 text-sm">Lỗi tải dữ liệu: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-sm">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const statsData = [
    { name: 'Tiếp cận', value: data?.stats?.reach ?? 0, icon: Eye, color: 'text-blue-400', change: '+12%' },
    { name: 'Tương tác', value: data?.stats?.engagement ?? 0, icon: Users, color: 'text-green-400', change: '+8%' },
    { name: 'Xem trang', value: data?.stats?.views ?? 0, icon: MousePointer2, color: 'text-purple-400', change: '+15%' },
    { name: 'Follow mới', value: data?.stats?.newFans ?? 0, icon: BarChart3, color: 'text-orange-400', change: '+5%' },
  ];

  const chartData = data?.chartData ?? [];

  const demoData = (() => {
    const defaultData = [
      { name: '18-24', value: 0 },
      { name: '25-34', value: 0 },
      { name: '35-44', value: 0 },
      { name: '45-54', value: 0 },
      { name: '55+', value: 0 },
    ];
    try {
      const demo = data?.demographics;
      if (!demo || typeof demo !== 'object' || Object.keys(demo).length === 0) return defaultData;
      const ranges = ['18-24', '25-34', '35-44', '45-54', '55-64'];
      return ranges.map(range => ({
        name: range === '55-64' ? '55+' : range,
        value: (Number(demo[`M.${range}`]) || 0) + (Number(demo[`F.${range}`]) || 0)
      }));
    } catch {
      return defaultData;
    }
  })();

  const locations = data?.locations ?? [
    { city: 'Hà Nội', percent: 62 },
    { city: 'TP. HCM', percent: 24 },
    { city: 'Bắc Ninh', percent: 10 },
    { city: 'Khác', percent: 4 },
  ];

  const locationColors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-slate-500'];

  const contentAnalysis = data?.contentAnalysis ?? [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className="text-blue-500" size={20} />
            <h2 className="text-3xl font-black tracking-tight">Facebook Insights 2.0</h2>
          </div>
          <p className="text-sm text-muted-foreground">Phân tích dữ liệu & Đối tượng khách hàng In Nhật Hàn</p>
          
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {data?.connected ? (
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-2xl animate-in slide-in-from-left duration-500">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 blur-[2px] animate-ping" />
                </div>
                <div className="flex items-center gap-2.5">
                  {data.page?.avatar && (
                    <img src={data.page.avatar} alt="avatar" className="w-6 h-6 rounded-full ring-2 ring-emerald-500/20 object-cover shadow-sm" />
                  )}
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-500">
                    Đã kết nối: <span className="text-foreground">{data.page?.name}</span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-2xl">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-red-500">Mất kết nối Facebook</span>
              </div>
            )}

            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2.5 rounded-2xl">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-400">API v20.0 - LIVE</span>
            </div>
          </div>

          {data?.error && !data.connected && <p className="text-[10px] text-red-400 mt-2 font-bold uppercase tracking-widest">⚠️ Lỗi: {data.error}</p>}
        </div>
        <div className="flex gap-3">
          <button className="glass px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
            <Download size={14} /> Xuất báo cáo
          </button>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl text-xs font-black hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
            <Filter size={14} /> Tùy chỉnh
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <div key={stat.name} className="glass p-6 rounded-3xl border border-white/5 hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}><stat.icon size={22} /></div>
              <span className="text-[10px] font-bold bg-green-500/10 text-green-400 px-2 py-1 rounded-lg">{stat.change}</span>
            </div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{stat.name}</p>
            <h3 className="text-3xl font-black mt-1 tracking-tight">{Number(stat.value || 0).toLocaleString()}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <TrendingUp className="text-primary/20" size={120} />
          </div>
          <h3 className="text-xl font-bold mb-8">Xu hướng Tăng trưởng</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'white', opacity: 0.4, fontSize: 12}} />
                <YAxis hide />
                <Tooltip contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '12px'}} />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area name="Lượt tiếp cận" type="monotone" dataKey="reach" stroke="#3b82f6" strokeWidth={4} fill="url(#colorReach)" />
                <Area name="Lượt tương tác" type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={4} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Time to Post */}
        <div className="glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clock size={20} className="text-orange-400"/> Thời điểm Vàng</h3>
            <p className="text-xs text-muted-foreground mb-6">Thời điểm khách hàng online nhiều nhất</p>
            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Đề xuất đăng bài</p>
                <p className="text-2xl font-black">20:00 - 21:30</p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tỉ lệ online cao nhất:</span>
                <span className="font-bold text-green-400">82%</span>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-white/5">
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              &quot;Đăng bài vào khung giờ này giúp tăng 45% khả năng hiển thị tự nhiên.&quot;
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Audience Demographics */}
        <div className="glass p-8 rounded-[2.5rem] border border-white/5">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Users size={20} className="text-purple-400"/> Nhóm khách hàng</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demoData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'white', opacity: 0.4, fontSize: 11}} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '12px'}} />
                <Bar dataKey="value" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-4">Đang phân tích nhóm đối tượng khách hàng...</p>
        </div>

        {/* Top Locations */}
        <div className="glass p-8 rounded-[2.5rem] border border-white/5">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><MapPin size={20} className="text-red-400"/> Khu vực trọng điểm</h3>
          <div className="space-y-4">
            {locations.map((item: any, idx: number) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>{item.city}</span>
                  <span>{item.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${locationColors[idx] || 'bg-slate-500'}`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Type Performance */}
        <div className="glass p-8 rounded-[2.5rem] border border-white/5">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Smartphone size={20} className="text-indigo-400"/> Loại nội dung xịn nhất</h3>
          <div className="space-y-6">
            {contentAnalysis.length > 0 ? contentAnalysis.slice(0, 3).map((content: any, idx: number) => (
              <div key={idx} className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold ${
                  content.type === 'video' ? "bg-indigo-500/20 text-indigo-400" : "bg-emerald-500/20 text-emerald-400"
                }`}>
                  {content.type === 'video' ? 'V' : 'P'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{String(content.message || '(Bài viết)')}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    {Number(content.reach || 0).toLocaleString()} Reach • {Number(content.engagement || 0).toLocaleString()} Eng.
                  </p>
                </div>
                {idx === 0 && <div className="text-green-400 font-black text-sm">TOP</div>}
              </div>
            )) : (
              <p className="text-xs text-muted-foreground text-center py-4">Đang phân tích bài viết...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
