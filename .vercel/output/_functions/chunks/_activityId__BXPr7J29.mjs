import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_6sju6Ftj.mjs';
import { r as renderScript } from './script_DB7th2uj.mjs';
import { $ as $$Layout } from './Layout_c2qLXd47.mjs';
import { s as supabaseAdmin } from './supabase-admin_DFM7DabO.mjs';

const $$activityId = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$activityId;
  const { activityId } = Astro2.params;
  if (!activityId) {
    return Astro2.redirect("/404");
  }
  const { data: activity, error } = await supabaseAdmin.from("activities").select("id, title, type, teacher_id").eq("id", activityId).single();
  if (error || !activity) {
    return Astro2.redirect("/404?error=invalid_invite");
  }
  const typeMap = {
    escuta: {
      label: "Destrave a Escuta",
      icon: "🎧",
      desc: "Exercício de compreensão auditiva"
    },
    mrp: {
      label: "Destrave Conversação",
      icon: "🎭",
      desc: "Role Play em idioma estrangeiro"
    },
    flashcards: {
      label: "Destrave Cards",
      icon: "🃏",
      desc: "Revisão de vocabulário e gramática"
    }
  };
  const typeInfo = typeMap[activity.type] ?? { label: "Missão Especial", icon: "🚀", desc: "Atividade interativa" };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Você foi convidado! — ${activity.title}`, "description": `O Sensei Felipe preparou uma missão especial de ${typeInfo.label} para você. Acesse agora e complete em até 48 horas!`, "data-astro-cid-f2uahms4": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="invite-page" data-astro-cid-f2uahms4> <!-- Background organic shapes --> <div class="bg-shape bg-shape--1" aria-hidden="true" data-astro-cid-f2uahms4></div> <div class="bg-shape bg-shape--2" aria-hidden="true" data-astro-cid-f2uahms4></div> <!-- Header --> <header class="invite-header" data-astro-cid-f2uahms4> <div class="logo-mark" data-astro-cid-f2uahms4> <span class="logo-icon" data-astro-cid-f2uahms4>⚡</span> <span class="logo-text font-outfit" data-astro-cid-f2uahms4>Destrave Hub</span> </div> </header> <!-- Main content --> <main class="invite-main" data-astro-cid-f2uahms4> <!-- Left: Sensei Avatar + Speech Bubble --> <div class="invite-sensei" id="sensei-col" data-astro-cid-f2uahms4> <div class="speech-bubble" data-astro-cid-f2uahms4> <p data-astro-cid-f2uahms4>Ei! Preparei uma missão especial só pra você. Aceita o desafio? 🎯</p> </div> <img src="/assets/host/sensei-3d.webp" alt="Sensei Felipe" class="sensei-avatar" loading="eager" width="420" height="420" data-astro-cid-f2uahms4> </div> <!-- Right: Mission Card + Form --> <div class="invite-form-col" id="form-col" data-astro-cid-f2uahms4> <!-- Mission badge --> <div class="mission-badge" data-astro-cid-f2uahms4> <span class="badge-icon" data-astro-cid-f2uahms4>${typeInfo.icon}</span> <span class="badge-label" data-astro-cid-f2uahms4>${typeInfo.desc}</span> </div> <!-- Mission title --> <h1 class="mission-title font-outfit" data-astro-cid-f2uahms4>${activity.title}</h1> <!-- 48h urgency banner --> <div class="urgency-banner" role="status" data-astro-cid-f2uahms4> <span class="urgency-pulse" aria-hidden="true" data-astro-cid-f2uahms4></span> <span data-astro-cid-f2uahms4>⏰ Acesso válido por <strong data-astro-cid-f2uahms4>48 horas</strong> após o cadastro</span> </div> <!-- Capture form --> <form id="capture-form" class="capture-form" novalidate data-astro-cid-f2uahms4> <input type="hidden" name="activityId"${addAttribute(activityId, "value")} data-astro-cid-f2uahms4> <div class="field-group" data-astro-cid-f2uahms4> <label for="lead-name" class="field-label" data-astro-cid-f2uahms4>Seu nome</label> <input id="lead-name" name="name" type="text" placeholder="Como posso te chamar?" class="field-input" autocomplete="given-name" required data-astro-cid-f2uahms4> </div> <div class="field-group" data-astro-cid-f2uahms4> <label for="lead-whatsapp" class="field-label" data-astro-cid-f2uahms4>WhatsApp <span class="field-required" data-astro-cid-f2uahms4>*</span></label> <input id="lead-whatsapp" name="whatsapp" type="tel" placeholder="(11) 9 0000-0000" class="field-input" autocomplete="tel" required data-astro-cid-f2uahms4> </div> <div class="field-group" data-astro-cid-f2uahms4> <label for="lead-email" class="field-label" data-astro-cid-f2uahms4>E-mail <span class="field-optional" data-astro-cid-f2uahms4>(opcional)</span></label> <input id="lead-email" name="email" type="email" placeholder="seu@email.com" class="field-input" autocomplete="email" data-astro-cid-f2uahms4> </div> <div id="form-error" class="form-error" role="alert" aria-live="polite" data-astro-cid-f2uahms4></div> <button id="submit-btn" type="submit" class="btn-submit font-outfit" data-astro-cid-f2uahms4> <span id="btn-text" data-astro-cid-f2uahms4>🚀 Começar Minha Missão</span> <span id="btn-loader" class="btn-loader" hidden aria-label="Carregando..." data-astro-cid-f2uahms4></span> </button> <p class="form-disclaimer" data-astro-cid-f2uahms4>
Seu WhatsApp é usado apenas para você receber contato do Sensei sobre seus resultados. Sem spam.
</p> </form> </div> </main> </div> ` })} ${renderScript($$result, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/convite/[activityId].astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/convite/[activityId].astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/convite/[activityId].astro";
const $$url = "/convite/[activityId]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$activityId,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
