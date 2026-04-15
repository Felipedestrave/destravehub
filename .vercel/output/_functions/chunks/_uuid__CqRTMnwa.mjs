import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import './entrypoint_6sju6Ftj.mjs';
import 'clsx';
import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const $$uuid = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$uuid;
  const { uuid } = Astro2.params;
  if (!uuid) {
    return Astro2.redirect("/404");
  }
  const { data: student, error: studentError } = await supabaseAdmin.from("students").select("id, name").eq("experimental_uuid", uuid).single();
  if (studentError || !student) {
    return Astro2.redirect("/404?error=invalid_link");
  }
  const { data: assignment, error: assignError } = await supabaseAdmin.from("assignments").select("*, activities(type)").eq("student_id", student.id).single();
  if (assignError || !assignment) {
    return Astro2.redirect("/404?error=no_assignment");
  }
  if (assignment.status === "completed") {
    return Astro2.redirect("/share/completed");
  }
  if (assignment.expires_at && new Date(assignment.expires_at) < /* @__PURE__ */ new Date()) {
    return Astro2.redirect("/share/expired");
  }
  const missionType = assignment.activities.type;
  return Astro2.redirect(`/play/${missionType}/${assignment.id}?u=${uuid}`);
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/share/[uuid].astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/share/[uuid].astro";
const $$url = "/share/[uuid]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$uuid,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
