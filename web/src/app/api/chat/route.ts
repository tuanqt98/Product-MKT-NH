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

    const systemPrompt = `BẠN LÀ CHUYÊN GIA MARKETING NHẬT HÀN.\nCONTEXT: ${productContext}\nSKILL: ${skillContent}`;

    // 2. Use Secure Environment Variable from Vercel
    const rawApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const apiKey = rawApiKey?.trim();
    
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: "Hệ thống chưa có API Key. Vui lòng cấu hình GOOGLE_GENERATIVE_AI_API_KEY trong Environment Variables trên Vercel." 
      }), { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // 3. Official models to use
    const modelNames = ["gemini-1.5-flash", "gemini-1.5-pro"];
    let lastError = "";

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        let chatMessages = messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));

        // Inline system instruction for maximum compatibility
        if (chatMessages.length > 0) {
          chatMessages[0].parts[0].text = `[SYSTEM]\n${systemPrompt}\n\n[USER]\n${chatMessages[0].parts[0].text}`;
        }

        const result = await model.generateContentStream({ contents: chatMessages });

        const stream = new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();
            try {
              for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                if (chunkText) controller.enqueue(encoder.encode(chunkText));
              }
            } catch (err: any) { console.error("Stream error:", err); }
            finally { controller.close(); }
          },
        });

        return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

      } catch (err: any) {
        lastError += `\n- ${modelName}: ${err.message}`;
        continue;
      }
    }

    return new Response(JSON.stringify({ 
      error: "Không thể kết nối AI. Vui lòng kiểm tra lại tính hợp lệ của API Key trên Vercel.",
      details: lastError
    }), { status: 429 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
