"use client";

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  MousePointer2, 
  Eye, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  Info,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

const data = [
  { name: 'Thứ 2', reach: 4500, engagement: 320, clicks: 85 },
  { name: 'Thứ 3', reach: 5200, engagement: 450, clicks: 120 },
  { name: 'Thứ 4', reach: 4800, engagement: 380, clicks: 95 },
  { name: 'Thứ 5', reach: 6100, engagement: 520, clicks: 145 },
  { name: 'Thứ 6', reach: 5900, engagement: 490, clicks: 130 },
  { name: 'Thứ 7', reach: 7200, engagement: 680, clicks: 190 },
  { name: 'Chủ Nhật', reach: 6800, engagement: 610, clicks: 165 },
];

const platformData = [
  { name: 'Facebook Page', value: 65 },
  { name: 'Instagram', value: 25 },
  { name: 'Messenger', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const stats = [
  { 
    name: 'Tổng Tiếp Cận (Reach)', 
    value: '42,500', 
    change: '+12.5%', 
    isPositive: true, 
    icon: Eye, 
    color: 'text-blue-400' 
  },
  { 
    name: 'Lượt Tương Tác', 
    value: '3,840', 
    change: '+8.2%', 
    isPositive: true, 
    icon: Users, 
    color: 'text-green-400' 
  },
  { 
    name: 'Click Liên Hệ/Báo Giá', 
    value: '930', 
    change: '-2.4%', 
    isPositive: false, 
    icon: MousePointer2, 
    color: 'text-purple-400' 
  },
  { 
    name: 'Chi Phí Trung Bình (CPC)', 
    value: '2,450đ', 
    change: '-15%', 
    isPositive: true, 
    icon: TrendingUp, 
    color: 'text-yellow-400' 
  },
];

export default function FacebookInsightsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className="text-blue-500" size={20} />
            <h2 className="text-3xl font-bold">Facebook Insights</h2>
          </div>
          <p className="text-muted-foreground">Phân tích hiệu quả marketing trên nền tảng Meta cho Nhật Hàn</p>
        </div>
        <div className="flex gap-3">
          <button className="glass px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-accent transition-colors">
            <Calendar size={16} />
            7 ngày qua
          </button>
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform flex items-center gap-2">
            Kết nối Facebook thật
            <ArrowUpRight size={16} />
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass p-6 rounded-3xl border border-white/5 hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-background/50 ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <div className={cn(
                "flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-lg",
                stat.isPositive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
              )}>
                {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{stat.name}</p>
              <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold">Xu hướng Tiếp cận & Tương tác</h3>
              <p className="text-sm text-muted-foreground">Dữ liệu tổng hợp từ chiến dịch bao bì & in ấn</p>
            </div>
            <div className="flex gap-4 text-xs font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Tiếp cận</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Tương tác</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="reach" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorReach)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorEngagement)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Charts */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 h-full">
            <h3 className="text-xl font-bold mb-6">Phân phối Nền tảng</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 mt-6">
              {platformData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-sm text-white/70">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Table / Bottom Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[2.5rem] border border-white/5">
          <h3 className="text-xl font-bold mb-6">Hiệu quả theo Loại nội dung</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Video Script', value: 85 },
                { name: 'Hình ảnh SP', value: 65 },
                { name: 'Feedback KH', value: 92 },
                { name: 'Quy trình xưởng', value: 78 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} hide />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                />
                <Bar dataKey="value" fill="#8884d8" radius={[10, 10, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#a855f7'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600/40 to-purple-800/40 border border-white/10 p-10 rounded-[2.5rem] flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Target size={240} />
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Kết nối API Facebook</h3>
            <p className="text-white/70 mb-8 max-w-md leading-relaxed">
              Bạn cần cung cấp Access Token từ Meta for Developers để hệ thống tự động cập nhật dữ liệu realtime từ Fanpage Nhật Hàn.
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-indigo-900 px-8 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-white/10 transition-all">
                Dán Token ngay
              </button>
              <button className="bg-white/10 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2">
                <Info size={18} />
                Hướng dẫn lấy Token
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
