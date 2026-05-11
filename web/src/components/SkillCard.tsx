import React from 'react';
import Link from 'next/link';
import { Play, FileText } from 'lucide-react';

interface SkillCardProps {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

export default function SkillCard({ id, name, description, category }: SkillCardProps) {
  return (
    <div className="glass p-6 rounded-3xl border border-white/5 hover:border-primary/50 transition-all duration-300 group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          <FileText size={20} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
          {category || 'Marketing'}
        </span>
      </div>
      
      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{name}</h3>
      <p className="text-sm text-muted-foreground mb-6 flex-1 line-clamp-2">
        {description || 'Sử dụng AI để thực hiện các tác vụ marketing chuyên sâu cho Nhật Hàn.'}
      </p>
      
      <Link 
        href={`/skills/${id}`}
        className="w-full py-3 bg-secondary hover:bg-primary hover:text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
      >
        <Play size={14} fill="currentColor" />
        Thực thi Skill
      </Link>
    </div>
  );
}
