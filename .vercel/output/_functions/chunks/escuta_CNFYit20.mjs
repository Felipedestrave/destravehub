import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_B_DQSMrb.mjs';
import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const $$Escuta = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Escuta;
  const assignmentId = Astro2.url.searchParams.get("assignment");
  const editingId = Astro2.url.searchParams.get("edit");
  let initialData = void 0;
  let initialQuestions = void 0;
  let initialConfig = void 0;
  let initialTitle = void 0;
  let activityId = void 0;
  if (assignmentId) {
    const { data: assignment } = await supabaseAdmin.from("assignments").select("*, activities(*)").eq("id", assignmentId).single();
    if (assignment && assignment.activities) {
      activityId = assignment.activities.id;
      const rawConfig = assignment.activities.config;
      initialTitle = assignment.activities.title;
      initialQuestions = Array.isArray(rawConfig) ? rawConfig : rawConfig?.questions || [];
      if (Array.isArray(initialQuestions) && initialQuestions.length > 0) {
        initialConfig = {
          difficulty: rawConfig.difficulty || "Fácil",
          count: initialQuestions.length,
          focus: rawConfig.focus || "Tradução Fiel"
        };
      }
    }
  }
  if (editingId) {
    const { data: activity } = await supabaseAdmin.from("activities").select("*").eq("id", editingId).single();
    if (activity) {
      activityId = activity.id;
      const rawConfig = activity.config;
      initialQuestions = Array.isArray(rawConfig) ? rawConfig : rawConfig?.questions || [];
      initialTitle = activity.title;
      initialConfig = {
        difficulty: rawConfig.difficulty || "Fácil",
        count: initialQuestions.length,
        focus: rawConfig.focus || "Tradução Fiel"
      };
    }
  }
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Destrave a Escuta — Missões", "activeNav": "escuta", "data-astro-cid-6bobixuf": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="page-header" data-astro-cid-6bobixuf> <div class="breadcrumb" data-astro-cid-6bobixuf> <a href="/dashboard" data-astro-cid-6bobixuf>Dashboard</a> <span class="separator" data-astro-cid-6bobixuf>/</span> <span class="current" data-astro-cid-6bobixuf>Destrave a Escuta</span> </div> <div class="title-section" data-astro-cid-6bobixuf> <h1 class="page-title" data-astro-cid-6bobixuf>Destrave a Escuta 🎧</h1> <p class="page-subtitle" data-astro-cid-6bobixuf>Gere exercícios de compreensão auditiva em japonês a partir de qualquer material PDF.</p> </div> </div> ${renderComponent($$result2, "EscutaApp", null, { "client:only": "react", "assignmentId": assignmentId || void 0, "editingId": editingId || void 0, "activityId": activityId || void 0, "initialData": initialData, "initialQuestions": initialQuestions, "initialConfig": initialConfig, "initialTitle": initialTitle || void 0, "client:component-hydration": "only", "data-astro-cid-6bobixuf": true, "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/escuta/EscutaApp.tsx", "client:component-export": "EscutaApp" })} ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/missions/escuta.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/missions/escuta.astro";
const $$url = "/dashboard/missions/escuta";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Escuta,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
