"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  MessageSquare,
  Inbox,
  BarChart3,
  CalendarDays,
  Database,
  FileBarChart,
  FolderKanban,
  ChevronRight,
  LayoutGrid,
  Menu,
  X,
  Zap,
  Sparkles,
  Moon,
  Flower2,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ThemeProvider';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Thư viện AI', icon: LayoutGrid, href: '/skills' },
  { name: 'Facebook Insights', icon: BarChart3, href: '/strategy/facebook-insights' },
  { name: 'Radar Xu hướng', icon: Zap, href: '/strategy/trend-spy' },
  { name: 'AI Studio', icon: Sparkles, href: '/content/ai-studio' },
  { name: 'Hộp thư', icon: Inbox, href: '/messaging' },
  { name: 'Tài sản AI', icon: FolderKanban, href: '/outputs' },
  { name: 'Lịch nội dung', icon: CalendarDays, href: '/calendar' },
  { name: 'Báo cáo tuần', icon: FileBarChart, href: '/reports' },
  { name: 'Cài đặt AI Chat', icon: MessageSquare, href: '/settings/messaging' },
  { name: 'Kết nối hệ thống', icon: Database, href: '/settings/integrations' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isPink = theme === 'pink';

  if (pathname === '/special' || pathname === '/login') return null;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setIsOpen(false);
      router.replace('/login');
      router.refresh();
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed lg:sticky inset-y-0 left-0 z-40 w-72 h-screen glass border-r flex flex-col transform transition-all duration-300 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-8">
          <div className="flex items-center gap-3 mb-1">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              isPink
                ? "bg-gradient-to-br from-rose-400 to-pink-600"
                : "bg-gradient-to-br from-indigo-500 to-purple-600"
            )}>
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-foreground">
              NHẬT HÀN <span className="text-primary">JKC</span>
            </h1>
          </div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest opacity-60">Marketing OS</p>
        </div>

        {/* Navigation */}
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
                    : "hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                )}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <item.icon size={20} className={cn(
                    "transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                  )} />
                  <span className="font-semibold text-[0.95rem] tracking-tight">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} className="relative z-10 opacity-70" />}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-6 mt-auto space-y-3">
          
          {/* ===== THEME TOGGLE BUTTON ===== */}
          <button
            onClick={toggleTheme}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all duration-500 group",
              isPink
                ? "bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200 hover:from-rose-100 hover:to-pink-100"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            )}
          >
            <div className="flex items-center gap-3">
              {/* Toggle Track */}
              <div className={cn(
                "relative w-11 h-6 rounded-full transition-all duration-500 flex-shrink-0",
                isPink 
                  ? "bg-gradient-to-r from-rose-300 to-pink-400" 
                  : "bg-slate-700"
              )}>
                {/* Toggle Thumb */}
                <div className={cn(
                  "absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all duration-500 flex items-center justify-center",
                  isPink 
                    ? "left-[22px] bg-white" 
                    : "left-0.5 bg-slate-300"
                )}>
                  {isPink 
                    ? <Flower2 size={10} className="text-rose-500" /> 
                    : <Moon size={10} className="text-slate-600" />
                  }
                </div>
              </div>
              <div>
                <p className={cn(
                  "text-xs font-black uppercase tracking-wider",
                  isPink ? "text-rose-600" : "text-muted-foreground"
                )}>
                  {isPink ? "Pink Pastel" : "Dark Mode"}
                </p>
                <p className="text-[10px] text-muted-foreground">Chuyển giao diện</p>
              </div>
            </div>
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full",
              isPink 
                ? "bg-rose-100 text-rose-500" 
                : "bg-white/10 text-muted-foreground"
            )}>
              {isPink ? "🌸" : "🌙"}
            </span>
          </button>

          {/* User Card */}
          <div className={cn(
            "rounded-[2rem] p-5 border relative overflow-hidden group",
            isPink
              ? "bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100"
              : "bg-gradient-to-br from-secondary/80 to-secondary/40 border-white/5"
          )}>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <Settings size={80} />
            </div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="relative">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg",
                  isPink
                    ? "bg-gradient-to-tr from-rose-400 to-pink-500 shadow-rose-200"
                    : "bg-gradient-to-tr from-primary to-indigo-400 shadow-primary/20"
                )}>
                  M
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background" />
              </div>
              <div>
                <p className="text-[0.95rem] font-bold text-foreground">Marketing</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <p className="text-[0.75rem] font-bold text-primary uppercase tracking-wider">Premium Plan</p>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 grid grid-cols-1 gap-2">
              <button className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold rounded-xl transition-all duration-300 border",
                isPink
                  ? "bg-white border-rose-100 text-rose-600 hover:bg-rose-50"
                  : "bg-white/5 border-white/5 text-foreground hover:bg-white/10"
              )}>
                <Settings size={14} />
                Cấu hình hệ thống
              </button>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold rounded-xl transition-all duration-300 border disabled:opacity-60",
                  isPink
                    ? "bg-white border-rose-100 text-rose-700 hover:bg-rose-50"
                    : "bg-red-500/10 border-red-500/10 text-red-300 hover:bg-red-500/15"
                )}
              >
                <LogOut size={14} />
                {loggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
