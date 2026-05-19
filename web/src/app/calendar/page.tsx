"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Plus, RefreshCw, Trash2 } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  channel: string;
  status: 'draft' | 'review' | 'approved' | 'scheduled' | 'published';
  scheduledAt?: string;
  content: string;
  tags: string[];
  createdAt: string;
}

const statusLabels: Record<ContentItem['status'], string> = {
  draft: 'Nháp',
  review: 'Chờ duyệt',
  approved: 'Đã duyệt',
  scheduled: 'Đã lên lịch',
  published: 'Đã đăng',
};

export default function CalendarPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: '',
    channel: 'facebook',
    status: 'draft' as ContentItem['status'],
    scheduledAt: '',
    content: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetch('/api/content-calendar', { cache: 'no-store' }).then(res => res.json());
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const grouped = useMemo(() => {
    return items.reduce<Record<string, ContentItem[]>>((acc, item) => {
      const key = item.scheduledAt ? new Date(item.scheduledAt).toLocaleDateString('vi-VN') : 'Chưa lên lịch';
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [items]);

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = form.title.trim();
    const content = form.content.trim();

    if (!title || !content) {
      setMessage('Cần nhập tiêu đề và nội dung trước khi lưu vào lịch.');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/content-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          title,
          content,
          scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Không thể lưu nội dung vào lịch.');
      }
      setForm({ title: '', channel: 'facebook', status: 'draft', scheduledAt: '', content: '' });
      setMessage('Đã lưu nội dung vào lịch.');
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể lưu nội dung vào lịch.');
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (item: ContentItem, status: ContentItem['status']) => {
    await fetch('/api/content-calendar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, status }),
    });
    await load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/content-calendar?id=${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-xl text-primary">
              <CalendarDays size={22} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Lịch nội dung</h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Quản lý nội dung từ nháp, chờ duyệt, đã duyệt đến lên lịch và đã đăng.
          </p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black text-white">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Tải lại
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form onSubmit={create} className="lg:col-span-4 glass rounded-[2rem] border border-white/5 p-6 space-y-4">
          <h2 className="flex items-center gap-2 font-black">
            <Plus size={18} className="text-primary" />
            Thêm nội dung
          </h2>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Tiêu đề nội dung"
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm outline-none focus:border-primary/50"
          />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} className="rounded-2xl border border-white/10 bg-background p-3 text-sm outline-none">
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
              <option value="zalo">Zalo</option>
              <option value="linkedin">LinkedIn</option>
              <option value="website">Website</option>
            </select>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ContentItem['status'] })} className="rounded-2xl border border-white/10 bg-background p-3 text-sm outline-none">
              {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <input
            type="datetime-local"
            value={form.scheduledAt}
            onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm outline-none focus:border-primary/50"
          />
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Nội dung/caption/script..."
            rows={8}
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm outline-none focus:border-primary/50"
          />
          {message && (
            <p className="rounded-2xl bg-primary/5 px-4 py-3 text-xs font-bold text-primary">
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-black text-white transition hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? 'Đang lưu...' : 'Lưu vào lịch'}
          </button>
        </form>

        <main className="lg:col-span-8 space-y-5">
          {Object.keys(grouped).length === 0 ? (
            <div className="glass rounded-[2rem] border border-dashed border-white/10 p-12 text-center text-muted-foreground">
              Chưa có nội dung nào trong lịch.
            </div>
          ) : Object.entries(grouped).map(([date, dateItems]) => (
            <section key={date} className="glass rounded-[2rem] border border-white/5 p-5">
              <h2 className="mb-4 text-lg font-black">{date}</h2>
              <div className="space-y-3">
                {dateItems.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold">{item.title}</h3>
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-[9px] font-black uppercase text-primary">{item.channel}</span>
                          <span className="rounded-full bg-white/5 px-2 py-1 text-[9px] font-bold text-white/50">{statusLabels[item.status]}</span>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground line-clamp-4">{item.content}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={item.status}
                          onChange={(e) => updateStatus(item, e.target.value as ContentItem['status'])}
                          className="rounded-xl border border-white/10 bg-background p-2 text-xs outline-none"
                        >
                          {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                        <button onClick={() => remove(item.id)} className="rounded-xl bg-red-500/10 p-2 text-red-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
