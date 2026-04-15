import { GoogleGenAI, Modality } from '@google/genai';

const geminiKey = "AIzaSyBfZOsc5MIfxo2Trc3YOKELWPM3eA_0gic";
const POST = async ({ request }) => {
  try {
    const { text } = await request.json();
    if (!text) {
      return new Response(JSON.stringify({ error: "Texto não fornecido" }), { status: 400 });
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
              voiceName: "Kore"
            }
          }
        }
      }
    });
    const base64Audio = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return new Response(JSON.stringify({ audio: base64Audio }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Erro no TTS Gemini:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
