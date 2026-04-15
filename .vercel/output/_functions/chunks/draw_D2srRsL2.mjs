import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate } from './entrypoint_6sju6Ftj.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_B_DQSMrb.mjs';

const $$Draw = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Destrave Draw — Quadro Branco Inteligente", "activeNav": "draw", "data-astro-cid-4yl55rih": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DrawApp", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-4yl55rih": true, "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/draw/DrawApp.tsx", "client:component-export": "default" })} ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/draw.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/draw.astro";
const $$url = "/draw";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Draw,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
