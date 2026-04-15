import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { $ as $$Layout } from './Layout_c2qLXd47.mjs';

const $$Completed = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Link Expirado" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex min-h-screen items-center justify-center p-4 bg-slate-50"> <div class="bg-white rounded-3xl border-2 border-slate-border p-12 max-w-md w-full text-center shadow-xl"> <div class="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6"> <span class="text-4xl">🔒</span> </div> <h1 class="font-outfit text-3xl font-extrabold text-slate-dark mb-4">Link Expirado</h1> <p class="text-slate-mid mb-8 leading-relaxed">
Este link para aluno experimental já foi utilizado e a missão foi concluída. 
                Os links experimentais são de <strong>uso único</strong>.
</p> <a href="/" class="inline-block px-8 py-4 bg-brand text-white rounded-2xl font-outfit font-bold hover:scale-105 transition-transform">
Voltar ao Início
</a> </div> </div> ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/share/completed.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/share/completed.astro";
const $$url = "/share/completed";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Completed,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
