import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_B_DQSMrb.mjs';
import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const $$Mrp = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Mrp;
  const assignmentId = Astro2.url.searchParams.get("assignment");
  const editingId = Astro2.url.searchParams.get("edit");
  let initialQuestions = void 0;
  let initialConfig = void 0;
  let initialTitle = void 0;
  if (assignmentId) {
    console.log("[MRP Mission] Loading assignment:", assignmentId);
    const { data: assignment, error } = await supabaseAdmin.from("assignments").select("*, activities(*)").eq("id", assignmentId).single();
    if (error) {
      console.error("[MRP Mission] DB Fetch Error:", error);
    }
    if (assignment && assignment.activities) {
      console.log("[MRP Mission] Found activity:", assignment.activities.title);
      const rawConfig = assignment.activities.config;
      initialTitle = assignment.activities.title;
      const questions = Array.isArray(rawConfig) ? rawConfig : rawConfig?.questions || [];
      console.log("[MRP Mission] Questions found:", questions.length);
      if (Array.isArray(questions) && questions.length > 0) {
        initialQuestions = questions;
        initialConfig = {
          context: rawConfig.context || (typeof rawConfig.context === "string" ? rawConfig.context : ""),
          quantity: questions.length,
          level: rawConfig.level || "N5",
          mode: rawConfig.mode || "Múltipla Escolha"
        };
      } else {
        console.error("[MRP Mission] CRITICAL: No questions in config!", rawConfig);
      }
    } else {
      console.error("[MRP Mission] Assignment or Activity not found!");
    }
  }
  if (editingId) {
    const { data: activity } = await supabaseAdmin.from("activities").select("*").eq("id", editingId).single();
    if (activity) {
      const rawConfig = activity.config;
      initialTitle = activity.title;
      initialQuestions = Array.isArray(rawConfig) ? rawConfig : rawConfig?.questions || [];
      initialConfig = {
        context: rawConfig.context || "",
        quantity: initialQuestions.length,
        level: rawConfig.level || "N5",
        mode: rawConfig.mode || "Múltipla Escolha"
      };
    }
  }
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Destrave MRP — Mini Role Play", "activeNav": "mrp", "data-astro-cid-kp73ihgd": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="page-header" data-astro-cid-kp73ihgd> <div class="breadcrumb" data-astro-cid-kp73ihgd> <a href="/dashboard" data-astro-cid-kp73ihgd>Dashboard</a> <span class="separator" data-astro-cid-kp73ihgd>/</span> <span class="current" data-astro-cid-kp73ihgd>Destrave MRP</span> </div> <div class="title-section" data-astro-cid-kp73ihgd> <h1 class="page-title" data-astro-cid-kp73ihgd>Destrave MRP 🎭</h1> <p class="page-subtitle" data-astro-cid-kp73ihgd>
Transforme qualquer texto em cenários de Mini Role Play com avaliação de polidez via IA.
</p> </div> </div> ${renderComponent($$result2, "MrpApp", null, { "client:only": "react", "initialConfig": initialConfig, "initialQuestions": initialQuestions, "editingId": editingId || void 0, "assignmentId": assignmentId || void 0, "initialTitle": initialTitle, "client:component-hydration": "only", "data-astro-cid-kp73ihgd": true, "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/mrp/MrpApp.tsx", "client:component-export": "MrpApp" })} ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/missions/mrp.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/missions/mrp.astro";
const $$url = "/dashboard/missions/mrp";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Mrp,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
