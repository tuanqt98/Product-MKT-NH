import fs from 'fs';
import path from 'path';

export const maxDuration = 60;

export async function POST(req: Request) {
  console.log(">>> AI CHAT REQUEST RECEIVED <<<");
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
---
YÊU CẦU:
1. Luôn sử dụng ngôn ngữ chuyên nghiệp, tận tâm theo Brand Voice của Nhật Hàn.
2. Nếu thông tin người dùng cung cấp thiếu, hãy yêu cầu bổ sung.
3. Định dạng kết quả bằng Markdown đẹp mắt.`;

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key chưa được cấu hình trong Environment Variables của Vercel." }), { status: 500 });
    }

    // Comprehensive list of models to try as fallbacks
    const modelsToTry = [
      'gemini-1.5-flash-latest', 
      'gemini-1.5-flash', 
      'gemini-1.5-flash-8b', 
      'gemini-2.0-flash-exp', 
      'gemini-2.0-flash-lite-preview-02-05',
      'gemini-2.0-flash',
      'gemini-pro',
      'gemini-1.5-pro'
    ];
    
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    let detailedErrors: string[] = [];

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
            generationConfig: { temperature: 0.8, maxOutputTokens: 4096 }
          })
        });

        if (!googleRes.ok) {
          const errorText = await googleRes.text();
          let errorMsg = `Model ${modelName}: ${googleRes.status}`;
          try {
            const errorJson = JSON.parse(errorText);
            errorMsg += ` - ${errorJson.error?.message || errorJson.error?.status || 'Unknown error'}`;
          } catch {
            errorMsg += ` - ${errorText.substring(0, 100)}`;
          }
          console.error(errorMsg);
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

      } catch (fetchError: any) {
        detailedErrors.push(`Fetch error for ${modelName}: ${fetchError.message}`);
        continue;
      }
    }

    // All models failed
    return new Response(
      JSON.stringify({ 
        error: "Toàn bộ hệ thống AI đang tạm thời hết hạn mức (Quota Exceeded) cho gói miễn phí. \n\nVui lòng thử lại sau vài phút hoặc kiểm tra thông báo chi tiết bên dưới:",
        details: detailedErrors.join('\n')
      }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
