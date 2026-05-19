import { NextResponse } from 'next/server';
import { createId, readDb, updateDb, WeeklyReportRecord } from '@/lib/local-db';
import { generateTextWithGeminiFallback } from '@/lib/gemini-models';

function getWeekRange() {
  const now = new Date();
  const day = now.getDay() || 7;
  const start = new Date(now);
  start.setDate(now.getDate() - day + 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export async function GET() {
  const db = readDb();
  const reports = Object.values(db.weeklyReports)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json({ reports });
}

export async function POST() {
  const db = readDb();
  const { start, end } = getWeekRange();
  const outputs = Object.values(db.savedOutputs).filter((item) => new Date(item.createdAt) >= start && new Date(item.createdAt) <= end);
  const contentItems = Object.values(db.contentItems).filter((item) => new Date(item.createdAt) >= start && new Date(item.createdAt) <= end);
  const conversations = Object.values(db.conversations).filter((item) => new Date(item.updatedAt) >= start && new Date(item.updatedAt) <= end);
  const hotLeads = conversations.filter((conversation) => (conversation.leadScore || 0) >= 70);

  const source = {
    outputs: outputs.length,
    contentItems: contentItems.length,
    conversations: conversations.length,
    hotLeads: hotLeads.length,
    topTags: Array.from(new Set(conversations.flatMap((conversation) => conversation.tags || []))).slice(0, 8),
  };

  const generated = await generateReport(source);
  const report = updateDb((nextDb) => {
    const record: WeeklyReportRecord = {
      id: createId('report'),
      title: `Báo cáo tuần ${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}`,
      weekStart: start.toISOString(),
      weekEnd: end.toISOString(),
      summary: generated.summary,
      highlights: generated.highlights,
      risks: generated.risks,
      actionPlan: generated.actionPlan,
      createdAt: new Date().toISOString(),
    };
    nextDb.weeklyReports[record.id] = record;
    return record;
  });

  return NextResponse.json(report);
}

async function generateReport(source: {
  outputs: number;
  contentItems: number;
  conversations: number;
  hotLeads: number;
  topTags: string[];
}) {
  const fallback = {
    summary: `Tuần này hệ thống ghi nhận ${source.outputs} tài sản AI, ${source.contentItems} nội dung trong lịch, ${source.conversations} hội thoại và ${source.hotLeads} lead nóng.`,
    highlights: [
      `Đã tạo/lưu ${source.outputs} output AI để tái sử dụng.`,
      `Có ${source.contentItems} nội dung được đưa vào lịch.`,
      `Có ${source.hotLeads} hội thoại có điểm lead cao.`,
    ],
    risks: [
      source.conversations === 0 ? 'Chưa có dữ liệu hội thoại mới để phân tích.' : 'Cần theo dõi chất lượng phản hồi inbox và trạng thái lead.',
      'Cần duyệt thủ công các nội dung liên quan giá, cam kết và chính sách.',
    ],
    actionPlan: [
      'Rà soát các lead nóng và phân công người phụ trách.',
      'Chọn output AI tốt nhất để đưa vào Content Calendar tuần tới.',
      'Kiểm tra lại các token tích hợp nếu dashboard không có dữ liệu.',
    ],
  };

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  if (!apiKey) return fallback;

  try {
    const result = await generateTextWithGeminiFallback(apiKey, `
Bạn là Marketing Manager của Nhật Hàn. Tạo báo cáo tuần ngắn gọn bằng JSON hợp lệ, không markdown.
Schema: {"summary":"", "highlights":[""], "risks":[""], "actionPlan":[""]}
Dữ liệu tuần:
${JSON.stringify(source)}
`);
    const raw = result.text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);
    return {
      summary: String(parsed.summary || fallback.summary),
      highlights: Array.isArray(parsed.highlights) ? parsed.highlights.map(String).slice(0, 6) : fallback.highlights,
      risks: Array.isArray(parsed.risks) ? parsed.risks.map(String).slice(0, 6) : fallback.risks,
      actionPlan: Array.isArray(parsed.actionPlan) ? parsed.actionPlan.map(String).slice(0, 8) : fallback.actionPlan,
    };
  } catch {
    return fallback;
  }
}
