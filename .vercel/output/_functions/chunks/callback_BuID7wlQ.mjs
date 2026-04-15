import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { l as renderHead, r as renderTemplate } from './entrypoint_6sju6Ftj.mjs';
import 'clsx';
import { r as renderScript } from './script_DB7th2uj.mjs';

const $$Callback = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="pt-br" data-astro-cid-qbporkgn> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Confirmando acesso… — Destrave Hub</title>${renderHead()}</head> <body data-astro-cid-qbporkgn> <div class="box" data-astro-cid-qbporkgn> <div class="spinner" data-astro-cid-qbporkgn></div> <h2 data-astro-cid-qbporkgn>Confirmando sua conta…</h2> <p data-astro-cid-qbporkgn>Aguarde, você será redirecionado em instantes.</p> </div> ${renderScript($$result, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/auth/callback.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/auth/callback.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/auth/callback.astro";
const $$url = "/auth/callback";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Callback,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
