"use client";

import React, { useEffect, useState } from 'react';
import { FileBarChart, Plus, RefreshCw } from 'lucide-react';

interface WeeklyReport {
  id: string;
  title: string;
  weekStart: string;
  weekEnd: string;
  summary: string;
  highlights: string[];
  risks: string[];
  actionPlan: string[];
  createdAt: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [selected, setSelected] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetch('/api/reports/weekly', { cache: 'no-store' }).then(res => res.json());
      setReports(data.reports || []);
      setSelected((current) => current || data.reports?.[0] || null);
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

  const generate = async () => {
    setGenerating(true);
    try {
      const report = await fetch('/api/reports/weekly', { method: 'POST' }).then(res => res.json());
      setSelected(report);
      await load();
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-xl text-primary">
              <FileBarChart size={22} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Báo cáo tuần</h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Tự động tổng hợp output AI, lịch nội dung, hội thoại và lead nóng thành báo cáo tuần.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="inline-flex items-center gap-2 rounded-2xl bg-foreground/5 px-5 py-3 text-sm font-black hover:bg-foreground/10">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Tải lại
          </button>
          <button onClick={generate} disabled={generating} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black text-white disabled:opacity-50">
            <Plus size={16} />
            {generating ? 'Đang tạo...' : 'Tạo báo cáo tuần'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4 glass rounded-[2rem] border border-white/5 overflow-hidden">
          {reports.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">Chưa có báo cáo nào.</p>
          ) : reports.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelected(report)}
              className="w-full border-b border-white/5 p-4 text-left hover:bg-white/5"
            >
              <h3 className="font-bold text-sm">{report.title}</h3>
              <p className="mt-1 text-[10px] text-muted-foreground">{new Date(report.createdAt).toLocaleString('vi-VN')}</p>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{report.summary}</p>
            </button>
          ))}
        </aside>

        <main className="lg:col-span-8 glass rounded-[2rem] border border-white/5 p-6 md:p-8">
          {selected ? (
            <article className="space-y-8">
              <div>
                <h2 className="text-2xl font-black">{selected.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.summary}</p>
              </div>

              <section>
                <h3 className="mb-3 text-lg font-black text-emerald-400">Điểm nổi bật</h3>
                <ul className="space-y-2">
                  {selected.highlights.map((item, index) => (
                    <li key={index} className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-3 text-sm leading-relaxed text-foreground/80">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="mb-3 text-lg font-black text-amber-400">Rủi ro/Cần chú ý</h3>
                <ul className="space-y-2">
                  {selected.risks.map((item, index) => (
                    <li key={index} className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-3 text-sm leading-relaxed text-foreground/80">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="mb-3 text-lg font-black text-primary">Action plan tuần tới</h3>
                <ol className="space-y-2">
                  {selected.actionPlan.map((item, index) => (
                    <li key={index} className="rounded-2xl border border-primary/10 bg-primary/5 p-3 text-sm leading-relaxed text-foreground/80">
                      {index + 1}. {item}
                    </li>
                  ))}
                </ol>
              </section>
            </article>
          ) : (
            <div className="flex h-[60vh] items-center justify-center text-center text-muted-foreground">
              Chọn hoặc tạo báo cáo tuần để xem chi tiết.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
