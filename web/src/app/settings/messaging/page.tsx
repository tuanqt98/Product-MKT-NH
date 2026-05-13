"use client";

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Bot,
  User,
  Zap,
  Settings2,
  Clock,
  ShieldCheck,
  Info,
  Save,
  PauseCircle,
  PlayCircle,
  CheckCircle,
  Moon,
  Sun,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoReplyConfig {
  enabled: boolean;
  mode: 'full' | 'suggestion';
  pauseDurationMinutes: number;
  activeHours: {
    enabled: boolean;
    startHour: number;
    endHour: number;
  };
  greeting: string;
  updatedAt: string;
}

export default function MessagingSettings() {
  const [config, setConfig] = useState<AutoReplyConfig>({
    enabled: false,
    mode: 'suggestion',
    pauseDurationMinutes: 30,
    activeHours: { enabled: false, startHour: 22, endHour: 7 },
    greeting: 'Xin chào! Cảm ơn bạn đã liên hệ Nhật Hàn. Mình có thể giúp gì cho bạn ạ? 😊',
    updatedAt: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Tải cấu hình
  useEffect(() => {
    const loadConfig = async () => {
      // 1. Lấy từ localStorage trước
      let currentConfig = config;
      const localData = localStorage.getItem('nh_messaging_config');
      if (localData) {
        try {
          currentConfig = JSON.parse(localData);
          setConfig(currentConfig);
        } catch (e) {}
      }

      // 2. Lấy từ server
      try {
        const res = await fetch('/api/messaging/settings');
        const serverData = await res.json();
        
        if (serverData && serverData.updatedAt) {
          const serverTime = new Date(serverData.updatedAt).getTime();
          const localTime = currentConfig.updatedAt ? new Date(currentConfig.updatedAt).getTime() : 0;

          // Chỉ ghi đè nếu dữ liệu server mới hơn dữ liệu local
          if (serverTime > localTime) {
            setConfig(serverData);
            localStorage.setItem('nh_messaging_config', JSON.stringify(serverData));
          }
        }
      } catch (err) {
        console.error('Failed to sync with server:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      const newConfig = { ...config, updatedAt: now };
      
      // Lưu vào trình duyệt ngay lập tức
      setConfig(newConfig);
      localStorage.setItem('nh_messaging_config', JSON.stringify(newConfig));

      // Gửi lên server
      const res = await fetch('/api/messaging/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
      
      if (!res.ok) throw new Error('Server error');
      
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error('Failed to save:', err);
      alert('Không thể lưu cấu hình lên server, nhưng đã lưu tạm trên trình duyệt của bạn.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              <MessageSquare size={20} />
            </div>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary">Cấu hình Hội thoại</h2>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Smart AI Auto-Reply</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Thiết lập cách AI tương tác với khách hàng trên Facebook Messenger. Đảm bảo trải nghiệm chuyên nghiệp và cá nhân hóa.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black shadow-lg transition-all",
            saved
              ? "bg-emerald-500 text-white shadow-emerald-500/25"
              : "bg-primary text-primary-foreground shadow-primary/25 hover:scale-105 active:scale-95",
            isSaving && "opacity-50"
          )}
        >
          {saved ? (
            <><CheckCircle size={18} /> Đã lưu!</>
          ) : isSaving ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang lưu...</>
          ) : (
            <><Save size={18} /> Lưu cấu hình</>
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-8">

          {/* Master Switch */}
          <div className={cn(
            "glass p-8 rounded-[2.5rem] border transition-all duration-500",
            config.enabled ? "border-primary/50 shadow-2xl shadow-primary/10" : "border-white/5"
          )}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className={cn(
                  "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500",
                  config.enabled ? "bg-primary text-white rotate-6" : "bg-white/5 text-muted-foreground"
                )}>
                  <Bot size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black">Tự động trả lời tin nhắn</h3>
                  <p className="text-sm text-muted-foreground mt-1">Cho phép AI phản hồi khách hàng khi bạn không trực tuyến.</p>
                </div>
              </div>

              <button
                onClick={() => setConfig(c => ({ ...c, enabled: !c.enabled }))}
                className={cn(
                  "relative w-20 h-10 rounded-full transition-colors duration-300 focus:outline-none p-1 shrink-0",
                  config.enabled ? "bg-primary" : "bg-white/10"
                )}
              >
                <div className={cn(
                  "absolute top-1 left-1 bg-white w-8 h-8 rounded-full shadow-lg transform transition-transform duration-300 flex items-center justify-center",
                  config.enabled ? "translate-x-10 text-primary" : "translate-x-0 text-slate-400"
                )}>
                  {config.enabled ? <PlayCircle size={18} /> : <PauseCircle size={18} />}
                </div>
              </button>
            </div>
          </div>

          {/* Mode Selection */}
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500",
            !config.enabled && "opacity-40 pointer-events-none"
          )}>
            <button
              onClick={() => setConfig(c => ({ ...c, mode: 'full' }))}
              className={cn(
                "glass p-8 rounded-[2.5rem] border text-left transition-all group relative overflow-hidden",
                config.mode === 'full' ? "border-primary bg-primary/5 shadow-xl" : "border-white/5 hover:border-white/10"
              )}
            >
              {config.mode === 'full' && (
                <div className="absolute top-4 right-4">
                  <ShieldCheck className="text-primary" size={24} />
                </div>
              )}
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all",
                config.mode === 'full' ? "bg-primary text-white" : "bg-white/5 text-muted-foreground group-hover:scale-110"
              )}>
                <Zap size={20} />
              </div>
              <h4 className="font-black text-lg mb-2">Chế độ Tự động (Full-Auto)</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">AI sẽ tự động gửi tin nhắn phản hồi trực tiếp cho khách hàng ngay lập tức.</p>
            </button>

            <button
              onClick={() => setConfig(c => ({ ...c, mode: 'suggestion' }))}
              className={cn(
                "glass p-8 rounded-[2.5rem] border text-left transition-all group relative overflow-hidden",
                config.mode === 'suggestion' ? "border-primary bg-primary/5 shadow-xl" : "border-white/5 hover:border-white/10"
              )}
            >
              {config.mode === 'suggestion' && (
                <div className="absolute top-4 right-4">
                  <ShieldCheck className="text-primary" size={24} />
                </div>
              )}
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all",
                config.mode === 'suggestion' ? "bg-primary text-white" : "bg-white/5 text-muted-foreground group-hover:scale-110"
              )}>
                <User size={20} />
              </div>
              <h4 className="font-black text-lg mb-2">Chế độ Trợ lý (Co-pilot)</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">AI chỉ soạn nội dung nháp và hiển thị dưới dạng gợi ý để bạn duyệt trước khi gửi.</p>
            </button>
          </div>

          {/* Handover Config */}
          <div className={cn(
            "glass p-8 rounded-[3rem] border border-white/5 space-y-8 transition-all duration-500",
            !config.enabled && "opacity-40 pointer-events-none"
          )}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                <Settings2 size={24} />
              </div>
              <h3 className="text-xl font-black">Cơ chế Bàn giao (Handover)</h3>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-muted-foreground" />
                  <span className="text-sm font-bold">Thời gian tạm dừng AI khi có người thật trả lời</span>
                </div>
                <select
                  value={config.pauseDurationMinutes}
                  onChange={(e) => setConfig(c => ({ ...c, pauseDurationMinutes: parseInt(e.target.value) }))}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary transition-colors"
                >
                  <option value={15}>15 phút</option>
                  <option value={30}>30 phút</option>
                  <option value={60}>1 giờ</option>
                  <option value={120}>2 giờ</option>
                  <option value={480}>8 giờ</option>
                </select>
              </div>

              {/* Active Hours */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Moon size={18} className="text-muted-foreground" />
                    <span className="text-sm font-bold">Chỉ bật AI trong khung giờ cụ thể</span>
                  </div>
                  <button
                    onClick={() => setConfig(c => ({ ...c, activeHours: { ...c.activeHours, enabled: !c.activeHours.enabled } }))}
                    className={cn(
                      "relative w-14 h-7 rounded-full transition-colors duration-300 p-0.5",
                      config.activeHours.enabled ? "bg-primary" : "bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "bg-white w-6 h-6 rounded-full shadow transition-transform duration-300",
                      config.activeHours.enabled ? "translate-x-7" : "translate-x-0"
                    )} />
                  </button>
                </div>

                {config.activeHours.enabled && (
                  <div className="flex items-center gap-4 ml-9 p-4 bg-white/5 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Moon size={14} className="text-indigo-400" />
                      <select
                        value={config.activeHours.startHour}
                        onChange={(e) => setConfig(c => ({ ...c, activeHours: { ...c.activeHours, startHour: parseInt(e.target.value) } }))}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none"
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                        ))}
                      </select>
                    </div>
                    <span className="text-xs text-muted-foreground font-bold">đến</span>
                    <div className="flex items-center gap-2">
                      <Sun size={14} className="text-amber-400" />
                      <select
                        value={config.activeHours.endHour}
                        onChange={(e) => setConfig(c => ({ ...c, activeHours: { ...c.activeHours, endHour: parseInt(e.target.value) } }))}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none"
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Greeting */}
              <div className="space-y-3">
                <label className="text-sm font-bold flex items-center gap-2">
                  <MessageSquare size={16} className="text-muted-foreground" />
                  Tin nhắn chào mừng AI
                </label>
                <textarea
                  value={config.greeting}
                  onChange={(e) => setConfig(c => ({ ...c, greeting: e.target.value }))}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm resize-none placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Nhập tin nhắn chào mừng..."
                />
              </div>

              <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-4">
                <Info size={18} className="text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Hệ thống sẽ theo dõi tin nhắn gửi đi từ Page. Nếu phát hiện tin nhắn từ quản trị viên, AI sẽ tự động im lặng trong khoảng thời gian trên để tránh làm phiền cuộc hội thoại trực tiếp.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Zap size={150} />
            </div>
            <h4 className="text-lg font-black mb-4">Sức mạnh của AI NH</h4>
            <ul className="space-y-4">
              {[
                "Hiểu sâu về các sản phẩm in ấn Nhật Hàn",
                "Phản hồi đúng ngữ cảnh và lịch sự",
                "Tự động thu thập SĐT khách hàng",
                "Báo giá sơ bộ dựa trên dữ liệu công ty"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-white/80">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-white/5">
            <h4 className="font-black text-sm uppercase tracking-widest opacity-60 mb-6 flex items-center gap-2">
              <ShieldCheck size={16} />
              Lưu ý an toàn
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              Bạn nên sử dụng chế độ <strong className="text-white/80">Trợ lý (Co-pilot)</strong> trong 2 tuần đầu tiên để kiểm tra chất lượng câu trả lời của AI trước khi chuyển sang chế độ Tự động hoàn toàn.
            </p>
            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Kênh đang kết nối</span>
                <span className="flex items-center gap-1.5 text-[11px] font-black text-green-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  FACEBOOK
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Model AI</span>
                <span className="text-[11px] font-black text-primary">GEMINI 2.5 FLASH</span>
              </div>
              {config.updatedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Cập nhật lần cuối</span>
                  <span className="text-[11px] font-bold text-white/40">
                    {new Date(config.updatedAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
