import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const POST = async ({ request }) => {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ saved: false, reason: "no-auth" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Payload inválido." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!body.cards || body.cards.length === 0) {
    return new Response(JSON.stringify({ error: "O deck está vazio." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ saved: false, reason: "invalid-token" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const configPayload = {
      level: body.level,
      cardCount: body.cards.length,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      cards: body.cards
    };
    const { data: activity, error: dbError } = await supabaseAdmin.from("activities").insert({
      teacher_id: user.id,
      type: "flashcards",
      title: body.title,
      config: configPayload
    }).select("id").single();
    if (dbError || !activity) {
      console.error("[Flashcards] Erro ao salvar deck:", dbError);
      return new Response(JSON.stringify({ saved: false, reason: dbError?.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ saved: true, activityId: activity.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("[Flashcards] Erro inesperado no save-deck:", err);
    return new Response(JSON.stringify({ saved: false, reason: "unexpected-error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
