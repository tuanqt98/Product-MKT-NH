"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Video, 
  Megaphone, 
  Users, 
  Settings, 
  MessageSquare,
  Inbox,
  BarChart3,
  ChevronRight,
  LayoutGrid,
  Menu,
  X,
  Zap,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Thư viện AI', icon: LayoutGrid, href: '/skills' },
  { name: 'Facebook Insights', icon: BarChart3, href: '/strategy/facebook-insights' },
  { name: 'Nội dung', icon: FileText, href: '/content' },
  { name: 'Video Script', icon: Video, href: '/video' },
  { name: 'Quảng cáo', icon: Megaphone, href: '/ads' },
  { name: 'Radar Xu hướng', icon: Zap, href: '/strategy/trend-spy' },
  { name: 'AI Studio', icon: Sparkles, href: '/content/ai-studio' },
  { name: 'Cá nhân hóa', icon: Users, href: '/personal-brand' },
  { name: 'Hộp thư', icon: Inbox, href: '/messaging' },
  { name: 'Cài đặt AI Chat', icon: MessageSquare, href: '/settings/messaging' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed lg:sticky inset-y-0 left-0 z-40 w-72 h-screen glass border-r flex flex-col transform transition-all duration-300 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">NH <span className="text-primary">AI</span></h1>
          </div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest opacity-60">Marketing OS</p>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]" 
                    : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
                )}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <item.icon size={20} className={cn(
                    "transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"
                  )} />
                  <span className="font-semibold text-[0.95rem] tracking-tight">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} className="relative z-10 opacity-70" />}
                
                {/* Hover Glow Effect */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-gradient-to-br from-secondary/80 to-secondary/40 backdrop-blur-md rounded-[2rem] p-5 border border-white/5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <Settings size={80} />
            </div>
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-400 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
                  QT
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background" />
              </div>
              <div>
                <p className="text-[0.95rem] font-bold text-foreground">Sếp Quý Tộc</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <p className="text-[0.75rem] font-bold text-primary uppercase tracking-wider">Premium Plan</p>
                </div>
              </div>
            </div>
            
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/5 relative z-10">
              <Settings size={14} />
              Cấu hình hệ thống
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
