import fs from 'fs';
import path from 'path';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, skillId } = await req.json();

    const contextPath = fs.existsSync(path.join(process.cwd(), '.agents/product-marketing-context.md'))
      ? path.join(process.cwd(), '.agents/product-marketing-context.md')
      : path.join(process.cwd(), '../.agents/product-marketing-context.md');
    let productContext = fs.existsSync(contextPath) ? fs.readFileSync(contextPath, 'utf8') : "";

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
YÊU CẦU: Luôn sử dụng ngôn ngữ chuyên nghiệp, tận tâm. Định dạng kết quả bằng Markdown.`;

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: "API Key chưa cấu hình" }), { status: 500 });

    // Refined model list with correct API versions
    const configs = [
      { model: 'gemini-1.5-flash', version: 'v1' }, // High quota, stable
      { model: 'gemini-1.5-flash-8b', version: 'v1' }, // Highest quota
      { model: 'gemini-pro', version: 'v1' }, // Stable legacy
      { model: 'gemini-1.5-pro', version: 'v1' },
      { model: 'gemini-2.0-flash-lite-preview-02-05', version: 'v1beta' },
      { model: 'gemini-2.0-flash', version: 'v1beta' }
    ];
    
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    let detailedErrors: string[] = [];

    for (const config of configs) {
      const url = `https://generativelanguage.googleapis.com/${config.version}/models/${config.model}:streamGenerateContent?alt=sse&key=${apiKey}`;

      try {
        const googleRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { temperature: 0.8, maxOutputTokens: 4096 }
          })
        });

        if (!googleRes.ok) {
          const errorText = await googleRes.text();
          let errorMsg = `${config.model}: `;
          try {
            const errorJson = JSON.parse(errorText);
            errorMsg += errorJson.error?.message || errorJson.error?.status || errorText;
          } catch { errorMsg += errorText.substring(0, 100); }
          detailedErrors.push(errorMsg);
          continue; 
        }

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
                    try {
                      const jsonStr = line.substring(6).trim();
                      if (jsonStr === '[DONE]') continue;
                      const parsed = JSON.parse(jsonStr);
                      const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                      if (text) controller.enqueue(new TextEncoder().encode(text));
                    } catch {}
                  }
                }
              }
            } finally { controller.close(); }
          }
        });

        return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

      } catch (e: any) {
        detailedErrors.push(`Error ${config.model}: ${e.message}`);
      }
    }

    return new Response(JSON.stringify({ 
      error: "Tất cả các dòng AI hiện tại đều báo hết hạn mức (Quota Exceeded) hoặc chưa được kích hoạt cho Key của bạn.",
      details: detailedErrors.join('\n')
    }), { status: 429 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
