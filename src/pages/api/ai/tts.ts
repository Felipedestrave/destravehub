import type { APIRoute } from 'astro';
import { GoogleGenAI, Modality } from "@google/genai";

const geminiKey = import.meta.env.GEMINI_API_KEY || '';

/**
 * Cria um cabeçalho WAV de 44 bytes para áudio PCM L16 (16-bit, Mono, 24kHz)
 */
function createWavHeader(dataLength: number): Buffer {
    const sampleRate = 24000;
    const header = Buffer.alloc(44);
    
    header.write('RIFF', 0);
    header.writeUInt32LE(dataLength + 36, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16); 
    header.writeUInt16LE(1, 20);  
    header.writeUInt16LE(1, 22);  
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * 2, 28); 
    header.writeUInt16LE(2, 32);  
    header.writeUInt16LE(16, 34); 
    header.write('data', 36);
    header.writeUInt32LE(dataLength, 40);
    
    return header;
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const { text } = await request.json();

        if (!text) {
            return new Response(JSON.stringify({ error: 'Texto não fornecido' }), { status: 400 });
        }

        const ai = new GoogleGenAI({ apiKey: geminiKey });

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: `Diga pausadamente com pronúncia perfeita em japonês: ${text}`,
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: 'Kore'
                        }
                    }
                },
            }
        });

        const base64Audio = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        
        if (!base64Audio) {
            throw new Error('Nenhum áudio gerado pela IA.');
        }

        // Converter para buffer e injetar cabeçalho WAV
        const audioBuffer = Buffer.from(base64Audio, 'base64');
        const header = createWavHeader(audioBuffer.length);
        const finalAudio = Buffer.concat([header, audioBuffer]);

        return new Response(JSON.stringify({ audio: finalAudio.toString('base64') }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Erro no TTS Gemini:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
