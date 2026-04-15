import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { $ as $$Layout } from './Layout_c2qLXd47.mjs';

const $$Expired = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Acesso Expirado — Destrave Hub", "data-astro-cid-spcvznij": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="expired-page" data-astro-cid-spcvznij> <div class="expired-card" data-astro-cid-spcvznij> <div class="expired-icon" data-astro-cid-spcvznij>⏰</div> <h1 class="font-outfit" data-astro-cid-spcvznij>Sua janela de 48h encerrou</h1> <p data-astro-cid-spcvznij>
O link de acesso experimental tem validade de <strong data-astro-cid-spcvznij>48 horas</strong> a partir 
                do seu cadastro para manter o desafio real e motivador.
</p> <p class="expired-cta-text" data-astro-cid-spcvznij>
Quer fazer mais missões e acompanhar sua evolução sem limite de tempo?
</p> <a href="https://wa.me/?text=Oi!%20Quero%20saber%20mais%20sobre%20o%20Destrave%20Hub!" target="_blank" rel="noopener noreferrer" class="btn-whatsapp" data-astro-cid-spcvznij>
💬 Falar com o Sensei no WhatsApp
</a> </div> </div> ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/share/expired.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/share/expired.astro";
const $$url = "/share/expired";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Expired,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
