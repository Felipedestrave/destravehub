import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { h as addAttribute, l as renderHead, q as renderSlot, r as renderTemplate } from './entrypoint_6sju6Ftj.mjs';
import 'clsx';
/* empty css                 */

const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "Destrave Hub — Ferramentas de Autoria para Professores de Idiomas",
    description = "Transforme PDFs e materiais estáticos em missões interativas para seus alunos. O combo de ferramentas para professores de idiomas que ganham tempo e organizam tudo em um só lugar."
  } = Astro2.props;
  return renderTemplate`<html lang="pt-br"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><meta name="theme-color" content="#58317E"><!-- Open Graph --><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><title>${title}</title><link rel="icon" type="image/svg+xml" href="/favicon.svg">${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
