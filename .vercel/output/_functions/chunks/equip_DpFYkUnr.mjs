import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const POST = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Sessão inválida" }), { status: 401 });
    }
    const { equipped } = await request.json();
    const { error: updateError } = await supabaseAdmin.from("profiles").update({ equipped }).eq("id", user.id);
    if (updateError) {
      throw updateError;
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("[Store Equip Error]", err);
    return new Response(JSON.stringify({ error: "Erro ao equipar item" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
