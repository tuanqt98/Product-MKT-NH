"use client";

import React, { useState, useRef } from 'react';
import Script from 'next/script';
import { 
  Upload, 
  Sparkles, 
  Download, 
  Trash2, 
  Layers, 
  Check,
  Type,
  Palette,
  Layout,
  RefreshCw,
  Move
} from 'lucide-react';
import { cn } from '@/lib/utils';

const BACKGROUND_TEMPLATES = [
  { id: 'none', name: 'Trong suốt', class: 'bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")]' },
  { id: 'grad-1', name: 'Deep Ocean', class: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' },
  { id: 'grad-2', name: 'Luxury Gold', class: 'bg-gradient-to-br from-amber-900 via-stone-800 to-black' },
  { id: 'grad-3', name: 'Clean White', class: 'bg-gradient-to-br from-zinc-100 to-zinc-300' },
  { id: 'studio-1', name: 'Studio Soft', class: 'bg-[#1a1a1a]', style: { backgroundImage: 'radial-gradient(circle at center, #333 0%, #1a1a1a 100%)' } },
  { id: 'vibrant-1', name: 'Neon Power', class: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900' },
];

export default function AIStudioPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [selectedBg, setSelectedBg] = useState(BACKGROUND_TEMPLATES[0]);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [marketingText, setMarketingText] = useState('SIÊU PHẨM IN NHẬT HÀN');
  const [productPos, setProductPos] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setIsRemoved(false);
        setProcessedImage(null);
        setProductPos({ x: 0, y: 0, scale: 1 });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackground = async () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    try {
      // @ts-ignore
      if (typeof imglyBackgroundRemoval !== 'undefined') {
        // @ts-ignore
        const blob = await imglyBackgroundRemoval.removeBackground(selectedImage);
        const url = URL.createObjectURL(blob);
        setProcessedImage(url);
        setIsRemoved(true);
      } else {
        alert("AI Engine đang tải, vui lòng đợi 5-10 giây!");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi xử lý ảnh.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isRemoved) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - productPos.x, y: e.clientY - productPos.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setProductPos(prev => ({
      ...prev,
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  const downloadBanner = () => {
    const url = processedImage || selectedImage;
    if (!url) return;
    const link = document.createElement('a');
    link.download = 'nh-marketing-banner.png';
    link.href = url;
    link.click();
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] pb-12 animate-in fade-in duration-700" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <Script 
        src="https://static.imgly.com/packages/@imgly/background-removal/1.4.5/dist/index.js"
        strategy="lazyOnload"
      />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/20 rounded-xl text-primary"><Sparkles size={24} /></div>
          <h1 className="text-4xl font-black tracking-tight text-white">AI Design Studio</h1>
        </div>
        <p className="text-muted-foreground text-lg">Tách nền & Thiết kế banner Marketing chuyên nghiệp.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          {/* Step 1 */}
          <div className="glass rounded-[2rem] p-6 border border-white/5">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Upload size={18}/> 1. Tải ảnh</h3>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="w-full aspect-video rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:bg-white/5 overflow-hidden">
              {selectedImage ? <img src={selectedImage} className="w-full h-full object-cover" /> : <p className="text-xs text-white/40">Click để chọn ảnh</p>}
            </button>
          </div>

          {/* Step 2 */}
          <div className={cn("glass rounded-[2rem] p-6 border border-white/5", !selectedImage && "opacity-50")}>
            <h3 className="font-bold mb-4 flex items-center gap-2"><Sparkles size={18}/> 2. Magic Remove</h3>
            <button onClick={removeBackground} disabled={isProcessing || isRemoved} className="w-full py-4 rounded-xl bg-primary text-white font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              {isProcessing ? <RefreshCw className="animate-spin" size={18}/> : isRemoved ? <Check size={18}/> : "Tách nền ngay"}
            </button>
          </div>

          {/* Step 3 */}
          <div className={cn("glass rounded-[2rem] p-6 border border-white/5 space-y-6", !isRemoved && "opacity-50 pointer-events-none")}>
            <h3 className="font-bold flex items-center gap-2"><Palette size={18}/> 3. Tùy chỉnh Banner</h3>
            <div className="grid grid-cols-3 gap-2">
              {BACKGROUND_TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setSelectedBg(t)} className={cn("h-10 rounded-lg border-2", selectedBg.id === t.id ? "border-primary" : "border-white/5", t.class)} style={t.style} />
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase">Nội dung quảng cáo</label>
              <input type="text" value={marketingText} onChange={e => setMarketingText(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase">Phóng to: {productPos.scale.toFixed(1)}x</label>
              <input type="range" min="0.5" max="2" step="0.1" value={productPos.scale} onChange={e => setProductPos(p => ({...p, scale: parseFloat(e.target.value)}))} className="w-full accent-primary" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col h-full min-h-[600px]">
            <div className="flex-1 relative flex items-center justify-center overflow-hidden" style={selectedBg.style}>
              <div className={cn("absolute inset-0 transition-all duration-700", selectedBg.class)} />
              
              {/* Marketing Text Overlay */}
              {isRemoved && (
                <div className="absolute top-12 w-full text-center px-10 pointer-events-none z-10 animate-in slide-in-from-top duration-700">
                  <h2 className="text-5xl font-black text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] italic tracking-tighter">
                    {marketingText}
                  </h2>
                </div>
              )}

              {selectedImage && (
                <div 
                  className={cn("relative cursor-move transition-transform duration-200", isDragging && "scale-[1.02]")}
                  onMouseDown={handleMouseDown}
                  style={{ 
                    transform: `translate(${productPos.x}px, ${productPos.y}px) scale(${productPos.scale})`,
                    zIndex: 5
                  }}
                >
                  <img 
                    src={isRemoved ? processedImage! : selectedImage} 
                    className={cn("max-w-[400px] h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]", isProcessing && "opacity-50 blur-sm")} 
                  />
                  {isRemoved && !isProcessing && (
                    <div className="absolute -top-4 -right-4 p-2 bg-primary rounded-full text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <Move size={16} />
                    </div>
                  )}
                </div>
              )}

              {isProcessing && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-20">
                  <RefreshCw className="animate-spin text-primary" size={48} />
                  <p className="font-bold text-white animate-pulse uppercase tracking-widest text-xs">AI is designing...</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-white/5 border-t border-white/5 flex justify-between items-center">
              <button onClick={() => {setSelectedImage(null); setIsRemoved(false);}} className="text-white/40 hover:text-red-400 transition-colors"><Trash2 size={20}/></button>
              <button onClick={downloadBanner} disabled={!isRemoved} className="px-10 py-4 bg-white text-black rounded-2xl font-black text-sm hover:bg-primary hover:text-white transition-all disabled:opacity-50">
                TẢI BANNER VỀ MÁY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
