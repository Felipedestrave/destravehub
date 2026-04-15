import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { $ as $$Layout } from './Layout_c2qLXd47.mjs';
import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const $$assignmentId = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$assignmentId;
  const { type, assignmentId } = Astro2.params;
  const isTest = Astro2.url.searchParams.get("test") === "true";
  if (!assignmentId || !type) {
    return Astro2.redirect("/404");
  }
  let assignment = null;
  if (isTest) {
    const { data: activity } = await supabaseAdmin.from("activities").select("*").eq("id", assignmentId).single();
    if (activity) {
      assignment = {
        id: assignmentId,
        // Usamos o ID da atividade como ID da missão no modo de teste
        activities: activity
      };
    }
  } else {
    const { data } = await supabaseAdmin.from("assignments").select("*, activities(*)").eq("id", assignmentId).single();
    if (data) {
      assignment = data;
    }
  }
  if (!assignment) {
    return Astro2.redirect("/404?error=not_found");
  }
  const rawConfig = assignment.activities.config;
  let initialQuestions = [];
  let initialConfig = null;
  let flashcardsCards = [];
  if (type === "escuta" || type === "mrp") {
    initialQuestions = Array.isArray(rawConfig) ? rawConfig : rawConfig?.questions || [];
    initialConfig = {
      difficulty: rawConfig?.difficulty || "Fácil",
      count: initialQuestions.length,
      focus: rawConfig?.focus || "Tradução Fiel",
      mode: rawConfig?.mode || (type === "mrp" ? "Múltipla Escolha" : void 0)
    };
  } else if (type === "flashcards") {
    flashcardsCards = rawConfig?.cards || [];
  }
  const teacherId = assignment.activities.teacher_id;
  const { data: teacherProfile } = await supabaseAdmin.from("profiles").select("display_name, full_name, avatar_url, whatsapp").eq("id", teacherId).single();
  const senseiData = teacherProfile ? {
    name: teacherProfile.display_name || teacherProfile.full_name || "Sensei",
    avatar: teacherProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacherId}`,
    whatsapp: teacherProfile.whatsapp
  } : null;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Missão: ${assignment.activities.title}`, "data-astro-cid-qfnfu5p2": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mission-player-overlay" data-astro-cid-qfnfu5p2> <div class="mission-container" data-astro-cid-qfnfu5p2> ${type === "escuta" && renderTemplate`${renderComponent($$result2, "EscutaApp", null, { "client:only": "react", "assignmentId": isTest ? void 0 : assignment.id, "activityId": assignment.activities.id, "initialQuestions": initialQuestions, "initialConfig": initialConfig, "publicAccess": true, "senseiData": senseiData, "client:component-hydration": "only", "data-astro-cid-qfnfu5p2": true, "client:component-path": "@/components/escuta/EscutaApp.tsx", "client:component-export": "EscutaApp" })}`} ${type === "mrp" && renderTemplate`${renderComponent($$result2, "MrpApp", null, { "client:only": "react", "assignmentId": isTest ? void 0 : assignment.id, "activityId": assignment.activities.id, "initialQuestions": initialQuestions, "initialConfig": initialConfig, "publicAccess": true, "senseiData": senseiData, "client:component-hydration": "only", "data-astro-cid-qfnfu5p2": true, "client:component-path": "@/components/mrp/MrpApp.tsx", "client:component-export": "MrpApp" })}`} ${type === "flashcards" && renderTemplate`<div class="max-w-xl mx-auto py-12" data-astro-cid-qfnfu5p2> ${renderComponent($$result2, "CardViewer", null, { "client:only": "react", "cards": flashcardsCards, "senseiData": senseiData, "activityId": assignment.activities.id, "client:component-hydration": "only", "data-astro-cid-qfnfu5p2": true, "client:component-path": "@/components/flashcards/CardViewer.tsx", "client:component-export": "CardViewer" })} </div>`} </div> </div> ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/play/[type]/[assignmentId].astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/play/[type]/[assignmentId].astro";
const $$url = "/play/[type]/[assignmentId]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$assignmentId,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
