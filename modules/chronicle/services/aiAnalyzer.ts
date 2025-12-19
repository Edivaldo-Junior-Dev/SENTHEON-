
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis, ChronicleEvent, ImpactLevel } from "../../../types";
import { formatDiffForAI, calculateDiff } from "./diffEngine";

const CHRONICLE_ANALYSIS_PROMPT = `
FUNÇÃO: Analista de Auditoria de Sistema (Chronicle AI).
OBJETIVO: Analisar um diff de JSON e explicar o impacto da mudança em linguagem humana.

TAREFA:
1. Determine o NÍVEL DE IMPACTO (low, medium, high, critical).
   - Low: Pequenas correções, typos.
   - Medium: Mudança de status, progresso.
   - High: Criação de projetos, mudança de missão, troca de tech stack.
   - Critical: Deleção, mudança de chaves de API, mudança estrutural massiva.

2. Crie um RESUMO DE 1 LINHA.
   - Ex: "Mudou o status do projeto X de 'Ativo' para 'Arquivado'."

3. Dê uma SUGESTÃO TÁTICA.
   - Ex: "Verifique se há backups antes de arquivar."

FORMATO JSON OBRIGATÓRIO.
`;

export const analyzeEvent = async (event: ChronicleEvent): Promise<AIAnalysis> => {
  // Using process.env.API_KEY exclusively as per guidelines
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return {
      summary: "Análise IA indisponível (Chave ausente)",
      impact: 'low',
      suggestions: ["Configure a API Key no ambiente"],
      analyzedAt: new Date().toISOString()
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  const diff = calculateDiff(event.snapshot.before, event.snapshot.after);
  const diffString = formatDiffForAI(diff);

  const prompt = `
    ${CHRONICLE_ANALYSIS_PROMPT}

    CONTEXTO:
    Módulo: ${event.module}
    Tipo: ${event.type}
    Entidade: ${event.entityName || event.entityId}

    DADOS DO DIFF:
    ${diffString}
  `;

  try {
    const response = await ai.models.generateContent({
      // Using gemini-3-flash-preview for basic text tasks
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        temperature: 0.2,
        responseMimeType: "application/json",
        // Using responseSchema for reliable JSON parsing
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            impact: { type: Type.STRING, description: "One of: low, medium, high, critical" },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["summary", "impact", "suggestions"]
        }
      }
    });

    // Directly access .text property
    const result = JSON.parse(response.text || "{}");

    return {
      summary: result.summary || "Sem resumo disponível",
      impact: (result.impact as ImpactLevel) || 'low',
      suggestions: result.suggestions || [],
      analyzedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      summary: "Falha na análise automática",
      impact: 'low',
      suggestions: [],
      analyzedAt: new Date().toISOString()
    };
  }
};
