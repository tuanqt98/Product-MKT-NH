"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Search, LayoutGrid, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AllSkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        setSkills(data);
        setFilteredSkills(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = skills;
    
    // Lọc theo search
    if (searchTerm) {
      result = result.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Lọc theo category
    if (activeCategory !== "all") {
      result = result.filter(s => s.category === activeCategory);
    }
    
    setFilteredSkills(result);
  }, [searchTerm, activeCategory, skills]);

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'strategy', name: 'Chiến lược' },
    { id: 'content', name: 'Nội dung' },
    { id: 'performance', name: 'Hiệu suất' },
    { id: 'operations', name: 'Vận hành' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              <LayoutGrid size={24} />
            </div>
            <h2 className="text-3xl font-bold">Thư viện 29 Kỹ năng AI</h2>
          </div>
          <p className="text-muted-foreground">Tổng hợp toàn bộ sức mạnh AI chuyên biệt cho Marketing Nhật Hàn.</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-medium">
          <Sparkles size={14} className="text-primary" />
          {skills.length} Kỹ năng sẵn sàng
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-[2rem] border border-white/5">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm kỹ năng..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background/50 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
                activeCategory === cat.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass h-48 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.length > 0 ? filteredSkills.map((skill) => (
            <Link 
              key={skill.id} 
              href={`/skills/${skill.id}`}
              className="glass p-6 rounded-3xl border border-white/5 hover:border-primary/50 transition-all group relative overflow-hidden flex flex-col"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Sparkles size={20} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-white/5 rounded-lg text-white/40">
                    {skill.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{skill.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-6 flex-1">
                  {skill.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                  KÍCH HOẠT SKILL
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full py-20 text-center glass rounded-3xl border border-dashed border-white/10">
              <p className="text-muted-foreground">Không tìm thấy kỹ năng phù hợp.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
