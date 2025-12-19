
import { GoogleGenAI, Type } from "@google/genai";
import { BrandResult, LogoRequest, LogoResult, ConsultantPersona, ChatMessage } from "../types";

const getAiInstance = () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export interface ChatResponse {
  text: string;
  sources: { uri: string; title: string }[];
}

export const streamConsultantChat = async (
  message: string,
  persona: ConsultantPersona,
  history: ChatMessage[],
  onChunk: (response: ChatResponse) => void,
  systemContext?: string
): Promise<string> => {
  const ai = getAiInstance();
  
  const systemInstruction = `
    VOCÊ É SENTHEON v4.0 - HUB DE INTELIGÊNCIA BREEZE & JASPER CONTENT OPS.
    Seu foco é Business Intelligence, Estratégia Digital e Automação de Conteúdo.
    
    DIRETRIZES:
    1. Utilize Google Grounding para validar tendências.
    2. Responda em: ${systemContext || 'Português'}.
  `;

  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    history: history.map(msg => ({ role: msg.role === 'model' ? 'model' : 'user', parts: [{ text: msg.text }] })),
    config: {
      systemInstruction,
      temperature: 0.7,
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 0 }
    },
  });

  const result = await chat.sendMessageStream({ message });
  let fullResponse = "";
  let sources: { uri: string; title: string }[] = [];

  for await (const chunk of result) {
    if (chunk.text) {
      fullResponse += chunk.text;
      
      const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata;
      if (groundingMetadata?.groundingChunks) {
        groundingMetadata.groundingChunks.forEach((c: any) => {
          if (c.web?.uri && !sources.find(s => s.uri === c.web.uri)) {
            sources.push({ uri: c.web.uri, title: c.web.title || 'Referência Web' });
          }
        });
      }

      onChunk({ text: fullResponse, sources });
    }
  }
  return fullResponse;
};

// --- JASPER ENGINE FUNCTION ---
export const generateJasperContent = async (topic: string, format: string, tone: string): Promise<string> => {
    const ai = getAiInstance();
    const prompt = `Aja como o Jasper.ai. Gere um ${format} sobre o tópico: "${topic}". 
    O tom de voz deve ser: ${tone}. Utilize frameworks de marketing como AIDA ou PAS.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { temperature: 0.8 }
    });
    return response.text || "";
};

export const generateBrandNames = async (m: string, s: string, c: number, t?: string): Promise<BrandResult[]> => {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Gere nomes de marca para: ${m}. Estilo: ${s}. ${t ? `Tente incluir ou formar um acrônimo com a palavra: ${t}` : ''}`,
        config: { 
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                tagline: { type: Type.STRING },
                category: { type: Type.STRING },
                reasoning: { type: Type.STRING },
                score: { type: Type.NUMBER },
                domainAvailable: { type: Type.BOOLEAN },
                type: { type: Type.STRING, description: "Indicate if it's 'brand' or 'acronym'" },
                acronymBreakdown: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            letter: { type: Type.STRING },
                            word: { type: Type.STRING }
                        }
                    }
                }
              },
              required: ["name", "tagline", "score"]
            }
          }
        }
    });
    return JSON.parse(response.text || "[]");
};

export const generateLogo = async (req: LogoRequest): Promise<LogoResult> => {
    const ai = getAiInstance();
    const prompt = `Generate a high-quality professional logo for: ${req.brandName}.
    Industry: ${req.industry}. Style: ${req.style}. Colors: ${req.colors}. ${req.removeBackground ? 'Clean background.' : ''}`;

    const parts: any[] = [{ text: prompt }];
    if (req.referenceImage) {
        const base64Data = req.referenceImage.split(',')[1] || req.referenceImage;
        const mimeType = req.referenceImage.split(';')[0].split(':')[1] || 'image/png';
        parts.push({ inlineData: { data: base64Data, mimeType } });
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: { imageConfig: { aspectRatio: "1:1" } }
    });

    let imageUrl = '';
    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                break;
            }
        }
    }

    if (!imageUrl) throw new Error("Neural synthesis failed.");
    return { id: `logo-${Date.now()}`, imageUrl, promptUsed: prompt, timestamp: new Date().toISOString(), params: req };
};
