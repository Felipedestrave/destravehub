import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate } from './entrypoint_6sju6Ftj.mjs';
import { $ as $$Layout } from './Layout_c2qLXd47.mjs';

const $$ThemesTest = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Visualizador de Temas | Mercado Destrave" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ThemesTestComponent", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/store/ThemesTestPage.tsx", "client:component-export": "ThemesTestPage" })} ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/themes-test.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/themes-test.astro";
const $$url = "/dashboard/themes-test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$ThemesTest,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
