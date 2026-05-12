import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, skillId, image, variation } = await req.json();

    // variation adjustment for A/B testing
    let variationInstruction = "";
    if (variation === 'B') {
      variationInstruction = "\n\nLƯU Ý: Đây là phương án B. Hãy viết theo một phong cách KHÁC BIỆT hoàn toàn so với thông thường (ví dụ: sáng tạo hơn, ngắn gọn hơn, hoặc tập trung vào cảm xúc hơn) để người dùng có sự so sánh rõ rệt.";
    }

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
CONTEXT SẢN PHẨM:
${productContext}
---
SKILL HƯỚNG DẪN:
${skillContent}
---
YÊU CẦU:
1. Luôn sử dụng ngôn ngữ chuyên nghiệp, tận tâm theo Brand Voice của Nhật Hàn.
2. Nếu thông tin người dùng cung cấp thiếu, hãy yêu cầu bổ sung.
3. Định dạng kết quả bằng Markdown đẹp mắt.
4. Nếu người dùng gửi hình ảnh, hãy phân tích chi tiết hình ảnh đó và đưa ra nhận xét/gợi ý marketing phù hợp.${variationInstruction}`;

    // 2. Get API Key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key chưa được cấu hình." }), { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // 3. Models to try
    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
    let lastError = "";

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: systemPrompt
        });

        // Build chat messages with optional image support
        const chatMessages = messages.map((m: any, index: number) => {
          const parts: any[] = [{ text: m.content }];
          
          // If this is the last user message and there's an image, attach it
          if (m.role === 'user' && index === messages.length - 1 && image) {
            // image is { base64: string, mimeType: string }
            parts.push({
              inlineData: {
                data: image.base64,
                mimeType: image.mimeType
              }
            });
          }

          return {
            role: m.role === 'user' ? 'user' : 'model',
            parts
          };
        });

        const result = await model.generateContentStream({ contents: chatMessages });

        const stream = new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();
            try {
              for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                if (chunkText) controller.enqueue(encoder.encode(chunkText));
              }
            } catch (err: any) {
              console.error("Stream error:", err.message);
            } finally {
              controller.close();
            }
          },
        });

        return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

      } catch (err: any) {
        lastError += `\n- ${modelName}: ${err.message}`;
        continue;
      }
    }

    return new Response(JSON.stringify({ 
      error: "Không thể kết nối AI. Vui lòng thử lại sau.",
      details: lastError
    }), { status: 429 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
