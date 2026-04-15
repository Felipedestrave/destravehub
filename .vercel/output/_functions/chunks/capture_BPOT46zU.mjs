import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, whatsapp, activityId } = body;
    if (!name?.trim() || !whatsapp?.trim() || !activityId) {
      return new Response(JSON.stringify({
        error: "Nome, WhatsApp e ID da atividade são obrigatórios."
      }), { status: 400 });
    }
    const { data: activity, error: activityError } = await supabaseAdmin.from("activities").select("id, title, type, teacher_id").eq("id", activityId).single();
    if (activityError || !activity) {
      return new Response(JSON.stringify({
        error: "Atividade não encontrada ou link inválido."
      }), { status: 404 });
    }
    const experimentalUuid = crypto.randomUUID();
    const { data: leadStudent, error: studentError } = await supabaseAdmin.from("students").insert({
      name: name.trim(),
      teacher_id: activity.teacher_id,
      experimental_uuid: experimentalUuid,
      level: "Iniciante",
      language: "Japonês",
      metadata: {
        is_lead: true,
        whatsapp: whatsapp.trim(),
        email: email?.trim() || null
      }
    }).select().single();
    if (studentError || !leadStudent) {
      console.error("Lead creation error:", studentError);
      return new Response(JSON.stringify({
        error: "Erro ao registrar. Tente novamente."
      }), { status: 500 });
    }
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);
    const { data: assignment, error: assignError } = await supabaseAdmin.from("assignments").insert({
      student_id: leadStudent.id,
      activity_id: activityId,
      teacher_id: activity.teacher_id,
      status: "pendente",
      expires_at: expiresAt.toISOString()
    }).select().single();
    if (assignError || !assignment) {
      console.error("Assignment creation error:", assignError);
      await supabaseAdmin.from("students").delete().eq("id", leadStudent.id);
      return new Response(JSON.stringify({
        error: "Erro ao preparar sua missão. Tente novamente."
      }), { status: 500 });
    }
    return new Response(JSON.stringify({
      success: true,
      redirectUrl: `/share/${experimentalUuid}`
    }), { status: 200 });
  } catch (err) {
    console.error("Unexpected error in lead capture:", err);
    return new Response(JSON.stringify({
      error: "Erro inesperado. Tente novamente mais tarde."
    }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
