"use client";

import React, { useState, useRef } from 'react';
import Script from 'next/script';
import { 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  Trash2, 
  Layers, 
  Check,
  ChevronRight,
  Palette,
  Layout,
  RefreshCw
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setIsRemoved(false);
        setProcessedImage(null);
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
        alert("AI Engine đang được khởi tạo, vui lòng đợi vài giây và thử lại!");
      }
    } catch (error) {
      console.error("AI Error:", error);
      alert("Có lỗi khi xử lý ảnh. Vui lòng thử lại với ảnh khác.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadBanner = () => {
    const url = processedImage || selectedImage;
    if (!url) return;
    const link = document.createElement('a');
    link.download = 'nh-marketing-banner.png';
    link.href = url;
    link.click();
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] pb-12 animate-in fade-in duration-700">
      <Script 
        src="https://static.imgly.com/packages/@imgly/background-removal/1.4.5/dist/index.js"
        strategy="lazyOnload"
      />

      {/* Header Section */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/20 rounded-xl text-primary">
            <Sparkles size={24} />
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
            AI Design Studio
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Tự động tách nền sản phẩm và thiết kế banner chuyên nghiệp trong vài giây với công nghệ AI Vision (Free 100%).
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Step 1: Upload */}
          <div className="glass rounded-[2rem] p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">1</div>
              <h3 className="font-bold">Tải ảnh sản phẩm</h3>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden" 
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all group overflow-hidden relative",
                selectedImage ? "border-primary/50" : "border-white/10 hover:border-primary/30 hover:bg-white/5"
              )}
            >
              {selectedImage ? (
                <>
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-bold text-xs">
                      <RefreshCw size={14} className="animate-spin-slow" /> Thay đổi ảnh
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload size={24} className="text-white/40" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white/60">Kéo thả hoặc Click</p>
                    <p className="text-[10px] text-white/20 mt-1">Hỗ trợ JPG, PNG, WEBP</p>
                  </div>
                </>
              )}
            </button>
          </div>

          {/* Step 2: Magic Actions */}
          <div className={cn("glass rounded-[2rem] p-6 border border-white/5 transition-all", !selectedImage && "opacity-50 pointer-events-none")}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">2</div>
              <h3 className="font-bold">Xử lý AI</h3>
            </div>

            <button 
              onClick={removeBackground}
              disabled={isProcessing || isRemoved}
              className={cn(
                "w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all",
                isRemoved 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-primary text-white shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-95"
              )}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang tách nền...
                </>
              ) : isRemoved ? (
                <>
                  <Check size={18} />
                  Đã tách nền thành công
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Magic Remove Background
                </>
              )}
            </button>

            {isRemoved && (
              <p className="text-[10px] text-emerald-400/60 mt-3 text-center">
                AI đã tự động nhận diện và tách vật thể chính
              </p>
            )}
          </div>

          {/* Step 3: Select Background */}
          <div className={cn("glass rounded-[2rem] p-6 border border-white/5 transition-all", !isRemoved && "opacity-50 pointer-events-none")}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">3</div>
              <h3 className="font-bold">Chọn phông nền chuyên nghiệp</h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {BACKGROUND_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedBg(tmpl)}
                  className={cn(
                    "aspect-square rounded-xl border-2 transition-all p-1",
                    selectedBg.id === tmpl.id ? "border-primary scale-105" : "border-white/5 hover:border-white/20"
                  )}
                  title={tmpl.name}
                >
                  <div 
                    className={cn("w-full h-full rounded-lg overflow-hidden flex items-center justify-center text-[10px] font-bold text-white/40", tmpl.class)}
                    style={tmpl.style}
                  >
                    {tmpl.id === 'none' && <Layers size={16} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Preview Area */}
        <div className="lg:col-span-8">
          <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col h-full sticky top-24">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                <span className="text-xs font-bold text-white/40 ml-2 uppercase tracking-widest">Preview Workspace</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setSelectedImage(null); setIsRemoved(false); setProcessedImage(null); }}
                  className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-red-400 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 p-8 flex items-center justify-center bg-[#0a0a0a] min-h-[500px]">
              {selectedImage ? (
                <div 
                  className={cn(
                    "relative w-full max-w-2xl aspect-[4/3] rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 flex items-center justify-center",
                    selectedBg.class
                  )}
                  style={selectedBg.style}
                >
                  {/* Grid overlay for 'none' bg */}
                  {selectedBg.id === 'none' && (
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                  )}
                  
                  {/* The actual image */}
                  <img 
                    src={isRemoved ? processedImage! : selectedImage} 
                    alt="Main product" 
                    className={cn(
                      "max-w-[80%] max-h-[80%] object-contain drop-shadow-2xl transition-all duration-700",
                      isProcessing ? "opacity-40 blur-sm scale-95" : "opacity-100 scale-100",
                      isRemoved && "drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)]"
                    )} 
                  />

                  {/* Processing animation */}
                  {isProcessing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/20">
                      <div className="relative">
                        <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={32} />
                      </div>
                      <div className="px-4 py-2 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10">
                        <p className="text-xs font-black uppercase tracking-widest text-white">AI is removing background...</p>
                      </div>
                    </div>
                  )}

                  {/* Scanline effect during processing */}
                  {isProcessing && (
                    <div className="absolute inset-0 w-full h-[2px] bg-primary/60 shadow-[0_0_15px_rgba(var(--primary),0.5)] animate-scanline pointer-events-none" />
                  )}
                </div>
              ) : (
                <div className="text-center space-y-6 max-w-sm">
                  <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/5">
                    <Layout size={48} className="text-white/10" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white/40">Khu vực thiết kế trống</h4>
                    <p className="text-xs text-white/20 mt-2 leading-relaxed">
                      Vui lòng tải ảnh sản phẩm lên ở bảng điều khiển bên trái để bắt đầu sáng tạo banner marketing.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/5 bg-white/5 flex items-center justify-between">
              <div>
                {selectedImage && (
                  <div className="flex items-center gap-4 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    <span>Format: PNG</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>Quality: 4K HD</span>
                  </div>
                )}
              </div>
              <button 
                onClick={downloadBanner}
                disabled={!isRemoved}
                className={cn(
                  "px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all",
                  isRemoved 
                    ? "bg-white text-black hover:bg-primary hover:text-white hover:scale-105 active:scale-95" 
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                )}
              >
                <Download size={16} />
                Tải Banner Về Máy
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scanline {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scanline {
          animation: scanline 2s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
