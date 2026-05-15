"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Heart, Star, Rocket } from 'lucide-react';

export default function SpecialPage() {
  return (
    <div className="min-h-screen bg-[#fff5f7] flex items-center justify-center p-6 md:p-12 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-200/30 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/20 rounded-full blur-[100px] animate-bounce duration-[10s]" />
      
      <div className="max-w-4xl w-full z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-bold mb-8 transition-all hover:-translate-x-1 group">
          <ArrowLeft size={18} className="group-hover:scale-110 transition-transform" />
          Quay lại Dashboard
        </Link>

        <div className="glass rounded-[3rem] p-8 md:p-16 border border-white/60 shadow-2xl shadow-pink-200/50 relative overflow-hidden bg-white/40 backdrop-blur-3xl animate-in zoom-in-95 duration-1000">
          <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
            <Heart size={200} className="text-pink-500" />
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left side: Content */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100/50 rounded-full text-pink-600 text-xs font-black uppercase tracking-widest animate-bounce">
                <Sparkles size={14} />
                Special Message for You
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight tracking-tighter">
                Chúc em có buổi <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 italic">
                  báo cáo tốt nhất!
                </span>
              </h1>
              
              <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
                Mọi nỗ lực của em sẽ được đền đáp xứng đáng. Hãy tự tin tỏa sáng với những gì em đã dày công chuẩn bị nhé! 💖
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                {[
                  { icon: Star, label: "Tự tin" },
                  { icon: Rocket, label: "Thành công" },
                  { icon: Heart, label: "BabyBoo" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-5 py-3 bg-white/60 rounded-2xl shadow-sm border border-pink-100 text-pink-600 font-bold text-sm hover:scale-105 transition-all">
                    <item.icon size={16} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Image */}
            <div className="flex-1 w-full max-w-sm">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-[2.5rem] rotate-6 group-hover:rotate-3 transition-transform duration-500 opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-[2.5rem] -rotate-3 group-hover:rotate-0 transition-transform duration-500 opacity-20" />
                
                <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
                  <img 
                    src="/bao-cao.jpg" 
                    alt="Báo cáo Nhật Hàn" 
                    className="w-full h-full object-cover aspect-[4/5] group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="mt-12 text-center text-pink-400 font-bold text-sm tracking-widest uppercase opacity-60">
          Crafted with love for your big day
        </footer>
      </div>
    </div>
  );
}
