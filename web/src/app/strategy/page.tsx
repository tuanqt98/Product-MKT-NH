"use client";

import React, { useEffect, useState } from 'react';
import SkillCard from '@/components/SkillCard';
import { Search, Filter } from 'lucide-react';

export default function StrategyPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        setSkills(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold">Chiến lược Marketing</h2>
        <p className="text-muted-foreground mt-2">Các kỹ năng giúp hoạch định tầm nhìn và mục tiêu cho Nhật Hàn.</p>
      </header>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm kỹ năng..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:border-primary/50 outline-none transition-all"
          />
        </div>
        <button className="glass px-6 py-3 rounded-2xl flex items-center gap-2 text-sm font-medium">
          <Filter size={18} />
          Lọc
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass h-64 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill: any) => (
            <SkillCard 
              key={skill.id} 
              id={skill.id} 
              name={skill.name} 
              category={skill.id.startsWith('0') ? 'Strategy' : 'Content'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
