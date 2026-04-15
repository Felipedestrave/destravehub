import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const GET = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
    }
    const { data: student, error: sErr } = await supabaseAdmin.from("students").select("id").eq("student_id", user.id).maybeSingle();
    if (sErr || !student) {
      return new Response(JSON.stringify({ error: "Student record not found" }), { status: 404 });
    }
    const { data: missions, error: mErr } = await supabaseAdmin.from("assignments").select(`
                *,
                activities (
                    id,
                    title,
                    type,
                    config
                )
            `).eq("student_id", student.id).order("assigned_at", { ascending: false });
    if (mErr) {
      return new Response(JSON.stringify({ error: "Error fetching missions" }), { status: 500 });
    }
    return new Response(JSON.stringify({ missions }), { status: 200 });
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
