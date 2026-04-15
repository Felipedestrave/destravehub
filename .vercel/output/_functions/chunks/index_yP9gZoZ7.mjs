import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_6sju6Ftj.mjs';
import { r as renderScript } from './script_DB7th2uj.mjs';
import { $ as $$Layout } from './Layout_c2qLXd47.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Destrave Hub — Liberdade para Criar e Ensinar", "description": "Transforme PDFs e materiais estáticos em missões interativas para seus alunos — sem virar refém de criar exercício do zero." }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<nav class="sticky top-0 z-50 bg-[var(--color-ice)]/90 backdrop-blur-sm border-b border-[var(--color-slate-border)]"> <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between"> <a href="/" class="flex items-center gap-3"> <div class="w-9 h-9 bg-[var(--color-brand)] rounded-lg flex items-center justify-center shadow-md -rotate-6 transition-transform hover:rotate-0 duration-200"> <span class="text-white font-outfit font-bold text-lg leading-none">D</span> </div> <span class="font-outfit font-bold text-xl tracking-tight text-[var(--color-brand)]">
Destrave<span class="text-[var(--color-slate-dark)]/60">Hub</span> </span> </a> <div class="hidden md:flex items-center gap-8"> <a href="#ferramentas" class="font-medium text-[var(--color-slate-mid)] hover:text-[var(--color-brand)] transition-colors duration-150 text-sm">Ferramentas</a> <a href="#como-funciona" class="font-medium text-[var(--color-slate-mid)] hover:text-[var(--color-brand)] transition-colors duration-150 text-sm">Como Funciona</a> <div class="h-4 w-[1px] bg-[var(--color-slate-border)]"></div> <a href="/auth/login" class="font-bold text-[var(--color-brand)] hover:opacity-80 transition-opacity text-sm">Entrar</a> <a href="/auth/register" class="btn-primary text-sm !py-2.5 !px-5">Criar Conta</a> </div> </div> </nav>  <section class="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center"> <span class="badge-brand mb-6 inline-block">Acesso Antecipado — Lista de Espera Aberta</span> <h1 class="font-outfit font-bold text-5xl md:text-7xl text-[var(--color-slate-dark)] leading-[1.07] tracking-tight mb-6">
Destrave sua<br> <span class="text-[var(--color-brand)]">preparação de aula.</span> </h1> <p class="text-lg md:text-xl text-[var(--color-slate-mid)] max-w-2xl mx-auto mb-4 leading-relaxed">
Transforme PDFs e materiais estáticos em missões interativas para seus alunos — sem virar refém de criar exercício do zero.
</p> <p class="text-base text-[var(--color-slate-mid)]/70 max-w-xl mx-auto mb-10 leading-relaxed">
O Destrave Hub é o combo de ferramentas que ajuda professores de idiomas a
<strong class="text-[var(--color-slate-dark)]">ganhar tempo</strong>,
<strong class="text-[var(--color-slate-dark)]">organizar alunos</strong> e
<strong class="text-[var(--color-slate-dark)]">colocar o aluno para praticar</strong> de verdade entre as aulas.
</p> <div class="flex flex-col sm:flex-row gap-4 justify-center"> <a href="#lista-de-espera" class="btn-action text-lg !py-4 !px-8">
Quero ser um dos primeiros professores
</a> </div> <p class="mt-4 text-sm text-[var(--color-slate-mid)]/60">
Entre na lista de espera e receba convite no WhatsApp.
</p> </section>  <section class="bg-white border-y border-[var(--color-slate-border)] py-20"> <div class="max-w-4xl mx-auto px-6"> <h2 class="font-outfit font-bold text-3xl md:text-4xl text-[var(--color-slate-dark)] mb-6 text-center">
Você sabe como é.
</h2> <p class="text-center text-[var(--color-slate-mid)] text-lg mb-12">
Você quer preparar uma aula boa, com prática real… mas, no fim, o tempo vai embora em tarefas repetitivas:
</p> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"> ${[
    "Adaptar material para cada aluno",
    "Criar exercício do zero toda semana",
    "Organizar o que cada aluno precisa",
    "Cobrar prática fora da aula (e torcer pra acontecer)"
  ].map((item) => renderTemplate`<div class="flex items-start gap-3 p-4 rounded-xl border border-[var(--color-slate-border)] bg-[var(--color-ice)]"> <div class="w-5 h-5 rounded-full bg-[var(--color-action)]/15 flex items-center justify-center flex-shrink-0 mt-0.5"> <div class="w-2 h-2 rounded-full bg-[var(--color-action)]"></div> </div> <span class="text-[var(--color-slate-dark)] text-sm leading-relaxed">${item}</span> </div>`)} </div> <p class="text-center text-[var(--color-slate-mid)] mt-10 text-base max-w-lg mx-auto leading-relaxed">
Aí a aula fica ótima… mas o aluno <strong class="text-[var(--color-slate-dark)]">trava entre uma aula e outra.</strong> </p> </div> </section>  <section class="py-24 max-w-6xl mx-auto px-6"> <div class="text-center mb-16"> <span class="badge-brand mb-4 inline-block">A Mudança</span> <h2 class="font-outfit font-bold text-4xl md:text-5xl text-[var(--color-slate-dark)] leading-tight">
Com o Destrave Hub, você transforma<br> <span class="text-[var(--color-brand)]">material em prática ativa.</span> </h2> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-8"> ${[
    {
      num: "01",
      title: "Material vira missão",
      desc: "Pegue um PDF e transforme em treino (escuta, compreensão, tarefas) para o aluno fazer fora da aula. Sem complicação.",
      color: "var(--color-brand)"
    },
    {
      num: "02",
      title: "Cada aluno recebe o que precisa",
      desc: "Você envia a atividade para o aluno certo, do jeito certo, no momento certo.",
      color: "var(--color-action)"
    },
    {
      num: "03",
      title: "Feedback imediato para o aluno",
      desc: "O aluno pratica e já recebe retorno — o que aumenta muito a chance dele continuar.",
      color: "var(--color-brand)"
    }
  ].map((item) => renderTemplate`<div class="card group cursor-default"> <div class="font-outfit font-bold text-5xl mb-4"${addAttribute(`color: ${item.color}; opacity: 0.15;`, "style")}>${item.num}</div> <h3 class="font-outfit font-bold text-xl text-[var(--color-slate-dark)] mb-3 group-hover:text-[var(--color-brand)] transition-colors duration-150">${item.title}</h3> <p class="text-[var(--color-slate-mid)] text-sm leading-relaxed">${item.desc}</p> </div>`)} </div> </section>  <section id="ferramentas" class="py-24 bg-white border-y border-[var(--color-slate-border)]"> <div class="max-w-6xl mx-auto px-6"> <div class="text-center mb-16"> <span class="badge-brand mb-4 inline-block">Core 4</span> <h2 class="font-outfit font-bold text-4xl md:text-5xl text-[var(--color-slate-dark)]">
Seu Arsenal de Autoria
</h2> <p class="text-[var(--color-slate-mid)] mt-4 max-w-xl mx-auto">
Um hub com 4 mini-apps integrados, pensados no fluxo real de aula.
</p> </div> <div class="grid grid-cols-1 sm:grid-cols-2 gap-6"> ${[
    {
      emoji: "🎨",
      name: "Destrave Draw",
      tag: "Flagship",
      desc: "Um quadro branco para aula ao vivo, com recursos para deixar a explicação mais clara e dinâmica.",
      badge: true
    },
    {
      emoji: "🎭",
      name: "Destrave MRP",
      tag: "Conversação",
      desc: "Prática de conversação situacional com feedback e orientação, incluindo polidez quando fizer sentido.",
      badge: false
    },
    {
      emoji: "🎧",
      name: "Destrave a Escuta",
      tag: "Áudio + PDF",
      desc: "Upload de PDF → treino de escuta automatizado para o aluno praticar entre as aulas.",
      badge: false
    },
    {
      emoji: "📊",
      name: "LingoQuiz Gen",
      tag: "Avaliações",
      desc: "Gerador de avaliações com opção de exportar gabarito em PDF A4 pronto para impressão.",
      badge: false
    }
  ].map((app) => renderTemplate`<div class="card flex items-start gap-5 group cursor-default"> <div class="text-4xl flex-shrink-0 w-14 h-14 bg-[var(--color-ice)] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200"> ${app.emoji} </div> <div> <div class="flex items-center gap-2 mb-2"> <h3 class="font-outfit font-bold text-lg text-[var(--color-slate-dark)] group-hover:text-[var(--color-brand)] transition-colors duration-150">${app.name}</h3> ${app.badge ? renderTemplate`<span class="badge-brand">Flagship</span>` : renderTemplate`<span class="badge-neutral">${app.tag}</span>`} </div> <p class="text-[var(--color-slate-mid)] text-sm leading-relaxed">${app.desc}</p> </div> </div>`)} </div> </div> </section>  <section class="py-24 max-w-4xl mx-auto px-6"> <div class="text-center mb-14"> <h2 class="font-outfit font-bold text-4xl text-[var(--color-slate-dark)]">
"Mas vai ficar genérico?"
</h2> </div> <div class="space-y-4"> ${[
    {
      q: '"Tenho medo de a IA deixar tudo com cara de modelo pronto."',
      a: "O Destrave Hub não substitui seu jeito de ensinar. Ele acelera o que você já faz. Você parte do seu material, do seu foco, do seu aluno."
    },
    {
      q: '"Meus alunos não vão usar…"',
      a: "Por isso o aluno recebe missões claras e feedback imediato. Menos atrito, mais continuidade. O aluno sabe exatamente: o que fazer, quando fazer e por quê."
    },
    {
      q: '"Vai dar trabalho aprender?"',
      a: "A experiência foi pensada pra ser direta: professor entra, sobe o material, gera a missão e envia. Sem tutorial infinito."
    },
    {
      q: '"Mais uma plataforma… vou ter que mudar meu jeito de trabalhar?"',
      a: "Você não precisa virar refém do sistema. O Hub entra para organizar e acelerar, não para complicar."
    }
  ].map((faq) => renderTemplate`<details class="card cursor-pointer group"> <summary class="list-none flex justify-between items-start gap-4 cursor-pointer"> <span class="font-outfit font-semibold text-[var(--color-slate-dark)] group-open:text-[var(--color-brand)] transition-colors duration-150">${faq.q}</span> <span class="text-[var(--color-slate-border)] group-open:text-[var(--color-brand)] font-bold text-xl leading-none flex-shrink-0 transition-colors duration-150">+</span> </summary> <p class="mt-4 text-[var(--color-slate-mid)] text-sm leading-relaxed pt-4 border-t border-[var(--color-slate-border)]">${faq.a}</p> </details>`)} </div> </section>  <section id="como-funciona" class="py-20 bg-white border-y border-[var(--color-slate-border)]"> <div class="max-w-5xl mx-auto px-6"> <div class="text-center mb-16"> <span class="badge-brand mb-4 inline-block">3 Passos</span> <h2 class="font-outfit font-bold text-4xl text-[var(--color-slate-dark)]">Como funciona</h2> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative"> ${[
    { num: 1, title: "Crie sua conta e cadastre seus alunos", desc: "Tudo centralizado em um só lugar." },
    { num: 2, title: "Transforme um material em missão e envie", desc: "Em poucos cliques, para o aluno certo." },
    { num: 3, title: "O aluno pratica e você acompanha", desc: "Atividade entregue, feita e registrada. Menos 'e aí, conseguiu fazer?'" }
  ].map((step, i) => renderTemplate`<div class="flex flex-col items-center text-center gap-4"> <div class="w-14 h-14 rounded-2xl bg-[var(--color-brand)] text-white font-outfit font-bold text-2xl flex items-center justify-center shadow-md"> ${step.num} </div> <h3 class="font-outfit font-bold text-lg text-[var(--color-slate-dark)]">${step.title}</h3> <p class="text-[var(--color-slate-mid)] text-sm leading-relaxed">${step.desc}</p> </div>`)} </div> </div> </section>  <section class="py-24 max-w-5xl mx-auto px-6"> <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"> <div> <span class="badge-brand mb-4 inline-block">Para quem é</span> <h2 class="font-outfit font-bold text-4xl text-[var(--color-slate-dark)] mb-6">
Para professores de idiomas que querem mais tempo e resultado.
</h2> <ul class="space-y-3"> ${["Economizar tempo de preparação", "Aumentar prática entre aulas", "Ter um fluxo organizado de alunos e tarefas"].map((item) => renderTemplate`<li class="flex items-center gap-3 text-[var(--color-slate-dark)]"> <div class="w-5 h-5 bg-[var(--color-action)] rounded-full flex items-center justify-center flex-shrink-0"> <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> </div> <span class="text-sm font-medium">${item}</span> </li>`)} </ul> </div> <div class="card border-l-4 border-l-[var(--color-brand)]"> <span class="badge-brand mb-4 inline-block">Especialmente forte para japonês</span> <h3 class="font-outfit font-bold text-xl text-[var(--color-slate-dark)] mb-4">Professores de Japonês (JLPT N5–N3)</h3> <p class="text-[var(--color-slate-mid)] text-sm leading-relaxed mb-4">
Se você ensina japonês, sabe o peso de:
</p> <ul class="space-y-2"> ${["Prática de escuta consistente", "Treino de produção sem travar", "Situações e polidez quando necessário"].map((item) => renderTemplate`<li class="flex items-center gap-2 text-sm text-[var(--color-slate-dark)]"> <span class="font-jp text-[var(--color-brand)] font-bold">語</span> ${item} </li>`)} </ul> <p class="text-[var(--color-slate-mid)] text-sm mt-4 pt-4 border-t border-[var(--color-slate-border)] leading-relaxed">
O Destrave Hub foi pensado com esse contexto em mente.
</p> </div> </div> </section>  <section class="py-20 bg-[var(--color-brand)] text-white"> <div class="max-w-3xl mx-auto px-6 text-center"> <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">👨‍🏫</div> <p class="font-outfit text-xl md:text-2xl font-semibold leading-relaxed mb-4">
"Sou Felipe Kawakami, professor de japonês. Criei o Destrave Hub porque eu perdia horas preparando aulas e exercícios — e queria transformar isso em prática real para o aluno, sem virar refém de material."
</p> <span class="text-white/60 text-sm">— Felipe Kawakami, fundador</span> </div> </section>  <section id="lista-de-espera" class="py-24 max-w-2xl mx-auto px-6 text-center"> <span class="badge-brand mb-4 inline-block">Lista de Espera</span> <h2 class="font-outfit font-bold text-4xl md:text-5xl text-[var(--color-slate-dark)] mb-4 leading-tight">
Entre na lista e<br>seja convidado no pré-lançamento.
</h2> <p class="text-[var(--color-slate-mid)] mb-10">Convite e novidades pelo WhatsApp. Sem spam.</p> <form id="waitlist-form" class="card text-left space-y-5" novalidate> <div> <label for="name" class="block text-sm font-semibold text-[var(--color-slate-dark)] mb-1.5">
Seu nome <span class="text-[var(--color-action)]">*</span> </label> <input id="name" name="name" type="text" required placeholder="Ex: Felipe Kawakami" class="w-full px-4 py-3 rounded-xl border border-[var(--color-slate-border)] bg-[var(--color-ice)] text-[var(--color-slate-dark)] text-sm font-medium placeholder:text-[var(--color-slate-mid)]/50 focus:outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10 transition-all duration-150"> </div> <div> <label for="whatsapp" class="block text-sm font-semibold text-[var(--color-slate-dark)] mb-1.5">
WhatsApp <span class="text-[var(--color-action)]">*</span> </label> <input id="whatsapp" name="whatsapp" type="tel" required placeholder="(11) 99999-9999" class="w-full px-4 py-3 rounded-xl border border-[var(--color-slate-border)] bg-[var(--color-ice)] text-[var(--color-slate-dark)] text-sm font-medium placeholder:text-[var(--color-slate-mid)]/50 focus:outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10 transition-all duration-150"> </div> <div> <label for="idioma" class="block text-sm font-semibold text-[var(--color-slate-dark)] mb-1.5">
Qual idioma você ensina? <span class="text-[var(--color-slate-mid)]/50">(opcional)</span> </label> <input id="idioma" name="idioma" type="text" placeholder="Ex: Japonês, Inglês, Espanhol…" class="w-full px-4 py-3 rounded-xl border border-[var(--color-slate-border)] bg-[var(--color-ice)] text-[var(--color-slate-dark)] text-sm font-medium placeholder:text-[var(--color-slate-mid)]/50 focus:outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10 transition-all duration-150"> </div> <button id="submit-btn" type="submit" class="btn-action w-full text-base justify-center">
Quero ser um dos primeiros professores
</button> <div id="form-feedback" class="hidden text-center py-3 px-4 rounded-xl text-sm font-semibold"></div> </form> </section>  <footer class="border-t border-[var(--color-slate-border)] py-10"> <div class="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-[var(--color-slate-mid)]"> <div class="flex items-center gap-2"> <div class="w-6 h-6 bg-[var(--color-brand)] rounded flex items-center justify-center"> <span class="text-white font-bold text-xs">D</span> </div> <span class="font-outfit font-semibold text-[var(--color-slate-dark)]">Destrave Hub</span> </div> <p>© 2026 Destrave Hub. Feito com 🎌 por Felipe Kawakami.</p> </div> </footer> ` })} ${renderScript($$result, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/index.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
