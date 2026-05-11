import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60;

// TEST ONLY: HARDCODED API KEY TO BYPASS VERCEL ENV ISSUES
const HARDCODED_KEY = "AIzaSyDp_dLf3CR9ySFADw8gd_qfxRnJrqpiAVg";

export async function POST(req: Request) {
  try {
    const { messages, skillId } = await req.json();

    // 1. Resolve paths
    const contextPath = fs.existsSync(path.join(process.cwd(), '.agents/product-marketing-context.md'))
      ? path.join(process.cwd(), '.agents/product-marketing-context.md')
      : path.join(process.cwd(), '../.agents/product-marketing-context.md');
    let productContext = fs.existsSync(contextPath) ? fs.readFileSync(contextPath, 'utf8') : "";

    const skillPath = fs.existsSync(path.join(process.cwd(), `skills/${skillId}/SKILL.md`))
      ? path.join(process.cwd(), `skills/${skillId}/SKILL.md`)
      : path.join(process.cwd(), `../skills/${skillId}/SKILL.md`);
    let skillContent = fs.existsSync(skillPath) ? fs.readFileSync(skillPath, 'utf8') : "";

    const systemPrompt = `BẠN LÀ CHUYÊN GIA MARKETING NHẬT HÀN.\nCONTEXT: ${productContext}\nSKILL: ${skillContent}`;

    // Use Hardcoded Key for this debug build
    const apiKey = HARDCODED_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTry = ["gemini-1.5-flash", "gemini-pro"];
    let lastError = "";

    for (const modelName of modelsToTry) {
      try {
        console.log(`Debug Hardcoded Attempt with ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });

        let chatMessages = messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));

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
      error: "Hardcoded Key cũng thất bại. Vui lòng kiểm tra lại tính hợp lệ của mã API Key tại Google AI Studio.",
      details: lastError
    }), { status: 429 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
