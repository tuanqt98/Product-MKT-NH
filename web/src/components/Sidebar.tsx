"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Video, 
  Megaphone, 
  Users, 
  Settings, 
  BarChart3,
  ChevronRight,
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Thư viện AI', icon: LayoutGrid, href: '/skills' },
  { name: 'Facebook Insights', icon: BarChart3, href: '/strategy/facebook-insights' },
  { name: 'Nội dung', icon: FileText, href: '/content' },
  { name: 'Video Script', icon: Video, href: '/video' },
  { name: 'Quảng cáo', icon: Megaphone, href: '/ads' },
  { name: 'Cá nhân hóa', icon: Users, href: '/personal-brand' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen glass border-r fixed left-0 top-0 z-40 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold gradient-text">Đời Buồn JQK</h1>
        <p className="text-xs text-muted-foreground mt-1">Hệ thống quản lý Nhật Hàn</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={cn(isActive ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-secondary/50 rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              NH
            </div>
            <div>
              <p className="text-sm font-semibold">Admin Nhật Hàn</p>
              <p className="text-xs text-muted-foreground">Pro Plan</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-accent rounded-lg transition-colors">
            <Settings size={14} />
            Cài đặt hệ thống
          </button>
        </div>
      </div>
    </aside>
  );
}
