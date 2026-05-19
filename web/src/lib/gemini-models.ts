import { GoogleGenerativeAI } from '@google/generative-ai';

export const GEMINI_MODELS_TO_TRY = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'] as const;

export async function generateTextWithGeminiFallback(apiKey: string, prompt: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const errors: string[] = [];

  for (const modelName of GEMINI_MODELS_TO_TRY) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return {
        modelName,
        text: result.response.text(),
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${modelName}: ${message}`);
    }
  }

  throw new Error(errors.join('\n'));
}
