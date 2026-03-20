import { GoogleGenAI, Modality } from '@google/genai';

const MODEL = 'gemini-2.5-flash-preview-05-20';

const DECADE_PROMPTS: Record<string, string> = {
  '1950s':
    'Reimagine the person in this photo in the style of the 1950s. This includes clothing, hairstyle, photo quality (slightly grainy black-and-white or early colour), and the overall aesthetic of that decade. The output must be a photorealistic image showing the person clearly.',
  '1960s':
    'Reimagine the person in this photo in the style of the 1960s. This includes mod fashion, bouffant or mop-top hairstyles, bold colours, and the overall aesthetic of that decade. The output must be a photorealistic image showing the person clearly.',
  '1970s':
    'Reimagine the person in this photo in the style of the 1970s. This includes bell-bottoms, disco or hippie fashion, warm film tones, and the overall aesthetic of that decade. The output must be a photorealistic image showing the person clearly.',
  '1980s':
    'Reimagine the person in this photo in the style of the 1980s. This includes big hair, neon colours, shoulder pads, and the overall vivid aesthetic of that decade. The output must be a photorealistic image showing the person clearly.',
  '1990s':
    'Reimagine the person in this photo in the style of the 1990s. This includes grunge or hip-hop fashion, frosted tips or curtain hair, and the overall aesthetic of that decade. The output must be a photorealistic image showing the person clearly.',
  '2000s':
    'Reimagine the person in this photo in the style of the early 2000s. This includes low-rise jeans, velour tracksuits, frosted highlights, and the overall aesthetic of that decade. The output must be a photorealistic image showing the person clearly.',
};

const FALLBACK_PROMPTS: Record<string, string> = {
  '1950s':
    'Transform this portrait into a 1950s style photograph. Show the person with period-appropriate clothing and hairstyle. Photorealistic.',
  '1960s':
    'Transform this portrait into a 1960s style photograph. Show the person with period-appropriate clothing and hairstyle. Photorealistic.',
  '1970s':
    'Transform this portrait into a 1970s style photograph. Show the person with period-appropriate clothing and hairstyle. Photorealistic.',
  '1980s':
    'Transform this portrait into a 1980s style photograph. Show the person with period-appropriate clothing and hairstyle. Photorealistic.',
  '1990s':
    'Transform this portrait into a 1990s style photograph. Show the person with period-appropriate clothing and hairstyle. Photorealistic.',
  '2000s':
    'Transform this portrait into an early 2000s style photograph. Show the person with period-appropriate clothing and hairstyle. Photorealistic.',
};

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGemini(
  ai: GoogleGenAI,
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { mimeType: mimeType as 'image/jpeg', data: imageBase64 } },
          { text: prompt },
        ],
      },
    ],
    config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.mimeType?.startsWith('image/') && part.inlineData.data) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error('No image returned by Gemini');
}

/**
 * Generate a decade-styled image using the Gemini API.
 * Retries up to 3 times with exponential backoff on 500-class errors.
 * Falls back to a simpler prompt on safety-filter blocks.
 */
export async function generateDecadeImage(
  imageDataUrl: string,
  decade: string
): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

  const ai = new GoogleGenAI({ apiKey });

  // Extract base64 and mimeType from data URL
  const [header, base64Data] = imageDataUrl.split(',');
  const mimeType = header.split(':')[1].split(';')[0];

  const primaryPrompt = DECADE_PROMPTS[decade] ?? DECADE_PROMPTS['1950s'];
  const fallbackPrompt = FALLBACK_PROMPTS[decade] ?? FALLBACK_PROMPTS['1950s'];

  const MAX_RETRIES = 3;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await callGemini(ai, base64Data, mimeType, primaryPrompt);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);

      // Safety filter → try fallback prompt once
      if (message.toLowerCase().includes('safety') || message.toLowerCase().includes('block')) {
        try {
          return await callGemini(ai, base64Data, mimeType, fallbackPrompt);
        } catch {
          throw new Error(`Safety filter blocked generation for ${decade}`);
        }
      }

      // 5xx server error → retry with backoff
      const isServerError =
        message.includes('500') ||
        message.includes('503') ||
        message.toLowerCase().includes('internal');

      if (isServerError && attempt < MAX_RETRIES - 1) {
        await sleep(Math.pow(2, attempt + 1) * 1000);
        continue;
      }

      throw err;
    }
  }

  throw new Error(`Failed to generate image for ${decade} after ${MAX_RETRIES} attempts`);
}

/**
 * Run multiple decade generations with a concurrency limit of 2.
 */
export async function generateAllDecades(
  imageDataUrl: string,
  decades: string[],
  onResult: (decade: string, result: { url?: string; error?: string }) => void,
  concurrency = 2
): Promise<void> {
  const queue = [...decades];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length > 0) {
      const decade = queue.shift()!;
      try {
        const url = await generateDecadeImage(imageDataUrl, decade);
        onResult(decade, { url });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        onResult(decade, { error: message });
      }
    }
  });
  await Promise.all(workers);
}
