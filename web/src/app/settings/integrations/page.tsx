"use client";

import React, { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle2, XCircle, KeyRound, MessageCircle, Bot, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HealthState {
  checkedAt: string;
  env: Record<string, boolean>;
  gemini: {
    configured: boolean;
    connected: boolean;
    message: string;
  };
  facebook: {
    configured: boolean;
    connected: boolean;
    message: string;
    page?: {
      id: string;
      name: string;
      fans: number;
      followers: number;
    } | null;
  };
}

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em]",
      ok ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
    )}>
      {ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
      {ok ? "Hoạt động" : "Cần kiểm tra"}
    </span>
  );
}

export default function IntegrationsPage() {
  const [data, setData] = useState<HealthState | null>(null);
  const [loading, setLoading] = useState(true);

  const loadHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/integrations/health', { cache: 'no-store' });
      setData(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadHealth();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-xl text-primary">
              <ShieldCheck size={22} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Kiểm tra kết nối</h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Kiểm tra nhanh Gemini, Facebook Page ID, Page Access Token và các biến môi trường quan trọng. Trang này không hiển thị giá trị token.
          </p>
        </div>
        <button
          onClick={loadHealth}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 disabled:opacity-60"
        >
          <RefreshCw size={16} className={cn(loading && "animate-spin")} />
          Kiểm tra lại
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="glass rounded-[2rem] border border-white/5 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Bot size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black">Gemini AI</h2>
                <p className="text-xs text-muted-foreground">Dùng cho Chat AI, Auto-Reply và phân tích hội thoại.</p>
              </div>
            </div>
            <StatusBadge ok={Boolean(data?.gemini.connected)} />
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
              <span className="text-muted-foreground">GOOGLE_GENERATIVE_AI_API_KEY</span>
              <span className={cn("font-bold", data?.env.GOOGLE_GENERATIVE_AI_API_KEY ? "text-emerald-400" : "text-red-400")}>
                {data?.env.GOOGLE_GENERATIVE_AI_API_KEY ? "Đã cấu hình" : "Thiếu"}
              </span>
            </div>
            <p className="rounded-2xl bg-white/5 p-4 text-xs text-white/60">
              {data?.gemini.message || "Đang kiểm tra..."}
            </p>
          </div>
        </section>

        <section className="glass rounded-[2rem] border border-white/5 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <MessageCircle size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black">Facebook</h2>
                <p className="text-xs text-muted-foreground">Dùng cho Insights, Inbox, Auto-Reply và đăng bài.</p>
              </div>
            </div>
            <StatusBadge ok={Boolean(data?.facebook.connected)} />
          </div>
          <div className="space-y-3 text-sm">
            {['FACEBOOK_PAGE_ID', 'FACEBOOK_PAGE_ACCESS_TOKEN'].map((key) => (
              <div key={key} className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
                <span className="text-muted-foreground">{key}</span>
                <span className={cn("font-bold", data?.env[key] ? "text-emerald-400" : "text-red-400")}>
                  {data?.env[key] ? "Đã cấu hình" : "Thiếu"}
                </span>
              </div>
            ))}
            <p className="rounded-2xl bg-white/5 p-4 text-xs text-white/60">
              {data?.facebook.message || "Đang kiểm tra..."}
            </p>
            {data?.facebook.page && (
              <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
                <p className="font-bold">{data.facebook.page.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {data.facebook.page.followers.toLocaleString()} followers · {data.facebook.page.fans.toLocaleString()} fans
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="glass rounded-[2rem] border border-white/5 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <KeyRound size={20} className="text-primary" />
          <h2 className="text-xl font-black">Biến môi trường bảo mật</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {data && Object.entries(data.env).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
              <span className="text-muted-foreground">{key}</span>
              <span className={cn("font-bold", value ? "text-emerald-400" : "text-amber-400")}>
                {value ? "SET" : "NOT SET"}
              </span>
            </div>
          ))}
        </div>
        {data?.checkedAt && (
          <p className="mt-5 text-xs text-muted-foreground">
            Lần kiểm tra gần nhất: {new Date(data.checkedAt).toLocaleString('vi-VN')}
          </p>
        )}
      </section>
    </div>
  );
}
