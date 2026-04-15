import { GoogleGenAI, Modality } from '@google/genai';
import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const getVoiceForContext = (context) => {
  const ctx = (context || "").toLowerCase();
  if (ctx.includes("hospital") || ctx.includes("trabalho") || ctx.includes("escritório")) return "Zephyr";
  if (ctx.includes("escola") || ctx.includes("amigo") || ctx.includes("casa") || ctx.includes("festa")) return "Puck";
  if (ctx.includes("loja") || ctx.includes("restaurante") || ctx.includes("aeroporto")) return "Kore";
  if (ctx.includes("avô") || ctx.includes("avó") || ctx.includes("história") || ctx.includes("sério")) return "Charon";
  if (ctx.includes("esporte") || ctx.includes("emergência")) return "Fenrir";
  return "Kore";
};
const withRetry = async (fn, retries = 3, delay = 2e3) => {
  try {
    return await fn();
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    const isRateLimit = msg.includes("429");
    if (retries > 0 && isRateLimit) {
      await new Promise((r) => setTimeout(r, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};
const POST = async ({ request }) => {
  try {
    const apiKey = "AIzaSyBfZOsc5MIfxo2Trc3YOKELWPM3eA_0gic";
    if (!apiKey) ;
    const body = await request.json();
    const { text, contextName, difficulty, activityId } = body;
    if (!text) return new Response(JSON.stringify({ error: "text é obrigatório." }), { status: 400 });
    if (activityId) {
      const { data: activity } = await supabaseAdmin.from("activities").select("config").eq("id", activityId).single();
      if (activity && activity.config) {
        const config = activity.config;
        const cache = config.cached_audios || {};
        const cacheKey = `${text}_${getVoiceForContext(contextName)}`;
        if (cache[cacheKey]) {
          console.log("[Audio Cache] HIT for:", text);
          return new Response(JSON.stringify({ audioBase64: cache[cacheKey], cached: true }), { status: 200 });
        }
      }
    }
    console.log("[Audio Cache] MISS for:", text, "- Generating with Gemini...");
    const ai = new GoogleGenAI({ apiKey });
    const voiceName = getVoiceForContext(contextName);
    const actingPrompt = `
      Atue como um falante nativo de japonês.
      Cenário: ${contextName || "Geral"}.
      Nível: ${difficulty || "N5"}.
      Instrução: Fale de forma extremamente natural para este cenário, respeitando pausas (ma) e entonação emocional adequada.
      Frase: ${text}
    `;
    const response = await withRetry(
      () => ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: { parts: [{ text: actingPrompt }] },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName }
            }
          }
        }
      })
    );
    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) throw new Error("Falha ao gerar áudio.");
    if (activityId) {
      try {
        const { data: activity } = await supabaseAdmin.from("activities").select("config").eq("id", activityId).single();
        if (activity) {
          const config = activity.config || {};
          const cache = config.cached_audios || {};
          const cacheKey = `${text}_${voiceName}`;
          cache[cacheKey] = audioData;
          await supabaseAdmin.from("activities").update({
            config: { ...config, cached_audios: cache }
          }).eq("id", activityId);
          console.log("[Audio Cache] SAVED for:", text);
        }
      } catch (cacheErr) {
        console.error("[Audio Cache] Failed to save cache:", cacheErr);
      }
    }
    return new Response(JSON.stringify({ audioBase64: audioData, cached: false }), { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    const apiKey = "AIzaSyBfZOsc5MIfxo2Trc3YOKELWPM3eA_0gic";
    console.error("[generate-audio] ERRO COMPLETO:", err);
    console.error("[generate-audio] Chave em uso (8 chars):", apiKey.substring(0, 8) + "..." );
    console.error("[generate-audio] Mensagem do erro:", message);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
