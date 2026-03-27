import type { APIRoute } from 'astro';
import { GoogleGenAI, Type } from '@google/genai';
import type { MrpConfig } from '../../../types/mrp';

const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> => {
    try {
        return await fn();
    } catch (error: any) {
        if (retries > 0 && error?.message?.includes('429')) {
            await new Promise((r) => setTimeout(r, delay));
            return withRetry(fn, retries - 1, delay * 2);
        }
        throw error;
    }
};

export const POST: APIRoute = async ({ request }) => {
    const geminiKey = import.meta.env.GEMINI_API_KEY;
    if (!geminiKey) {
        return new Response(JSON.stringify({ error: 'Gemini API Key não configurada.' }), { status: 500 });
    }

    let config: MrpConfig;
    try {
        config = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Payload inválido.' }), { status: 400 });
    }

    const { context, quantity, level, mode, pdfBase64 } = config;

    if (!pdfBase64 && (!context || context.trim().length < 20)) {
        return new Response(JSON.stringify({ error: 'Forneça um PDF ou um texto base de pelo menos 20 caracteres.' }), { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey });

    const prompt = `
    Aja como um Professor de Japonês (Sensei) e Especialista em JLPT (N5-N3).
    Sua missão é criar ${quantity} exercícios de Mini Role Play (MRP) baseados no material fornecido.
    
    FONTES DE CONTEÚDO:
    1. Se houver um PDF, use-o como fonte primária de vocabulário e gramática.
    2. Se houver texto manual ("${context}"), integre-o ao planejamento.
    
    REGRAS DO SENSEI:
    1. CONTEXTO REALISTA: Crie situações do cotidiano no Japão (restaurante, konbini, pedir direções, escola).
    2. FORMATO MRP:
       - 'scenario': Descreva a situação social em português.
       - 'task': O que o aluno deve dizer (ex: "Diga que você quer este café, por favor").
       - 'hint': Uma dica gramática ou de vocabulário em português.
    3. OPÇÕES: Forneça exatamente 4 opções de resposta em japonês. NUNCA use prefixos como "A)", "1)".
    4. NÍVEL ${level}: Respeite rigorosamente a gramática deste nível JLPT.
    5. EXPLICAÇÃO: Explique brevemente por que a resposta correta é a mais adequada socialmente na cultura japonesa.
    
    Retorne um JSON contendo EXATAMENTE ${quantity} objetos no array principal.
    `;

    try {
        const parts: any[] = [{ text: prompt }];
        if (pdfBase64) {
            parts.push({ inlineData: { mimeType: 'application/pdf', data: pdfBase64 } });
        }

        const result = await withRetry(() => 
            ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ role: 'user', parts }],
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
                                options: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 4, maxItems: 4 },
                                correctAnswer: { type: Type.STRING },
                                explanation: { type: Type.STRING },
                                level: { type: Type.STRING },
                                points: { type: Type.NUMBER },
                            },
                            required: ['scenario', 'task', 'hint', 'options', 'correctAnswer', 'explanation', 'level', 'points'],
                        },
                    },
                },
            })
        );

        const text = result.text;
        if (!text) throw new Error('IA retornou resposta vazia.');

        const raw = JSON.parse(text);
        const questions = raw.map((q: any, idx: number) => ({ ...q, id: idx + 1 }));

        return new Response(JSON.stringify({ questions }), { status: 200 });
    } catch (err: any) {
        console.error('[MRP Generation Error]:', err);
        return new Response(JSON.stringify({ error: 'Erro ao gerar treinamento: ' + err.message }), { status: 500 });
    }
};
