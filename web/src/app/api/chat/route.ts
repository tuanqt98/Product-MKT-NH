import fs from 'fs';
import path from 'path';

export const maxDuration = 60;

export async function POST(req: Request) {
  console.log(">>> AI CHAT REQUEST RECEIVED <<<");
  try {
    const { messages, skillId } = await req.json();

    // 1. Read Product Context
    // On Vercel, files are relative to the project root. On local dev, they might be in ../
    const contextPath = fs.existsSync(path.join(process.cwd(), '.agents/product-marketing-context.md'))
      ? path.join(process.cwd(), '.agents/product-marketing-context.md')
      : path.join(process.cwd(), '../.agents/product-marketing-context.md');
      
    let productContext = fs.existsSync(contextPath) ? fs.readFileSync(contextPath, 'utf8') : "";

    // 2. Read Selected Skill
    const skillPath = fs.existsSync(path.join(process.cwd(), `skills/${skillId}/SKILL.md`))
      ? path.join(process.cwd(), `skills/${skillId}/SKILL.md`)
      : path.join(process.cwd(), `../skills/${skillId}/SKILL.md`);
    let skillContent = fs.existsSync(skillPath) ? fs.readFileSync(skillPath, 'utf8') : "";

    const systemPrompt = `BẠN LÀ MỘT CHUYÊN GIA MARKETING THỰC THI (FULLSTACK MARKETING AGENT).
Sản phẩm phục vụ: Nhật Hàn (Dịch vụ In ấn).
---
CONTEXT: ${productContext}
---
SKILL GUIDE: ${skillContent}
---
YÊU CẦU:
1. Luôn sử dụng ngôn ngữ chuyên nghiệp, tận tâm theo Brand Voice của Nhật Hàn.
2. Nếu thông tin người dùng cung cấp thiếu, hãy yêu cầu bổ sung.
3. Định dạng kết quả bằng Markdown đẹp mắt.`;

    // Build request for Google Generative AI API directly
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key chưa được cấu hình" }), { status: 500 });
    }

    // Try models in order of priority (lighter models have higher free quota)
    const modelsToTry = ['gemini-2.5-flash-lite', 'gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-2.5-flash'];
    
    // Convert messages to Google API format
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    let lastError = "";

    for (const modelName of modelsToTry) {
      console.log(`Trying model: ${modelName}...`);
      
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?alt=sse&key=${apiKey}`;

      try {
        const googleRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 8192,
            }
          })
        });

        if (!googleRes.ok) {
          const errorData = await googleRes.text();
          console.error(`Model ${modelName} failed (${googleRes.status}):`, errorData.substring(0, 200));
          lastError = `${modelName}: ${googleRes.status}`;
          continue; // Try next model
        }

        console.log(`✅ Model ${modelName} responded successfully!`);

        // Stream the SSE response back to client as plain text
        const reader = googleRes.body?.getReader();
        const decoder = new TextDecoder();

        const stream = new ReadableStream({
          async start(controller) {
            try {
              while (reader) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const jsonStr = line.substring(6).trim();
                    if (jsonStr === '[DONE]') continue;
                    try {
                      const parsed = JSON.parse(jsonStr);
                      const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                      if (text) {
                        controller.enqueue(new TextEncoder().encode(text));
                      }
                    } catch {
                      // Skip unparseable lines
                    }
                  }
                }
              }
            } catch (e) {
              console.error("Stream error:", e);
            } finally {
              controller.close();
            }
          }
        });

        return new Response(stream, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });

      } catch (fetchError: any) {
        console.error(`Model ${modelName} fetch error:`, fetchError.message);
        lastError = fetchError.message;
        continue;
      }
    }

    // All models failed
    return new Response(
      JSON.stringify({ error: `Tất cả các model AI đều đang quá tải. Vui lòng thử lại sau 1 phút.\nChi tiết: ${lastError}` }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("Critical API Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
