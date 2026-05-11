import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, skillId } = await req.json();

    // 1. Resolve context and skill paths
    const contextPath = fs.existsSync(path.join(process.cwd(), '.agents/product-marketing-context.md'))
      ? path.join(process.cwd(), '.agents/product-marketing-context.md')
      : path.join(process.cwd(), '../.agents/product-marketing-context.md');
    let productContext = fs.existsSync(contextPath) ? fs.readFileSync(contextPath, 'utf8') : "";

    const skillPath = fs.existsSync(path.join(process.cwd(), `skills/${skillId}/SKILL.md`))
      ? path.join(process.cwd(), `skills/${skillId}/SKILL.md`)
      : path.join(process.cwd(), `../skills/${skillId}/SKILL.md`);
    let skillContent = fs.existsSync(skillPath) ? fs.readFileSync(skillPath, 'utf8') : "";

    const systemPrompt = `BẠN LÀ MỘT CHUYÊN GIA MARKETING THỰC THI (FULLSTACK MARKETING AGENT).
Sản phẩm phục vụ: Nhật Hàn (Dịch vụ In ấn & Bao bì).
---
CONTEXT: ${productContext}
---
SKILL GUIDE: ${skillContent}
YÊU CẦU: Luôn sử dụng ngôn ngữ chuyên nghiệp, tận tâm. Định dạng kết quả bằng Markdown.`;

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: "API Key chưa cấu hình" }), { status: 500 });

    const genAI = new GoogleGenerativeAI(apiKey);

    // Ultimate fallback list
    const configs = [
      { name: "gemini-1.5-flash", useSystem: true },
      { name: "gemini-1.5-flash", useSystem: false }, // Try without system instruction if 404
      { name: "gemini-pro", useSystem: false },       // Classic model
      { name: "gemini-1.5-pro", useSystem: true }
    ];

    let lastError = "";

    for (const config of configs) {
      try {
        console.log(`Trying ${config.name} (system: ${config.useSystem})...`);
        
        const modelOptions: any = { model: config.name };
        if (config.useSystem) {
          modelOptions.systemInstruction = systemPrompt;
        }

        const model = genAI.getGenerativeModel(modelOptions);

        let chatMessages = messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));

        // If not using systemInstruction field, prepend it to the first message
        if (!config.useSystem) {
          if (chatMessages.length > 0 && chatMessages[0].role === 'user') {
            chatMessages[0].parts[0].text = `[SYSTEM INSTRUCTION]\n${systemPrompt}\n\n[USER REQUEST]\n${chatMessages[0].parts[0].text}`;
          }
        }

        const result = await model.generateContentStream({
          contents: chatMessages,
        });

        const stream = new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();
            try {
              for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                if (chunkText) controller.enqueue(encoder.encode(chunkText));
              }
            } catch (err: any) {
              console.error("Stream error:", err);
            } finally {
              controller.close();
            }
          },
        });

        return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

      } catch (err: any) {
        lastError += `\n- ${config.name} (sys:${config.useSystem}): ${err.message}`;
        continue;
      }
    }

    return new Response(JSON.stringify({ 
      error: "Không thể kết nối với AI. Có thể do API Key của bạn chưa được kích hoạt đầy đủ model này.",
      details: lastError
    }), { status: 429 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
