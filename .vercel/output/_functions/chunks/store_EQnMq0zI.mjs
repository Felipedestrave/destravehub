import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_B_DQSMrb.mjs';

const $$Store = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Mercado Destrave", "activeNav": "store", "data-astro-cid-fvtrm5uh": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="page-header" data-astro-cid-fvtrm5uh> <div class="breadcrumb" data-astro-cid-fvtrm5uh> <a href="/dashboard" data-astro-cid-fvtrm5uh>Dashboard</a> <span class="separator" data-astro-cid-fvtrm5uh>/</span> <span class="current" data-astro-cid-fvtrm5uh>Mercado Destrave</span> </div> <div class="title-section" data-astro-cid-fvtrm5uh> <h1 class="page-title" data-astro-cid-fvtrm5uh>Mercado Destrave 💎</h1> <p class="page-subtitle" data-astro-cid-fvtrm5uh>
Use suas Destrave Coins para desbloquear itens exclusivos e personalizar sua jornada.
</p> </div> </div> ${renderComponent($$result2, "StoreView", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-fvtrm5uh": true, "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/store/StoreView.tsx", "client:component-export": "StoreView" })} ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/store.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/store.astro";
const $$url = "/dashboard/store";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Store,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
