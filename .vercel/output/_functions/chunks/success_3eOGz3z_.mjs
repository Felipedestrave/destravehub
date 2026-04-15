import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_6sju6Ftj.mjs';
import { r as renderScript } from './script_DB7th2uj.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_B_DQSMrb.mjs';

const $$Success = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Success;
  const url = new URL(Astro2.request.url);
  const name = url.searchParams.get("name") || "Aluno";
  const email = url.searchParams.get("email") || "";
  const password = url.searchParams.get("password") || "";
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Aluno Cadastrado! — Destrave Hub", "activeNav": "students", "data-astro-cid-lpec3vj5": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="success-container" data-astro-cid-lpec3vj5> <div class="success-card" data-astro-cid-lpec3vj5> <div class="success-icon" data-astro-cid-lpec3vj5>🎉</div> <h1 class="success-title" data-astro-cid-lpec3vj5>Conta Criada!</h1> <p class="success-message" data-astro-cid-lpec3vj5>Você acabou de cadastrar <strong data-astro-cid-lpec3vj5>${name}</strong> como seu aluno oficial.</p> <div class="credentials-box" data-astro-cid-lpec3vj5> <p class="credentials-label" data-astro-cid-lpec3vj5>Dados de Acesso para o Aluno:</p> <div class="credential-row" data-astro-cid-lpec3vj5> <span class="row-label" data-astro-cid-lpec3vj5>E-mail:</span> <code class="row-value" data-astro-cid-lpec3vj5>${email}</code> </div> <div class="credential-row" data-astro-cid-lpec3vj5> <span class="row-label" data-astro-cid-lpec3vj5>Senha Inicial:</span> <code class="row-value" data-astro-cid-lpec3vj5>${password}</code> </div> <button id="copy-btn" class="copy-btn"${addAttribute(email, "data-email")}${addAttribute(password, "data-password")} data-astro-cid-lpec3vj5>
Copiar Dados para o WhatsApp
</button> </div> <div class="success-actions" data-astro-cid-lpec3vj5> <a href="/dashboard" class="btn-primary" data-astro-cid-lpec3vj5>Ir para Dashboard</a> <a href="/dashboard/students/new" class="btn-ghost" data-astro-cid-lpec3vj5>+ Cadastrar Outro</a> </div> </div> </div> ${renderScript($$result2, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/students/success.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/students/success.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/students/success.astro";
const $$url = "/dashboard/students/success";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Success,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
