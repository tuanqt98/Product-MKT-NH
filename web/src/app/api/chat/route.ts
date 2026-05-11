import fs from 'fs';
import path from 'path';

export const maxDuration = 60;

const HARDCODED_KEY = "AIzaSyDp_dLf3CR9ySFADw8gd_qfxRnJrqpiAVg";

export async function POST(req: Request) {
  try {
    // ULTIMATE DEBUG: LIST ALL MODELS AVAILABLE FOR THIS KEY
    console.log("Checking available models for the key...");
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${HARDCODED_KEY}`;
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();

    if (!listRes.ok) {
      return new Response(JSON.stringify({ 
        error: "Google từ chối Key này ngay cả khi chỉ liệt kê danh sách model.",
        details: JSON.stringify(listData)
      }), { status: 403 });
    }

    const availableModels = listData.models?.map((m: any) => m.name.replace('models/', '')) || [];
    
    return new Response(JSON.stringify({ 
      error: `Key của bạn hiện CHỈ nhìn thấy các model sau: ${availableModels.join(', ') || 'KHÔNG CÓ MODEL NÀO'}.`,
      details: "Vui lòng tạo một API Key mới tại một Google Cloud Project khác hoặc kiểm tra lại quyền hạn của Key này."
    }), { status: 404 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
