import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const GET = async ({ request }) => {
  const url = new URL(request.url);
  const checkId = url.searchParams.get("id") || "76d21cfc-3e08-4111-805b-beb7233aa6d6";
  const { data: profile, error } = await supabaseAdmin.from("profiles").select("*").eq("id", checkId).single();
  return new Response(JSON.stringify({
    id: checkId,
    profile,
    error: error ? error.message : null
  }, null, 2), {
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
