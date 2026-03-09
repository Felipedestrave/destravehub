import type { APIRoute } from 'astro';
import { GoogleGenAI, Type } from '@google/genai';
import type { MrpConfig } from '../../../types/mrp';

export const POST: APIRoute = async ({ request }) => {
    const geminiKey = import.meta.env.GEMINI_API_KEY;
    if (!geminiKey) {
        return new Response(JSON.stringify({ error: 'Gemini API Key não configurada.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    let config: MrpConfig;
    try {
        config = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Payload inválido.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { context, quantity, level, mode } = config;

    if (!context || context.trim().length < 20) {
        return new Response(JSON.stringify({ error: 'Texto base muito curto.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey });

    const prompt = `
    Aja como um Arquiteto de Software e Especialista em Linguística Japonesa (JLPT).
    Gere ${quantity} questões de japonês baseadas no CONTEXTO abaixo.
    
    REGRAS DE OURO:
    1. INÉDITO: Não copie frases do texto. Use a gramática e vocabulário para criar situações novas.
    2. FORMATO MRP (Mini Role Play):
       - 'scenario': Uma situação social (ex: "No restaurante, você quer pedir a conta").
       - 'task': O que o usuário deve dizer (ex: "Diga 'A conta, por favor' de forma polida").
    3. MÚLTIPLA ESCOLHA: Se o modo for '${mode}', forneça 4 opções no array 'options'. 
       IMPORTANTE: NÃO inclua prefixos como "A)", "B)" nas strings de opção. Apenas o texto em japonês.
       A opção CORRETA deve estar em 'correctAnswer' e ser IDÊNTICA a uma das strings em 'options'.
    
    CONTEXTO BASE:
    ---
    ${context}
    ---
    
    Nível solicitado: ${level}.
    Modo: ${mode}.
    Regras de pontuação: N5=2, N4=4, N3=6.

    Retorne APENAS um JSON seguindo o esquema definido.
  `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro-preview-03-25',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            scenario: { type: Type.STRING },
                            task: { type: Type.STRING },
                            hint: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            correctAnswer: { type: Type.STRING },
                            explanation: { type: Type.STRING },
                            level: { type: Type.STRING },
                            points: { type: Type.NUMBER },
                        },
                        required: ['scenario', 'task', 'hint', 'correctAnswer', 'explanation', 'level', 'points'],
                    },
                },
            },
        });

        const raw = JSON.parse(response.text || '[]');
        const questions = raw.map((q: any, idx: number) => ({ ...q, id: idx + 1 }));

        return new Response(JSON.stringify({ questions }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        console.error('[MRP] Erro ao gerar questões:', err);
        return new Response(JSON.stringify({ error: 'Falha ao gerar questões com a IA.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
