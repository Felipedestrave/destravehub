import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const POST = async ({ request }) => {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Payload inválido." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!token) {
    return new Response(JSON.stringify({ saved: false, reason: "no-auth" }), {
      status: 200,
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
      level: body.config.level,
      mode: body.config.mode,
      quantity: body.config.quantity,
      result: {
        totalScore: body.totalScore,
        percentage: body.percentage,
        rankLabel: body.rankLabel,
        completedAt: (/* @__PURE__ */ new Date()).toISOString(),
        answers: body.answers
      }
    };
    const { error: dbError } = await supabaseAdmin.from("activities").insert({
      teacher_id: user.id,
      type: "mrp",
      title: `MRP — ${body.config.level} (${body.config.mode})`,
      config: configPayload
    });
    if (dbError) {
      console.error("[MRP] Erro ao salvar resultado:", dbError);
      return new Response(JSON.stringify({ saved: false, reason: dbError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ saved: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("[MRP] Erro inesperado no save-result:", err);
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
