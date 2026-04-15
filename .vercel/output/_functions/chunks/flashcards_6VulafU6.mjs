import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_B_DQSMrb.mjs';
import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const $$Flashcards = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Flashcards;
  const assignmentId = Astro2.url.searchParams.get("assignment");
  const editingId = Astro2.url.searchParams.get("edit");
  let initialDeck = void 0;
  let initialTitle = "Missão de Flashcards";
  if (assignmentId) {
    const { data: assignment } = await supabaseAdmin.from("assignments").select("*, activities(*)").eq("id", assignmentId).single();
    if (assignment && assignment.activities) {
      initialDeck = assignment.activities.config;
      initialTitle = assignment.activities.title;
    }
  }
  if (editingId) {
    const { data: activity } = await supabaseAdmin.from("activities").select("*").eq("id", editingId).single();
    if (activity) {
      initialDeck = activity.config;
    }
  }
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Destrave Cards", "activeNav": "flashcards", "data-astro-cid-sxtd55a2": true }, { "default": async ($$result2) => renderTemplate`${!assignmentId && renderTemplate`${maybeRenderHead()}<div class="page-header" data-astro-cid-sxtd55a2> <div class="breadcrumb" data-astro-cid-sxtd55a2> <a href="/dashboard" data-astro-cid-sxtd55a2>Dashboard</a> <span class="separator" data-astro-cid-sxtd55a2>/</span> <span class="current" data-astro-cid-sxtd55a2>Destrave Cards</span> </div> <div class="title-section" data-astro-cid-sxtd55a2> <h1 class="page-title" data-astro-cid-sxtd55a2>Destrave Cards 🃏</h1> <p class="page-subtitle" data-astro-cid-sxtd55a2>
Gere decks personalizados com IA e aprove cada card antes de enviar ao seu aluno.
</p> </div> </div>`}${renderComponent($$result2, "FlashcardsApp", null, { "client:only": "react", "assignmentId": assignmentId || void 0, "editingId": editingId || void 0, "initialDeck": initialDeck, "initialTitle": initialTitle, "client:component-hydration": "only", "data-astro-cid-sxtd55a2": true, "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/flashcards/FlashcardsApp.tsx", "client:component-export": "FlashcardsApp" })} ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/missions/flashcards.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/missions/flashcards.astro";
const $$url = "/dashboard/missions/flashcards";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Flashcards,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
