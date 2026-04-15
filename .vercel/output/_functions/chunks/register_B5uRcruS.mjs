import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { $ as $$Layout } from './Layout_c2qLXd47.mjs';
import { A as AuthForm } from './AuthForm_DzWd03BJ.mjs';

const $$Register = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Criar Conta — Destrave Hub", "description": "Comece a usar o Destrave Hub para automatizar a criação de exercícios para seus alunos de idiomas." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-[80vh] flex items-center justify-center px-6 py-20 bg-[var(--color-ice)]"> <div class="w-full"> <div class="text-center mb-10"> <a href="/" class="inline-flex items-center gap-3 mb-6"> <div class="w-10 h-10 bg-[var(--color-brand)] rounded-xl flex items-center justify-center shadow-lg -rotate-6"> <span class="text-white font-outfit font-bold text-xl leading-none">D</span> </div> <span class="font-outfit font-bold text-2xl tracking-tight text-[var(--color-brand)]">DestraveHub</span> </a> </div> ${renderComponent($$result2, "AuthForm", AuthForm, { "client:load": true, "mode": "register", "client:component-hydration": "load", "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/auth/AuthForm", "client:component-export": "default" })} </div> </main> ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/auth/register.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/auth/register.astro";
const $$url = "/auth/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Register,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
