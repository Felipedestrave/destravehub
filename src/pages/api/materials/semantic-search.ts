import type { APIRoute } from 'astro';
import { GoogleGenAI, Type } from "@google/genai";

const geminiKey = import.meta.env.GEMINI_API_KEY || '';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { query, materials } = await request.json();

        if (!query) {
            return new Response(JSON.stringify({ error: 'Termo de busca não fornecido' }), { status: 400 });
        }

        if (!materials || !Array.isArray(materials)) {
            return new Response(JSON.stringify({ error: 'Lista de materiais inválida ou ausente' }), { status: 400 });
        }

        // Se não houver materiais, não há nada a pesquisar semanticamente
        if (materials.length === 0) {
            return new Response(JSON.stringify({ results: [] }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const ai = new GoogleGenAI({ apiKey: geminiKey });

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: {
                parts: [{
                    text: `Você é um motor de busca semântica inteligente para um aplicativo de aprendizado de idiomas (Destrave Hub).
Sua tarefa é analisar o termo de pesquisa do usuário: "${query}" e filtrar/ordenar os materiais de estudo abaixo com base na proximidade conceitual e semântica de seus nomes com a busca (não apenas por correspondência exata de palavras).

Lista de materiais:
${JSON.stringify(materials.map(m => ({ id: m.id, name: m.name, type: m.type })), null, 2)}

Dê uma nota de relevância (score) de 0.0 (totalmente irrelevante) a 1.0 (altamente relevante). Filtre materiais com score maior que 0.15. Ordene a resposta do mais relevante para o menos relevante.`
                }]
            },
            config: {
                systemInstruction: "Você é um assistente de IA focado em ordenação de relevância semântica. Retorne APENAS um objeto JSON com os resultados ordenados de score.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        results: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    score: { type: Type.NUMBER }
                                },
                                required: ["id", "score"]
                            }
                        }
                    },
                    required: ["results"]
                }
            }
        });

        return new Response(result.text, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Erro na busca semântica:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
