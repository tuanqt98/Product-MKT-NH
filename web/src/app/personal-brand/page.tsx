"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, ArrowRight, Sparkles, Search } from 'lucide-react';

export default function PersonalBrandSkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        // Lọc các skill liên quan đến thương hiệu cá nhân (personal brand)
        const personalSkills = data.filter((s: any) => 
          s.id.includes('personal') || 
          s.name.toLowerCase().includes('cá nhân') ||
          s.name.toLowerCase().includes('chuyên gia') ||
          s.name.toLowerCase().includes('lãnh đạo')
        );
        setSkills(personalSkills);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
            <Users size={24} />
          </div>
          <h2 className="text-3xl font-bold">Thương hiệu Cá nhân</h2>
        </div>
        <p className="text-muted-foreground">Xây dựng hình ảnh chuyên gia cho ban lãnh đạo Nhật Hàn trên các nền tảng mạng xã hội.</p>
      </header>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
        <input 
          type="text" 
          placeholder="Tìm kỹ năng thương hiệu..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass h-48 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.length > 0 ? skills.map((skill) => (
            <Link 
              key={skill.id} 
              href={`/skills/${skill.id}`}
              className="glass p-6 rounded-3xl border border-white/5 hover:border-primary/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users size={100} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{skill.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-6">
                  {skill.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                  XÂY DỰNG THƯƠNG HIỆU
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full py-20 text-center glass rounded-3xl border border-dashed border-white/10">
              <p className="text-muted-foreground">Chưa có kỹ năng nào trong mục này.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
