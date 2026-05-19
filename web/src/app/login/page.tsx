"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole, Loader2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Không thể đăng nhập');
      }
      router.replace('/');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center">
      <div className="w-full max-w-md glass rounded-[2.5rem] border border-white/10 p-8 md:p-10 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-6">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Đăng nhập nội bộ</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Nhập PIN để truy cập NH Marketing AI. PIN được cấu hình bằng biến môi trường `APP_LOGIN_PIN`.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">PIN truy cập</span>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4">
              <LockKeyhole size={18} className="text-primary" />
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                type="password"
                inputMode="numeric"
                autoFocus
                placeholder="Nhập PIN"
                className="w-full bg-transparent py-4 text-lg font-bold outline-none placeholder:text-white/20"
              />
            </div>
          </label>

          {error && (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm font-bold text-red-400">
              {error}
            </p>
          )}

          <button
            disabled={loading || pin.length === 0}
            className="w-full rounded-2xl bg-primary px-6 py-4 font-black text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? <Loader2 className="mx-auto animate-spin" size={20} /> : 'Vào hệ thống'}
          </button>
        </form>
      </div>
    </div>
  );
}
