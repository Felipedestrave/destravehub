import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const DELETE = async ({ request }) => {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Não autenticado." }), { status: 401 });
  }
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Token inválido." }), { status: 401 });
  }
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "ID da atividade é obrigatório." }), { status: 400 });
  }
  try {
    const { data: activity, error: getError } = await supabaseAdmin.from("activities").select("teacher_id").eq("id", id).single();
    if (getError || !activity) {
      return new Response(JSON.stringify({ error: "Atividade não encontrada." }), { status: 404 });
    }
    if (activity.teacher_id !== user.id) {
      return new Response(JSON.stringify({ error: "Sem permissão para deletar esta atividade." }), { status: 403 });
    }
    await supabaseAdmin.from("assignments").delete().eq("activity_id", id);
    const { error: deleteError } = await supabaseAdmin.from("activities").delete().eq("id", id);
    if (deleteError) throw deleteError;
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("[API Delete Activity] Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    DELETE
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
