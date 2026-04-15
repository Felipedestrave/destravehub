import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const GET = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Autorização necessária." }), { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Sessão inválida." }), { status: 401 });
    }
    const { data: rawActivities, error: dbError } = await supabaseAdmin.from("assignments").select(`
                id,
                completed_at,
                result_data,
                status,
                activities!inner (
                    title,
                    type
                ),
                students!inner (
                    name,
                    teacher_id
                )
            `).eq("status", "completed").eq("students.teacher_id", user.id).order("completed_at", { ascending: false }).limit(10);
    if (dbError) {
      return new Response(JSON.stringify({ error: `DB Fetch Error: ${dbError.message}` }), { status: 500 });
    }
    return new Response(JSON.stringify({ activities: rawActivities || [] }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
