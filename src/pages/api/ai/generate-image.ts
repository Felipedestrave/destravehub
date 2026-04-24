import type { APIRoute } from 'astro';
import { GoogleGenAI } from "@google/genai";

const geminiKey = import.meta.env.GEMINI_API_KEY || '';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { text } = await request.json();

        if (!text) {
            return new Response(JSON.stringify({ error: 'Texto não fornecido' }), { status: 400 });
        }

        const ai = new GoogleGenAI({ apiKey: geminiKey });
        
        // Usando o modelo gemini-2.0-flash para gerar um prompt visual detalhado
        // e simulando a resposta de imagem (ou usando Imagen se disponível no SDK)
        // Nota: Atualmente a geração de imagem via Gemini SDK direto pode variar por região/tier.
        // Se o modelo Imagen não estiver disponível, geramos um prompt rico.
        
        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: { parts: [{ text: `Crie um prompt detalhado para um gerador de imagem (como DALL-E ou Midjourney) baseado na seguinte frase em japonês/português: "${text}".
            O estilo DEVE ser "Funny 3D Animation" (estilo Pixar/Disney moderno), com cores vibrantes, personagens expressivos e iluminação cinematográfica.
            Retorne APENAS o prompt em inglês.` }] }
        });

        const generatedPrompt = result.text;

        // Para este ambiente, como estamos usando o "Antigravity Kit", 
        // vamos simular o retorno de uma URL de imagem gerada ou usar um serviço integrado se existir.
        // Se houver uma ferramenta de geração de imagem disponível no sistema, poderíamos usá-la.
        // Por enquanto, vamos retornar o prompt e uma URL placeholder que simula a geração premium.
        
        // Nota: Em uma implementação real com Google Cloud, usaríamos o endpoint do Imagen 3.
        // Aqui, para manter o fluxo do usuário "WOW", vamos simular a integração.
        
        const promptForUrl = generatedPrompt || "funny 3d animation characters";
        const mockImageUrl = `https://pollinations.ai/p/${encodeURIComponent(promptForUrl)}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000)}&nologo=true`;

        return new Response(JSON.stringify({ 
            imageUrl: mockImageUrl,
            prompt: generatedPrompt 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Erro na geração de imagem IA:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
