import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const GET = async ({ request }) => {
  const url = new URL(request.url);
  const teacherId = url.searchParams.get("teacherId");
  const text = url.searchParams.get("text") || "Olá Sensei!";
  if (!teacherId) {
    return new Response("Teacher ID missing", { status: 400 });
  }
  try {
    const { data: profile, error } = await supabaseAdmin.from("profiles").select("whatsapp").eq("id", teacherId).single();
    if (error || !profile || !profile.whatsapp) {
      return new Response(`Erro: O professor (ID: ${teacherId}) ainda não configurou o WhatsApp no sistema. (Status: ${error ? "DB Error: " + error.message : "No WhatsApp data"})`, { status: 404 });
    }
    const cleanNumber = profile.whatsapp.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    return Response.redirect(whatsappUrl, 302);
  } catch (err) {
    return new Response("Erro no servidor", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
