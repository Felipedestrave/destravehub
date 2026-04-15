import { s as supabase } from './supabase_Cb0dhCq8.mjs';
import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const POST = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Falta cabeçalho de autorização." }), { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: teacher }, error: teacherError } = await supabase.auth.getUser(token);
    if (teacherError || !teacher) {
      console.error("Teacher Auth Error:", teacherError);
      return new Response(JSON.stringify({ error: "Sessão do professor inválida ou expirada. Tente fazer logout e login novamente." }), { status: 401 });
    }
    const body = await request.json();
    const { name, email, password, language, level, metadata } = body;
    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "Nome, e-mail e senha são obrigatórios." }), { status: 400 });
    }
    const { data: { user: studentAuth }, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name, role: "student" }
    });
    if (authError || !studentAuth) {
      return new Response(JSON.stringify({ error: `Erro Auth: ${authError?.message}` }), { status: 500 });
    }
    await supabaseAdmin.from("profiles").upsert({
      id: studentAuth.id,
      full_name: name,
      role: "student"
    });
    const { data: studentRecord, error: studentError } = await supabaseAdmin.from("students").insert({
      teacher_id: teacher.id,
      student_id: studentAuth.id,
      name,
      level: level || "Iniciante",
      language: language || "Japonês",
      metadata: metadata || {}
    }).select().single();
    if (studentError) {
      return new Response(JSON.stringify({ error: `Erro DB: ${studentError.message}` }), { status: 500 });
    }
    return new Response(JSON.stringify({
      success: true,
      student: studentRecord,
      credentials: { email, password }
    }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
