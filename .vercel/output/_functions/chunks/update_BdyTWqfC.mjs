import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const PUT = async ({ request }) => {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Não autenticado." }), { status: 401 });
  }
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Token inválido." }), { status: 401 });
  }
  const { id, title, config } = await request.json();
  if (!id) {
    return new Response(JSON.stringify({ error: "ID da atividade é obrigatório." }), { status: 400 });
  }
  try {
    const { data: original, error: getError } = await supabaseAdmin.from("activities").select("teacher_id").eq("id", id).single();
    if (getError || !original) {
      return new Response(JSON.stringify({ error: "Atividade não encontrada." }), { status: 404 });
    }
    if (original.teacher_id !== user.id) {
      return new Response(JSON.stringify({ error: "Sem permissão para atualizar esta atividade." }), { status: 403 });
    }
    const updates = {};
    if (title !== void 0) updates.title = title;
    if (config !== void 0) updates.config = config;
    const { data, error: updateError } = await supabaseAdmin.from("activities").update(updates).eq("id", id).select().single();
    if (updateError) throw updateError;
    return new Response(JSON.stringify({ success: true, activity: data }), { status: 200 });
  } catch (err) {
    console.error("[API Update Activity] Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
