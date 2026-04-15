import{j as e}from"./jsx-runtime.u17CrQMm.js";import{r,R as ee}from"./index.DrBtkhmp.js";import{C as re,B as xe}from"./BuddyView.baO4iarD.js";import{S as ge}from"./store.BRx3I6wk.js";import{C as be,M as he,g as ue}from"./MaterialsDrawer.BNk60Hca.js";import{s as U}from"./materials.astro_astro_type_script_index_0_lang.CbpkQ25P.js";import{P as ve,R as je,A as ye,C as we}from"./AdvancedLoading.BFuNHCun.js";import{L as Ne}from"./layers.E8oGsr1D.js";import{F as ke}from"./file-text.CiBs32nN.js";import{c as X}from"./createLucideIcon.BukDFzw_.js";import{L as te}from"./loader-circle.CueQDEKg.js";import{C as le}from"./chevron-right.B5VOUX-2.js";import{S as ce,a as ze,R as Se}from"./RoleGuard.DA5ENlqy.js";import{C as H}from"./circle-check.CzS0XoDm.js";import{L as ae}from"./lightbulb.BsC--J75.js";import{A as Ce}from"./index.DOtcC6DD.js";import{m as Ee}from"./proxy.BLcRGA29.js";import{T as Ae}from"./trophy.31LVHM7q.js";import{T as Ie}from"./target.DQNRlkPP.js";import{A as Me}from"./arrow-left.Cf3uhIgY.js";import{B as Pe}from"./book-open.BXHyXqCE.js";const Re=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],se=X("chevron-down",Re);const De=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],Te=X("eye",De);const Oe=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],Le=X("send",Oe);const Fe=[["path",{d:"M2 10s3-3 3-8",key:"3xiif0"}],["path",{d:"M22 10s-3-3-3-8",key:"ioaa5q"}],["path",{d:"M10 2c0 4.4-3.6 8-8 8",key:"16fkpi"}],["path",{d:"M14 2c0 4.4 3.6 8 8 8",key:"b9eulq"}],["path",{d:"M2 10s2 2 2 5",key:"1au1lb"}],["path",{d:"M22 10s-2 2-2 5",key:"qi2y5e"}],["path",{d:"M8 15h8",key:"45n4r"}],["path",{d:"M2 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1",key:"1vsc2m"}],["path",{d:"M14 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1",key:"hrha4u"}]],$e=X("theater",Fe);var T=(t=>(t.N5="N5",t.N4="N4",t.N3="N3",t.MIXED="Misto",t))(T||{}),O=(t=>(t.MULTIPLE_CHOICE="Múltipla Escolha",t.DISCURSIVE="Discursiva (Digitar)",t))(O||{});const _e=({onSubmit:t,isLoading:m})=>{const[i,f]=r.useState(""),[d,x]=r.useState(null),[z,S]=r.useState(null),[g,s]=r.useState(10),[p,o]=r.useState(T.N5),[k,b]=r.useState(O.MULTIPLE_CHOICE),y=a=>{if(a.preventDefault(),!d&&i.trim().length<20){alert("Por favor, faça upload de um PDF ou insira um texto com pelo menos 20 caracteres.");return}t({context:i,pdfBase64:d||void 0,quantity:g,level:p,mode:k})};return e.jsxs("form",{onSubmit:y,className:"mrp-config-form",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsxs("div",{className:"inline-flex items-center gap-2 badge-brand mb-4",children:[e.jsx(Ne,{size:12}),"Destrave MRP"]}),e.jsxs("h1",{className:"font-outfit text-4xl font-extrabold text-slate-dark leading-tight",children:["Criação de ",e.jsx("span",{className:"text-brand",children:"Role Play"})," IA"]}),e.jsx("p",{className:"mt-3 text-slate-mid font-inter",children:"Faça upload do seu material em PDF e a IA criará cenários interativos para seus alunos."})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4",children:[e.jsx(ve,{onFileSelected:(a,n)=>{x(a),S(n)},currentFileName:z,description:"O PDF servirá de base para os cenários da IA"}),e.jsxs("div",{className:"card h-full",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[e.jsx(ke,{size:16,className:"text-slate-mid"}),e.jsx("label",{className:"text-xs font-bold text-slate-mid uppercase tracking-wider",children:"Conteúdo Manual (Opcional)"})]}),e.jsx("textarea",{value:i,onChange:a=>f(a.target.value),placeholder:"Se não tiver PDF, cole aqui notas da aula, lista de palavras ou texto de estudo...",className:"mrp-textarea h-[120px]"})]})]}),e.jsxs("div",{className:"card space-y-6",children:[e.jsx("h2",{className:"font-outfit text-lg font-bold text-slate-dark mb-4",children:"Personalização do Treinamento"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsxs("div",{className:"mrp-field",children:[e.jsx("label",{className:"mrp-label",children:"Quantidade de Questões"}),e.jsx("div",{className:"mrp-qty-group",children:[5,10,20].map(a=>e.jsx("button",{type:"button",onClick:()=>s(a),className:`mrp-qty-btn ${g===a?"active":""}`,children:a},a))})]}),e.jsxs("div",{className:"mrp-field",children:[e.jsx("label",{className:"mrp-label",children:"Nível de Dificuldade"}),e.jsxs("div",{className:"mrp-select-wrapper",children:[e.jsxs("select",{value:p,onChange:a=>o(a.target.value),className:"mrp-select",children:[e.jsx("option",{value:T.N5,children:"N5 — Básico (Iniciante)"}),e.jsx("option",{value:T.N4,children:"N4 — Intermediário"}),e.jsx("option",{value:T.N3,children:"N3 — Avançado"}),e.jsx("option",{value:T.MIXED,children:"JLPT Misto (N5–N3)"})]}),e.jsx(se,{size:16,className:"mrp-select-icon"})]})]}),e.jsxs("div",{className:"mrp-field",children:[e.jsx("label",{className:"mrp-label",children:"Formato de Resposta"}),e.jsxs("div",{className:"mrp-select-wrapper",children:[e.jsxs("select",{value:k,onChange:a=>b(a.target.value),className:"mrp-select",children:[e.jsx("option",{value:O.MULTIPLE_CHOICE,children:"Múltipla Escolha"}),e.jsx("option",{value:O.DISCURSIVE,children:"Discursiva (Digitar)"})]}),e.jsx(se,{size:16,className:"mrp-select-icon"})]})]})]})]}),e.jsxs("div",{className:"flex justify-center gap-4 text-[0.7rem] font-bold text-slate-mid/60 uppercase tracking-widest mt-2",children:[e.jsx("span",{children:"N5: 2pts"}),e.jsx("span",{children:"•"}),e.jsx("span",{children:"N4: 4pts"}),e.jsx("span",{children:"•"}),e.jsx("span",{children:"N3: 6pts"}),e.jsx("span",{children:"•"}),e.jsx("span",{children:"Hint: -50%"})]}),e.jsx("button",{type:"submit",disabled:m,className:"btn-action w-full py-4 mt-4",children:m?e.jsxs(e.Fragment,{children:[e.jsx(te,{className:"animate-spin",size:20}),"Gerando cenários com IA..."]}):e.jsxs(e.Fragment,{children:["Iniciar Criação de Missão",e.jsx(le,{size:18})]})}),e.jsx("style",{children:`
        .mrp-config-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 680px;
          width: 100%;
          margin: 0 auto;
        }
        .mrp-config-header { display: flex; flex-direction: column; gap: 0.375rem; }
        .mrp-config-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          background: rgba(88,49,126,0.1);
          color: var(--color-brand);
          border: 1px solid rgba(88,49,126,0.2);
          border-radius: 999px;
          padding: 0.25rem 0.75rem;
          font-family: var(--font-outfit);
          font-size: 0.75rem;
          font-weight: 700;
          width: fit-content;
          letter-spacing: 0.04em;
        }
        .mrp-config-title {
          font-family: var(--font-outfit);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-slate-dark);
          margin: 0;
        }
        .mrp-config-subtitle {
          font-family: var(--font-inter);
          font-size: 0.9rem;
          color: var(--color-slate-mid);
          margin: 0;
          line-height: 1.5;
        }
        .mrp-field { display: flex; flex-direction: column; gap: 0.5rem; }
        .mrp-field-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mrp-label {
          font-family: var(--font-inter);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-slate-mid);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .mrp-pdf-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          background: none;
          border: 1px solid var(--color-slate-border);
          border-radius: 0.5rem;
          padding: 0.3rem 0.75rem;
          font-family: var(--font-outfit);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-brand);
          cursor: pointer;
          transition: background 150ms, border-color 150ms;
        }
        .mrp-pdf-btn:hover { background: rgba(88,49,126,0.06); border-color: var(--color-brand); }
        .mrp-pdf-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .mrp-textarea {
          width: 100%;
          border: 1.5px solid var(--color-slate-border);
          border-radius: 0.75rem;
          padding: 0.875rem 1rem;
          font-family: var(--font-inter);
          font-size: 0.9rem;
          color: var(--color-slate-dark);
          background: var(--color-white, #fff);
          resize: vertical;
          transition: border-color 150ms, box-shadow 150ms;
          outline: none;
          box-sizing: border-box;
        }
        .mrp-textarea:focus {
          border-color: var(--color-brand);
          box-shadow: 0 0 0 3px rgba(88,49,126,0.12);
        }
        .mrp-textarea::placeholder { color: var(--color-slate-border); }
        .mrp-options-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        @media (max-width: 600px) {
          .mrp-options-grid { grid-template-columns: 1fr; }
        }
        .mrp-qty-group { display: flex; gap: 0.5rem; }
        .mrp-qty-btn {
          flex: 1;
          padding: 0.55rem 0;
          border-radius: 0.625rem;
          border: 1.5px solid var(--color-slate-border);
          background: transparent;
          font-family: var(--font-outfit);
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-slate-mid);
          cursor: pointer;
          transition: all 150ms;
        }
        .mrp-qty-btn:hover { border-color: var(--color-brand); color: var(--color-brand); }
        .mrp-qty-btn.active {
          background: var(--color-brand);
          border-color: var(--color-brand);
          color: white;
        }
        .mrp-select-wrapper { position: relative; }
        .mrp-select {
          width: 100%;
          appearance: none;
          border: 1.5px solid var(--color-slate-border);
          border-radius: 0.625rem;
          padding: 0.6rem 2rem 0.6rem 0.875rem;
          font-family: var(--font-inter);
          font-size: 0.875rem;
          color: var(--color-slate-dark);
          background: var(--color-white, #fff);
          cursor: pointer;
          outline: none;
          transition: border-color 150ms, box-shadow 150ms;
        }
        .mrp-select:focus { border-color: var(--color-brand); box-shadow: 0 0 0 3px rgba(88,49,126,0.12); }
        .mrp-select-icon {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-slate-mid);
          pointer-events: none;
        }
        .mrp-scoring-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          font-family: var(--font-inter);
          font-size: 0.78rem;
          color: var(--color-slate-mid);
          background: var(--color-ice);
          border: 1px solid var(--color-slate-border);
          border-radius: 0.75rem;
          padding: 0.6rem 1rem;
        }
        .mrp-dot { color: var(--color-slate-border); }
        .mrp-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          width: 100%;
          padding: 0.9rem 1.5rem;
          background: var(--color-action);
          color: white;
          border: none;
          border-radius: 0.875rem;
          font-family: var(--font-outfit);
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          transition: background 150ms, transform 100ms, box-shadow 150ms;
          box-shadow: 0 4px 16px rgba(255,127,50,0.25);
          letter-spacing: 0.02em;
        }
        .mrp-submit-btn:hover:not(:disabled) {
          background: #E66A1F;
          box-shadow: 0 6px 20px rgba(255,127,50,0.35);
          transform: translateY(-1px);
        }
        .mrp-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .mrp-spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: mrp-spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes mrp-spin { to { transform: rotate(360deg); } }
      `})]})},Be=({questions:t,config:m,onSave:i,onStartGame:f,onCancel:d,isSaving:x,initialTitle:z})=>{const[S,g]=ee.useState(z||`MRP: ${m.level} - ${new Date().toLocaleDateString()}`);return e.jsxs("div",{className:"mrp-review-container",children:[e.jsxs("header",{className:"mrp-review-header",children:[e.jsxs("div",{children:[e.jsx("span",{className:"mrp-review-badge",children:"Revisão da IA"}),e.jsx("h2",{className:"mrp-review-title",children:"Cenários Gerados"}),e.jsxs("p",{className:"mrp-review-subtitle",children:[t.length," cenários criados. Salve como uma ",e.jsx("strong",{children:"Atividade"})," para seus alunos ou jogue agora para testar."]})]}),e.jsxs("div",{className:"mrp-review-actions",children:[e.jsx("button",{onClick:d,className:"mrp-btn-cancel",children:"Descartar"}),e.jsxs("button",{onClick:()=>i(S),disabled:x,className:"mrp-btn-save",children:[x?e.jsx("span",{className:"mrp-spinner sm"}):e.jsx(ce,{size:18}),"Salvar na Central"]}),e.jsxs("button",{onClick:f,className:"mrp-btn-play",children:[e.jsx(Le,{size:18})," Iniciar Teste"]})]})]}),e.jsxs("div",{className:"mrp-title-input-wrapper",children:[e.jsx("label",{children:"Título da Atividade"}),e.jsx("input",{type:"text",value:S,onChange:s=>g(s.target.value),placeholder:"Ex: Diálogo no Restaurante - N5"})]}),e.jsx("div",{className:"mrp-questions-list",children:t.map((s,p)=>e.jsxs("div",{className:"mrp-review-card",children:[e.jsxs("div",{className:"mrp-card-num",children:["#",p+1]}),e.jsxs("div",{className:"mrp-card-content",children:[e.jsx("h4",{className:"mrp-card-jp",children:s.scenario}),e.jsx("p",{className:"mrp-card-translation",children:s.task}),e.jsxs("div",{className:"mrp-card-context",children:[e.jsx("strong",{children:"Dica:"})," ",s.hint||"Nenhuma dica disponível."]}),s.options&&s.options.length>0&&e.jsx("div",{className:"mrp-options-preview",children:s.options.map((o,k)=>e.jsxs("div",{className:`mrp-opt-p ${o===s.correctAnswer?"correct":""}`,children:[o," ",o===s.correctAnswer&&"✓"]},k))})]})]},p))}),e.jsx("style",{children:`
                .mrp-review-container { width: 100%; animation: fade-in 0.4s ease-out; max-width: 900px; margin: 0 auto; }
                .mrp-review-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; gap: 2rem; }
                .mrp-review-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 999px; background: rgba(14,165,233,0.1); color: #0ea5e9; font-family: var(--font-outfit); font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem; }
                .mrp-review-title { font-family: var(--font-outfit); font-size: 2rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
                .mrp-review-subtitle { font-size: 0.95rem; color: var(--color-slate-mid); margin: 0.25rem 0 0; }
                
                .mrp-review-actions { display: flex; gap: 0.75rem; }
                .mrp-btn-cancel { padding: 0.75rem 1.25rem; border-radius: 0.875rem; border: 1.5px solid var(--color-slate-border); background: white; font-family: var(--font-outfit); font-weight: 700; color: var(--color-slate-mid); cursor: pointer; transition: all 150ms; }
                .mrp-btn-save { padding: 0.75rem 1.5rem; border-radius: 0.875rem; border: none; background: var(--color-brand); color: white; font-family: var(--font-outfit); font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.6rem; transition: transform 150ms; box-shadow: 0 4px 12px rgba(88,49,126,0.2); }
                .mrp-btn-play { padding: 0.75rem 1.5rem; border-radius: 0.875rem; border: none; background: var(--color-action); color: white; font-family: var(--font-outfit); font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.6rem; transition: transform 150ms; box-shadow: 0 4px 12px rgba(255,127,50,0.2); }
                .mrp-btn-save:hover, .mrp-btn-play:hover { transform: translateY(-2px); filter: brightness(1.1); }

                .mrp-title-input-wrapper { background: white; border: 1.5px solid var(--color-slate-border); border-radius: 1rem; padding: 1.25rem; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.5rem; }
                .mrp-title-input-wrapper label { font-size: 0.75rem; font-weight: 700; color: var(--color-slate-mid); text-transform: uppercase; letter-spacing: 0.05em; }
                .mrp-title-input-wrapper input { border: 1.5px solid var(--color-slate-border); border-radius: 0.625rem; padding: 0.75rem 1rem; font-family: var(--font-outfit); font-size: 1.1rem; font-weight: 600; color: var(--color-slate-dark); outline: none; transition: border-color 150ms; }
                .mrp-title-input-wrapper input:focus { border-color: var(--color-brand); }

                .mrp-questions-list { display: flex; flex-direction: column; gap: 1rem; padding-bottom: 4rem; }
                .mrp-review-card { background: white; border-radius: 1.25rem; border: 1.5px solid var(--color-slate-border); display: flex; overflow: hidden; }
                .mrp-card-num { width: 50px; background: var(--color-ice); display: flex; align-items: center; justify-content: center; font-family: var(--font-outfit); font-weight: 800; color: var(--color-brand); font-size: 1.25rem; border-right: 1.5px solid var(--color-slate-border); }
                .mrp-card-content { padding: 1.5rem; flex: 1; }
                .mrp-card-jp { font-family: var(--font-outfit); font-size: 1.25rem; font-weight: 800; color: var(--color-slate-dark); margin: 0 0 0.25rem; }
                .mrp-card-translation { font-size: 0.95rem; color: var(--color-brand); font-weight: 600; margin-bottom: 1rem; }
                .mrp-card-context { font-size: 0.85rem; color: var(--color-slate-mid); background: var(--color-ice); padding: 0.6rem 0.875rem; border-radius: 0.5rem; margin-bottom: 1rem; border: 1px dashed var(--color-slate-border); }
                .mrp-options-preview { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
                .mrp-opt-p { font-size: 0.8rem; padding: 0.5rem; border-radius: 0.375rem; border: 1px solid var(--color-slate-border); color: var(--color-slate-mid); }
                .mrp-opt-p.correct { background: #dcfce7; border-color: #22c55e; color: #166534; font-weight: 700; }

                .mrp-spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: mrp-spin 0.7s linear infinite; }
                @keyframes mrp-spin { to { transform: rotate(360deg); } }
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `})]})},ie=["Hum... estou de olho, hein? 😉","Tem certeza, Senpai? Me parece um pouco diferente... 🤔","Essa resposta está meio suspeita! Mas vou confiar... desta vez. 👁️","Estudei muito japonês para saber que isso não bate! Mas você que sabe... 😂","Não tente enganar o Sensei! O fogo da honestidade deve queimar! 🔥"];function W(t){return t.replace(/\(.*?\)/g,"").replace(/[\s\u3000\u3001\u3002,.?!！？]/g,"").toLowerCase().trim()}function Ge(t,m){const i=W(t),f=W(m);if(!i||!f)return 0;if(i===f)return 1;const d=new Set(i.split("")),x=new Set(f.split("")),z=new Set([...d].filter(g=>x.has(g))),S=new Set([...d,...x]);return z.size/S.size}const Ue=({questions:t,mode:m,onComplete:i,onTriggerBuddy:f,senseiProfile:d})=>{const[x,z]=r.useState(0),[S,g]=r.useState(0),[s,p]=r.useState([]),[o,k]=r.useState(!1),[b,y]=r.useState(""),[a,n]=r.useState(!1),[h,w]=r.useState(null),[L,F]=r.useState("typing"),[$,_]=r.useState(null),l=t[x],Q=r.useMemo(()=>t.reduce((c,j)=>c+j.points,0),[t]),J=x/t.length*100,I=o?Math.floor(l.points/2):l.points,K=r.useMemo(()=>l?.options?[...l.options].sort(()=>Math.random()-.5):[],[l]),V=()=>{x+1<t.length?(z(c=>c+1),k(!1),y(""),w(null),F("typing")):i(s)},q=async c=>{if(a||h)return;n(!0);let j=!1,M="",E=0;m===O.MULTIPLE_CHOICE?(j=W(c)===W(l.correctAnswer),M=j?`✓ Correto! ${l.explanation}`:`Incorreto. A resposta era: ${l.correctAnswer}. ${l.explanation}`,E=j?I:0,g(C=>C+E),w({isCorrect:j,text:M}),f&&f(j?"success":"error",j?"success":"error"),p(C=>[...C,{questionId:l.id,answer:c,usedHint:o,isCorrect:j,scoreEarned:E}]),n(!1)):(F("comparing"),n(!1))},B=c=>{const j=Ge(b,l.correctAnswer);if(c&&j<.3){const C=ie[Math.floor(Math.random()*ie.length)];_(C),setTimeout(()=>_(null),4e3)}const M=c?`✓ Você se avaliou positivamente! ${l.explanation}`:`Sem problemas! A prática leva à perfeição. A resposta correta é: ${l.correctAnswer}. ${l.explanation}`,E=c?I:0;g(C=>C+E),w({isCorrect:c,text:M}),f&&f(c?"success":"error",c?"success":"error"),p(C=>[...C,{questionId:l.id,answer:b,usedHint:o,isCorrect:c,scoreEarned:E}])};return e.jsxs("div",{className:"mrp-game-wrapper",children:[e.jsxs("div",{className:"mrp-game-header",children:[e.jsxs("div",{className:"mrp-game-progress-meta",children:[e.jsxs("span",{className:"mrp-game-progress-label",children:["Questão ",e.jsx("strong",{children:x+1})," de ",t.length]}),e.jsx("span",{className:"mrp-level-tag",children:l.level})]}),e.jsxs("div",{className:"mrp-game-score-display",children:[e.jsx("span",{className:"mrp-game-score-num",children:S}),e.jsxs("span",{className:"mrp-game-score-max",children:["/ ",Q," pts"]})]})]}),e.jsx("div",{className:"mrp-progress-bar-track",children:e.jsx("div",{className:"mrp-progress-bar-fill",style:{width:`${J}%`}})}),e.jsxs("div",{className:"mrp-card",children:[e.jsxs("div",{className:"mrp-scenario-block",children:[e.jsx("div",{className:"mrp-scenario-icon",children:e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"9",cy:"7",r:"4"}),e.jsx("path",{d:"M23 21v-2a4 4 0 0 0-3-3.87"}),e.jsx("path",{d:"M16 3.13a4 4 0 0 1 0 7.75"})]})}),e.jsxs("div",{children:[e.jsx("span",{className:"mrp-scenario-eyebrow",children:"Cenário"}),e.jsx("p",{className:"mrp-scenario-text",children:l.scenario})]})]}),e.jsxs("div",{className:"mrp-task-block",children:[e.jsx("div",{className:"mrp-task-icon",children:e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"}),e.jsx("rect",{x:"9",y:"3",width:"6",height:"4",rx:"1"}),e.jsx("line",{x1:"9",y1:"12",x2:"15",y2:"12"}),e.jsx("line",{x1:"9",y1:"16",x2:"12",y2:"16"})]})}),e.jsxs("div",{children:[e.jsx("span",{className:"mrp-task-eyebrow",children:"Tarefa"}),e.jsx("p",{className:"mrp-task-text",children:l.task})]})]}),!h&&e.jsxs("div",{className:"mrp-answer-zone",children:[m===O.MULTIPLE_CHOICE?e.jsx("div",{className:"mrp-options-grid-game",children:K.map((c,j)=>e.jsxs("button",{onClick:()=>q(c),disabled:a,className:"mrp-option-btn",children:[e.jsx("span",{className:"mrp-option-letter",children:String.fromCharCode(65+j)}),e.jsx("span",{className:"mrp-option-text",children:c})]},j))}):e.jsx("div",{className:"mrp-discursive-zone",children:L==="typing"?e.jsxs(e.Fragment,{children:[e.jsx("textarea",{value:b,onChange:c=>y(c.target.value),disabled:a,placeholder:"Digite sua resposta em japonês...",className:"mrp-disc-textarea",rows:3}),e.jsx("button",{onClick:()=>q(b),disabled:a||!b.trim(),className:"mrp-disc-btn",children:a?e.jsxs(e.Fragment,{children:[e.jsx(te,{size:16,className:"mrp-spin-inline"})," Processando..."]}):e.jsxs(e.Fragment,{children:["Verificar Resposta ",e.jsx(Te,{size:16})]})})]}):e.jsxs("div",{className:"mrp-comparison-view",children:[e.jsxs("div",{className:"mrp-comparison-row",children:[e.jsx("span",{className:"mrp-comp-label",children:"Sua resposta:"}),e.jsx("p",{className:"mrp-comp-val student",children:b})]}),e.jsxs("div",{className:"mrp-comparison-row",children:[e.jsx("span",{className:"mrp-comp-label",children:"Resposta esperada:"}),e.jsx("p",{className:"mrp-comp-val sensei",children:l.correctAnswer})]}),e.jsxs("div",{className:"mrp-self-assess-actions",children:[e.jsx("p",{className:"mrp-self-assess-invite",children:"Como foi? Honestidade vale XP!"}),e.jsxs("div",{className:"mrp-self-assess-btns",children:[e.jsxs("button",{onClick:()=>B(!1),className:"mrp-assess-btn red",children:[e.jsx(re,{size:18})," Errei / Quero repetir"]}),e.jsxs("button",{onClick:()=>B(!0),className:"mrp-assess-btn green",children:[e.jsx(H,{size:18})," Acertei!"]})]})]})]})}),e.jsx("div",{className:"mrp-hint-area",children:o?e.jsxs("div",{className:"mrp-hint-box",children:[e.jsx(ae,{size:16,className:"mrp-hint-icon"}),e.jsx("p",{className:"mrp-hint-text",children:l.hint})]}):e.jsxs("button",{onClick:()=>k(!0),className:"mrp-hint-trigger",children:[e.jsx(ae,{size:14}),"Usar Dica ",e.jsx("span",{className:"mrp-hint-penalty",children:"(−50% dos pontos)"})]})})]}),h&&e.jsxs("div",{className:`mrp-feedback-block ${h.isCorrect?"correct":"incorrect"}`,children:[e.jsxs("div",{className:"mrp-feedback-header",children:[h.isCorrect?e.jsx(H,{size:24,className:"mrp-feedback-icon correct"}):e.jsx(re,{size:24,className:"mrp-feedback-icon incorrect"}),e.jsx("span",{className:`mrp-feedback-label ${h.isCorrect?"correct":"incorrect"}`,children:h.isCorrect?"Excelente!":"Sem problemas!"}),h.isCorrect&&e.jsxs("span",{className:"mrp-feedback-points",children:["+",I," pts"]})]}),e.jsx("p",{className:"mrp-feedback-text",children:h.text}),e.jsx("div",{style:{display:"flex",justifyContent:"flex-end",marginTop:"0.5rem"},children:e.jsxs("button",{onClick:V,className:"mrp-next-btn",style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:["Próxima ",e.jsx(le,{size:18})]})})]})]}),e.jsx(Ce,{children:$&&e.jsx(Ee.div,{initial:{opacity:0,y:50,scale:.9},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:50,scale:.9},className:"mrp-sensei-alert-overlay",children:e.jsx("div",{className:"mrp-sensei-alert-card",children:e.jsxs("div",{className:"mrp-sensei-alert-header",children:[e.jsxs("div",{className:"mrp-sensei-avatar-ring",children:[e.jsx("img",{src:d?.avatar_url||"/assets/avatars/default-sensei.png",alt:"Sensei",className:"mrp-sensei-alert-img"}),e.jsx("div",{className:"mrp-sensei-alert-badge",children:e.jsx(ze,{size:14})})]}),e.jsxs("div",{className:"mrp-sensei-alert-bubble",children:[e.jsxs("span",{className:"mrp-sensei-alert-name",children:[d?.full_name||"Sensei"," diz:"]}),e.jsx("p",{className:"mrp-sensei-alert-text",children:$})]})]})})})}),e.jsxs("div",{className:"mrp-game-footer",children:[e.jsxs("span",{children:["Valendo: ",e.jsxs("strong",{children:[I," pts"]})]}),e.jsxs("span",{children:["Level: ",e.jsx("strong",{children:l.level})]})]}),e.jsx("style",{children:`
        .mrp-game-wrapper { display: flex; flex-direction: column; gap: 1rem; max-width: 700px; width: 100%; margin: 0 auto; }
        .mrp-game-header { display: flex; align-items: center; justify-content: space-between; }
        .mrp-game-progress-meta { display: flex; align-items: center; gap: 0.625rem; }
        .mrp-game-progress-label { font-family: var(--font-inter); font-size: 0.85rem; color: var(--color-slate-mid); }
        .mrp-game-progress-label strong { color: var(--color-slate-dark); }
        .mrp-level-tag {
          background: rgba(88,49,126,0.1);
          color: var(--color-brand);
          border: 1px solid rgba(88,49,126,0.2);
          border-radius: 999px;
          padding: 0.15rem 0.6rem;
          font-family: var(--font-outfit);
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.06em;
        }
        .mrp-game-score-display { display: flex; align-items: baseline; gap: 0.25rem; }
        .mrp-game-score-num { font-family: var(--font-outfit); font-size: 1.75rem; font-weight: 900; color: var(--color-action); }
        .mrp-game-score-max { font-family: var(--font-inter); font-size: 0.8rem; color: var(--color-slate-mid); }
        .mrp-progress-bar-track {
          height: 5px;
          background: var(--color-slate-border);
          border-radius: 999px;
          overflow: hidden;
        }
        .mrp-progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-brand), var(--color-action));
          border-radius: 999px;
          transition: width 0.4s ease;
        }
        .mrp-card {
          background: white;
          border: 1.5px solid var(--color-slate-border);
          border-radius: 1.25rem;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          box-shadow: 0 2px 16px rgba(30,41,59,0.06);
        }
        @media (max-width: 600px) {
          .mrp-card { padding: 1rem; gap: 1rem; }
          .mrp-game-score-num { font-size: 1.5rem; }
          .mrp-scenario-text, .mrp-task-text { font-size: 0.95rem; }
        }
        .mrp-scenario-block, .mrp-task-block { display: flex; align-items: flex-start; gap: 0.875rem; }
        .mrp-scenario-icon {
          width: 40px; height: 40px; border-radius: 0.75rem; flex-shrink: 0;
          background: rgba(88,49,126,0.08); color: var(--color-brand);
          display: flex; align-items: center; justify-content: center;
        }
        .mrp-task-icon {
          width: 40px; height: 40px; border-radius: 0.75rem; flex-shrink: 0;
          background: rgba(255,127,50,0.08); color: var(--color-action);
          display: flex; align-items: center; justify-content: center;
        }
        .mrp-scenario-eyebrow, .mrp-task-eyebrow {
          display: block;
          font-family: var(--font-inter);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }
        .mrp-scenario-eyebrow { color: var(--color-brand); }
        .mrp-task-eyebrow { color: var(--color-action); }
        .mrp-scenario-text, .mrp-task-text {
          font-family: var(--font-inter);
          font-size: 1rem;
          color: var(--color-slate-dark);
          margin: 0;
          line-height: 1.55;
        }
        .mrp-task-text { font-style: italic; }
        .mrp-answer-zone { display: flex; flex-direction: column; gap: 1rem; }
        .mrp-options-grid-game { display: grid; grid-template-columns: 1fr 1fr; gap: 0.625rem; }
        @media (max-width: 500px) { .mrp-options-grid-game { grid-template-columns: 1fr; } }
        .mrp-option-btn {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: var(--color-ice);
          border: 1.5px solid var(--color-slate-border);
          border-radius: 0.875rem;
          cursor: pointer;
          text-align: left;
          transition: border-color 150ms, background 150ms, transform 100ms;
        }
        .mrp-option-btn:hover:not(:disabled) {
          border-color: var(--color-brand);
          background: rgba(88,49,126,0.04);
          transform: translateY(-1px);
        }
        .mrp-option-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .mrp-option-letter {
          width: 30px; height: 30px; border-radius: 0.5rem; flex-shrink: 0;
          background: white; border: 1.5px solid var(--color-slate-border);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-outfit); font-size: 0.75rem; font-weight: 800;
          color: var(--color-slate-mid);
        }
        .mrp-option-text { font-family: var(--font-inter); font-size: 0.95rem; color: var(--color-slate-dark); line-height: 1.4; }
        .mrp-discursive-zone { display: flex; flex-direction: column; gap: 0.75rem; }
        .mrp-disc-textarea {
          width: 100%; box-sizing: border-box;
          border: 1.5px solid var(--color-slate-border); border-radius: 0.75rem;
          padding: 0.875rem 1rem;
          font-family: var(--font-inter); font-size: 1rem; color: var(--color-slate-dark);
          background: var(--color-ice);
          resize: vertical; outline: none;
          transition: border-color 150ms, box-shadow 150ms;
        }
        .mrp-disc-textarea:focus { border-color: var(--color-brand); box-shadow: 0 0 0 3px rgba(88,49,126,0.12); }
        .mrp-disc-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
          padding: 0.75rem 1.5rem;
          background: var(--color-brand); color: white;
          border: none; border-radius: 0.75rem;
          font-family: var(--font-outfit); font-size: 0.95rem; font-weight: 700;
          cursor: pointer; transition: background 150ms;
        }
        .mrp-disc-btn:hover:not(:disabled) { background: #4C2A6D; }
        .mrp-disc-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .mrp-spin-inline { animation: mrp-spin 0.7s linear infinite; }
        @keyframes mrp-spin { to { transform: rotate(360deg); } }
        .mrp-hint-area { display: flex; justify-content: center; }
        .mrp-hint-trigger {
          display: flex; align-items: center; gap: 0.375rem;
          background: none; border: none; cursor: pointer;
          font-family: var(--font-inter); font-size: 0.8rem; color: var(--color-slate-mid);
          transition: color 150ms;
        }
        .mrp-hint-trigger:hover { color: var(--color-brand); }
        .mrp-hint-penalty { font-size: 0.72rem; opacity: 0.7; }
        .mrp-hint-box {
          display: flex; align-items: flex-start; gap: 0.625rem;
          background: rgba(255,127,50,0.06); border: 1px solid rgba(255,127,50,0.2);
          border-radius: 0.75rem; padding: 0.75rem 1rem; width: 100%;
        }
        .mrp-hint-icon { color: var(--color-action); flex-shrink: 0; margin-top: 1px; }
        .mrp-hint-text { font-family: var(--font-inter); font-size: 0.875rem; color: var(--color-slate-dark); margin: 0; font-style: italic; }
        .mrp-feedback-block {
          border-radius: 1rem; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;
          animation: mrp-slide-up 0.35s ease-out;
        }
        .mrp-feedback-block.correct { background: rgba(34,197,94,0.06); border: 1.5px solid rgba(34,197,94,0.25); }
        .mrp-feedback-block.incorrect { background: rgba(239,68,68,0.06); border: 1.5px solid rgba(239,68,68,0.25); }
        @keyframes mrp-slide-up { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .mrp-feedback-header { display: flex; align-items: center; gap: 0.5rem; }
        .mrp-feedback-icon.correct { color: #22c55e; }
        .mrp-feedback-icon.incorrect { color: #ef4444; }
        .mrp-feedback-label { font-family: var(--font-outfit); font-size: 1rem; font-weight: 800; }
        .mrp-feedback-label.correct { color: #16a34a; }
        .mrp-feedback-label.incorrect { color: #dc2626; }
        .mrp-feedback-points { margin-left: auto; font-family: var(--font-outfit); font-size: 0.85rem; font-weight: 700; color: var(--color-action); }
        .mrp-feedback-text { font-family: var(--font-inter); font-size: 0.875rem; color: var(--color-slate-dark); margin: 0; line-height: 1.6; white-space: pre-line; }
        .mrp-next-btn {
          padding: 0.75rem 1.5rem;
          background: var(--color-slate-dark); color: white;
          border: none; border-radius: 0.75rem;
          font-family: var(--font-outfit); font-size: 0.9rem; font-weight: 700;
          cursor: pointer; transition: background 150ms;
        }
        .mrp-next-btn:hover { background: #0f172a; }
        .mrp-game-footer {
          display: flex; justify-content: space-between;
          font-family: var(--font-inter); font-size: 0.75rem; color: var(--color-slate-mid);
          padding: 0 0.25rem;
        }
        .mrp-game-footer strong { color: var(--color-slate-dark); }

        .mrp-comparison-view { display: flex; flex-direction: column; gap: 1rem; animation: fade-in 0.3s ease; }
        .mrp-comparison-row { display: flex; flex-direction: column; gap: 0.4rem; }
        .mrp-comp-label { font-size: 0.75rem; font-weight: 700; color: var(--color-slate-mid); text-transform: uppercase; letter-spacing: 0.05em; }
        .mrp-comp-val { margin: 0; padding: 0.875rem; border-radius: 0.875rem; font-family: var(--font-inter); font-size: 1rem; line-height: 1.5; }
        .mrp-comp-val.student { background: var(--color-ice); border: 1.5px solid var(--color-slate-border); color: var(--color-slate-dark); }
        .mrp-comp-val.sensei { background: rgba(88,49,126,0.05); border: 1.5px dashed var(--color-brand); color: var(--color-brand); font-weight: 600; }
        
        .mrp-self-assess-actions { 
            margin-top: 1rem; padding-top: 1.25rem; border-top: 1px solid var(--color-slate-border);
            display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
        }
        .mrp-self-assess-invite { font-family: var(--font-outfit); font-size: 0.95rem; font-weight: 700; color: var(--color-slate-dark); margin: 0; }
        .mrp-self-assess-btns { display: flex; gap: 0.75rem; width: 100%; }
        .mrp-assess-btn {
            flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
            padding: 0.8rem; border-radius: 0.75rem; border: none; font-family: var(--font-outfit); font-weight: 700; cursor: pointer; transition: transform 0.2s, filter 0.2s;
        }
        .mrp-assess-btn.red { background: #fee2e2; color: #dc2626; border: 1.5px solid #fecaca; }
        .mrp-assess-btn.green { background: #dcfce7; color: #16a34a; border: 1.5px solid #bbf7d0; }
        .mrp-assess-btn:hover { transform: scale(1.02); filter: brightness(1.05); }

        .mrp-sensei-alert-overlay {
            position: fixed; bottom: 2rem; right: 2rem; z-index: 1000;
            max-width: 320px; width: calc(100% - 4rem);
        }
        .mrp-sensei-alert-card {
            background: white; padding: 1rem; border-radius: 1.5rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15); border: 2px solid var(--color-brand);
        }
        .mrp-sensei-alert-header { display: flex; align-items: center; gap: 1rem; }
        .mrp-sensei-avatar-ring { position: relative; width: 60px; height: 60px; flex-shrink: 0; }
        .mrp-sensei-alert-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-brand); }
        .mrp-sensei-alert-badge {
            position: absolute; bottom: 0; right: 0; 
            background: #ef4444; color: white; width: 22px; height: 22px;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            border: 2px solid white;
        }
        .mrp-sensei-alert-bubble { flex: 1; }
        .mrp-sensei-alert-name { display: block; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--color-slate-mid); margin-bottom: 0.1rem; }
        .mrp-sensei-alert-text { margin: 0; font-family: var(--font-inter); font-size: 0.8rem; color: var(--color-slate-dark); line-height: 1.4; font-weight: 600; }
      `})]})},ne=[{min:90,label:"⛩️ Sensei",color:"#d97706",bg:"rgba(217,119,6,0.08)",border:"rgba(217,119,6,0.2)"},{min:70,label:"🌸 Avançado",color:"#16a34a",bg:"rgba(22,163,74,0.08)",border:"rgba(22,163,74,0.2)"},{min:50,label:"📚 Esforçado",color:"#2563eb",bg:"rgba(37,99,235,0.08)",border:"rgba(37,99,235,0.2)"},{min:0,label:"🌱 Iniciante",color:"#dc2626",bg:"rgba(220,38,38,0.08)",border:"rgba(220,38,38,0.2)"}],He=({config:t,questions:m,answers:i,onRestart:f,onSave:d,isSaving:x,initialTitle:z,hideActions:S,rewards:g,senseiWhatsapp:s})=>{const p=i.reduce((n,h)=>n+h.scoreEarned,0),o=m.reduce((n,h)=>n+h.points,0),k=i.filter(n=>n.isCorrect).length,b=i.filter(n=>n.usedHint).length,y=o>0?Math.round(p/o*100):0,a=r.useMemo(()=>ne.find(n=>y>=n.min)??ne[3],[y]);return e.jsxs("div",{className:"mrp-result-wrapper",children:[e.jsxs("div",{className:"mrp-result-header",children:[e.jsx("h2",{className:"mrp-result-title",children:"Relatório de Desempenho"}),e.jsx("p",{className:"mrp-result-subtitle",children:"Treinamento concluído — confira seu resultado abaixo."})]}),e.jsxs("div",{className:"mrp-rank-banner",style:{background:a.bg,borderColor:a.border},children:[e.jsx(Ae,{size:28,style:{color:a.color,flexShrink:0}}),e.jsxs("div",{children:[e.jsx("p",{className:"mrp-rank-eyebrow",children:"Ranking IA"}),e.jsx("p",{className:"mrp-rank-label",style:{color:a.color},children:a.label})]}),e.jsxs("div",{className:"mrp-rank-pct",style:{color:a.color},children:[y,"%"]})]}),e.jsxs("div",{className:"mrp-stats-grid",children:[e.jsxs("div",{className:"mrp-stat-card",children:[e.jsx(Ie,{size:20,className:"mrp-stat-icon brand"}),e.jsx("p",{className:"mrp-stat-value brand",children:p}),e.jsx("p",{className:"mrp-stat-label",children:"Score Total"}),e.jsxs("p",{className:"mrp-stat-sub",children:["de ",o," pts"]})]}),e.jsxs("div",{className:"mrp-stat-card",children:[e.jsx(H,{size:20,className:"mrp-stat-icon action"}),e.jsx("p",{className:"mrp-stat-value action",children:k}),e.jsx("p",{className:"mrp-stat-label",children:"Corretas"}),e.jsxs("p",{className:"mrp-stat-sub",children:["de ",m.length," questões"]})]}),e.jsxs("div",{className:"mrp-stat-card",children:[e.jsx(ae,{size:20,className:"mrp-stat-icon hint"}),e.jsx("p",{className:"mrp-stat-value hint",children:b}),e.jsx("p",{className:"mrp-stat-label",children:"Dicas usadas"}),e.jsx("p",{className:"mrp-stat-sub",children:"com penalidade"})]}),g&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"mrp-stat-card",style:{background:"rgba(245,158,11,0.05)",borderColor:"rgba(245,158,11,0.2)"},children:[e.jsx("div",{style:{color:"#d97706",fontSize:"0.75rem",fontWeight:800,marginBottom:"0.25rem"},children:"COINS"}),e.jsxs("p",{style:{fontFamily:"var(--font-outfit)",fontSize:"2rem",fontWeight:900,color:"#d97706",margin:0},children:["+",g.coinsGain]}),e.jsx("p",{style:{fontSize:"0.65rem",fontWeight:700,color:"#92400e",margin:0},children:"Destrave Coins"})]}),e.jsxs("div",{className:"mrp-stat-card",style:{background:"rgba(79,70,229,0.05)",borderColor:"rgba(79,70,229,0.2)"},children:[e.jsx("div",{style:{color:"#4f46e5",fontSize:"0.75rem",fontWeight:800,marginBottom:"0.25rem"},children:"XP"}),e.jsxs("p",{style:{fontFamily:"var(--font-outfit)",fontSize:"2rem",fontWeight:900,color:"#4f46e5",margin:0},children:["+",g.xpGain]}),e.jsx("p",{style:{fontSize:"0.65rem",fontWeight:700,color:"#3730a3",margin:0},children:"Experiência"})]})]})]}),e.jsxs("div",{className:"mrp-review-section",children:[e.jsx("h3",{className:"mrp-review-title",children:"Revisão Detalhada"}),e.jsx("div",{className:"mrp-review-list",children:m.map((n,h)=>{const w=i.find(L=>L.questionId===n.id);return e.jsxs("div",{className:`mrp-review-item ${w?.isCorrect?"correct":"incorrect"}`,children:[e.jsx("div",{className:`mrp-review-num ${w?.isCorrect?"correct":"incorrect"}`,children:w?.isCorrect?e.jsx(H,{size:16}):e.jsx(re,{size:16})}),e.jsxs("div",{className:"mrp-review-content",children:[e.jsx("p",{className:"mrp-review-scenario",children:n.scenario}),e.jsxs("div",{className:"mrp-review-meta",children:[e.jsx("span",{className:"mrp-review-tag",children:n.level}),e.jsxs("span",{children:[w?.scoreEarned??0," pts"]}),w?.usedHint&&e.jsx("span",{className:"mrp-review-hint-badge",children:"Dica"})]})]})]},h)})})]}),S?e.jsxs("div",{className:"bg-white rounded-3xl border border-slate-border p-8 text-center shadow-lg",style:{width:"100%",marginTop:"1rem"},children:[e.jsx("div",{className:"w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4",children:e.jsx(H,{size:32,className:"text-brand"})}),e.jsx("h1",{className:"font-outfit text-2xl font-extrabold text-slate-dark mb-2",children:"Role Play Concluído! 🎭"}),e.jsxs("p",{className:"text-slate-mid mb-2 px-4",children:["Você atingiu ",e.jsxs("strong",{className:"text-slate-dark",children:[y,"%"]})," de desempenho — Rank: ",e.jsx("strong",{className:"text-slate-dark",children:a.label})]}),s?e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"text-slate-mid mb-5 px-4 text-sm",children:"Gostou do desafio? Clique abaixo para contar como foi para o Sensei!"}),e.jsx("a",{href:`/api/contact/sensei?teacherId=${s}&text=${encodeURIComponent(`Oi Sensei! Acabei de completar o Role Play e atingi ${y}% de desempenho (${a.label}). Quero saber mais sobre as aulas! 🎭`)}`,target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-outfit font-bold text-white text-base transition-all hover:-translate-y-0.5",style:{background:"#25D366",boxShadow:"0 4px 14px rgba(37,211,102,0.35)",textDecoration:"none"},children:"💬 Falar com o Sensei no WhatsApp"})]}):e.jsx("p",{className:"text-slate-mid mt-4 px-4 text-sm",children:"Seus resultados foram registrados. O Sensei entrará em contato em breve!"})]}):e.jsxs("div",{className:"mrp-result-actions",children:[e.jsxs("button",{onClick:f,className:"mrp-restart-btn flex-1",children:[e.jsx(je,{size:16}),"Novo Treinamento"]}),d&&e.jsxs("button",{onClick:()=>d(z||"Novo Role Play"),disabled:x,className:"mrp-save-btn flex-1",children:[x?e.jsx(te,{size:16,className:"animate-spin"}):e.jsx(ce,{size:16}),"Salvar na Central"]})]}),e.jsx("style",{children:`
        .mrp-result-wrapper { display: flex; flex-direction: column; gap: 1.5rem; max-width: 680px; width: 100%; margin: 0 auto; }
        .mrp-result-header { display: flex; flex-direction: column; gap: 0.25rem; }
        .mrp-result-title {
          font-family: var(--font-outfit); font-size: 1.75rem; font-weight: 900;
          color: var(--color-slate-dark); margin: 0;
        }
        .mrp-result-subtitle { font-family: var(--font-inter); font-size: 0.9rem; color: var(--color-slate-mid); margin: 0; }
        .mrp-rank-banner {
          display: flex; align-items: center; gap: 1rem;
          border: 1.5px solid; border-radius: 1rem; padding: 1.25rem 1.5rem;
        }
        .mrp-rank-eyebrow { font-family: var(--font-inter); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-slate-mid); margin: 0; }
        .mrp-rank-label { font-family: var(--font-outfit); font-size: 1.375rem; font-weight: 900; margin: 0.125rem 0 0; }
        .mrp-rank-pct { font-family: var(--font-outfit); font-size: 2.5rem; font-weight: 900; margin-left: auto; }
        @media (max-width: 500px) {
          .mrp-rank-banner { padding: 1rem; gap: 0.75rem; }
          .mrp-rank-label { font-size: 1.1rem; }
          .mrp-rank-pct { font-size: 1.75rem; }
        }
        .mrp-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.875rem; }
        @media (max-width: 500px) { .mrp-stats-grid { grid-template-columns: 1fr; } }
        .mrp-stat-card {
          background: white; border: 1.5px solid var(--color-slate-border);
          border-radius: 1rem; padding: 1.125rem 1rem; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
        }
        .mrp-stat-icon { margin-bottom: 0.25rem; }
        .mrp-stat-icon.brand { color: var(--color-brand); }
        .mrp-stat-icon.action { color: var(--color-action); }
        .mrp-stat-icon.hint { color: #d97706; }
        .mrp-stat-value { font-family: var(--font-outfit); font-size: 2rem; font-weight: 900; margin: 0; }
        .mrp-stat-value.brand { color: var(--color-brand); }
        .mrp-stat-value.action { color: var(--color-action); }
        .mrp-stat-value.hint { color: #d97706; }
        .mrp-stat-label { font-family: var(--font-inter); font-size: 0.8rem; font-weight: 700; color: var(--color-slate-dark); margin: 0; }
        .mrp-stat-sub { font-family: var(--font-inter); font-size: 0.72rem; color: var(--color-slate-mid); margin: 0; }
        .mrp-review-section { display: flex; flex-direction: column; gap: 0.75rem; }
        .mrp-review-title { font-family: var(--font-outfit); font-size: 1rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
        .mrp-review-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .mrp-review-item {
          display: flex; align-items: flex-start; gap: 0.75rem;
          padding: 0.75rem 1rem; border-radius: 0.75rem;
          border: 1.5px solid;
          transition: transform 100ms;
        }
        .mrp-review-item:hover { transform: translateX(2px); }
        .mrp-review-item.correct { background: rgba(34,197,94,0.04); border-color: rgba(34,197,94,0.2); }
        .mrp-review-item.incorrect { background: rgba(239,68,68,0.04); border-color: rgba(239,68,68,0.15); }
        .mrp-review-num { width: 28px; height: 28px; border-radius: 0.5rem; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .mrp-review-num.correct { background: rgba(34,197,94,0.15); color: #16a34a; }
        .mrp-review-num.incorrect { background: rgba(239,68,68,0.15); color: #dc2626; }
        .mrp-review-content { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; min-width: 0; }
        .mrp-review-scenario { font-family: var(--font-inter); font-size: 0.875rem; color: var(--color-slate-dark); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mrp-review-meta { display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-inter); font-size: 0.72rem; color: var(--color-slate-mid); }
        .mrp-review-tag {
          background: rgba(88,49,126,0.1); color: var(--color-brand);
          border-radius: 999px; padding: 0.1rem 0.45rem;
          font-weight: 700; font-size: 0.65rem; letter-spacing: 0.04em;
        }
        .mrp-review-hint-badge {
          background: rgba(255,127,50,0.1); color: var(--color-action);
          border-radius: 999px; padding: 0.1rem 0.45rem;
          font-weight: 700; font-size: 0.65rem;
        }
        .mrp-result-actions { display: flex; gap: 1rem; width: 100%; }
        .mrp-restart-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: var(--color-brand); color: white;
          border: none; border-radius: 0.875rem;
          font-family: var(--font-outfit); font-size: 1rem; font-weight: 800;
          cursor: pointer; transition: background 150ms, box-shadow 150ms, transform 100ms;
          box-shadow: 0 4px 16px rgba(88,49,126,0.25);
        }
        .mrp-restart-btn:hover { background: #4C2A6D; box-shadow: 0 6px 24px rgba(88,49,126,0.35); transform: translateY(-1px); }
        
        .mrp-save-btn {
            display: flex; align-items: center; justify-content: center; gap: 0.5rem;
            padding: 0.875rem 1.5rem;
            background: white; border: 2px solid var(--color-brand); color: var(--color-brand);
            border-radius: 0.875rem;
            font-family: var(--font-outfit); font-size: 1rem; font-weight: 800;
            cursor: pointer; transition: all 150ms;
        }
        .mrp-save-btn:hover:not(:disabled) { background: var(--color-ice); transform: translateY(-1px); }
        .mrp-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `})]})},fr=({userToken:t,assignmentId:m,editingId:i,initialConfig:f,initialQuestions:d,initialTitle:x,publicAccess:z,activityId:S,senseiWhatsapp:g})=>{const[s,p]=r.useState(d?i?"REVIEW":"PLAYING":"CONFIG"),[o,k]=r.useState(f||null),[b,y]=r.useState(d||[]),[a,n]=r.useState([]),[h,w]=r.useState(null),[L,F]=r.useState(!1),[$,_]=r.useState(!1),[l,Q]=r.useState(null),[J,I]=r.useState(!1),[K,V]=r.useState("idle"),[q,B]=r.useState(null),[c,j]=r.useState("/assets/avatars/tanuki-novato.png"),[M,E]=r.useState(null),[C,me]=r.useState(null);ee.useEffect(()=>{U.auth.getSession().then(({data:{session:u}})=>{u&&U.from("profiles").select("equipped").eq("id",u.user.id).single().then(({data:v})=>{const N=v?.equipped;if(N?.avatar){E(N.avatar);const R=ge.find(G=>G.id===N.avatar);R?.previewUrl&&j(R.previewUrl)}})}),g&&U.from("profiles").select("full_name, avatar_url").eq("id",g).single().then(({data:u})=>{u&&me(u)})},[g]);const de=(u,v)=>{V(u),v&&B(ue(M||null,v)),setTimeout(()=>{V("idle"),B(null)},2e3)};ee.useEffect(()=>{!i&&d&&d.length>0&&(y(d),k(f||null),p("PLAYING"))},[d,f,i]);const pe=async u=>{k(u),w(null),F(!0),p("LOADING");try{const v=await fetch("/api/mrp/generate-questions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)}),N=await v.json();if(!v.ok)throw new Error(N.error||"Erro ao gerar questões.");if(!N.questions||N.questions.length===0)throw new Error("A IA não conseguiu gerar questões com esse texto. Tente um conteúdo diferente.");y(N.questions),n([]),p("REVIEW")}catch(v){console.error("[MRP Generate Error]",v),w(v.message??"Erro inesperado."),p("CONFIG")}finally{F(!1)}},oe=async u=>{if(!(!b.length||!o)){_(!0),w(null);try{const{data:{session:v}}=await U.auth.getSession(),N=v?.access_token;if(!N)throw new Error("Não autenticado. Por favor, faça login novamente.");const P=await fetch(i?"/api/activities/update":"/api/activities/save",{method:i?"PUT":"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${N}`},body:JSON.stringify({id:i,title:u,type:"mrp",config:{...o,questions:b}})}),Z=await P.json();if(!P.ok)throw new Error(Z.error||"Erro ao salvar missão.");p("SAVED")}catch(v){console.error("[MRP Save Error]",v),alert(`Erro ao salvar: ${v.message}`)}finally{_(!1)}}},fe=async u=>{n(u),p("RESULTS");const{data:{session:v}}=await U.auth.getSession(),N=v?.access_token||t;if(N&&o){const R=u.reduce((A,D)=>A+D.scoreEarned,0),G=b.reduce((A,D)=>A+D.points,0),P=G>0?Math.round(R/G*100):0,Z=P>=90?"Sensei":P>=70?"Avançado":P>=50?"Esforçado":"Iniciante";fetch(m?"/api/missions/save-result":"/api/mrp/save-result",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${N}`},body:JSON.stringify({assignmentId:m,config:o,answers:u,score:R,totalQuestions:b.length,percentage:P,rankLabel:Z,history:u,title:x||"Missão Role Play"})}).then(async A=>{if(A.ok){const D=await A.json();D.rewards&&Q(D.rewards)}}).catch(A=>console.error("[MrpApp] Error saving:",A))}},Y=()=>{p("CONFIG"),y([]),n([]),k(null),w(null)};return s==="LOADING"?e.jsx(ye,{title:"Criando Cenário de Role Play",Icon:$e,type:"pulse",messages:["Invocando os personagens do Sensei...","Sintonizando os diálogos adaptados...","Preparando os gatilhos culturais...","Quase lá! Polindo a gramática..."]}):h?e.jsxs("div",{className:"mrp-error-screen",children:[e.jsx(be,{size:36,className:"mrp-error-icon"}),e.jsx("h3",{className:"mrp-error-title",children:"Algo deu errado"}),e.jsx("p",{className:"mrp-error-msg",children:h}),e.jsx("button",{onClick:Y,className:"mrp-error-btn",children:"Tentar novamente"})]}):e.jsxs("div",{className:"mrp-app-host",children:[e.jsxs(Se,{allowedRole:"teacher",bypassIfAssignmentId:m,publicAccess:z,children:[s==="CONFIG"&&e.jsx(_e,{onSubmit:pe,isLoading:L}),s==="REVIEW"&&o&&e.jsx(Be,{questions:b,config:o,onSave:oe,onStartGame:()=>p("PLAYING"),onCancel:Y,isSaving:$,initialTitle:x}),s==="PLAYING"&&o&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-4",children:[e.jsxs("a",{href:"/dashboard",className:"inline-flex items-center gap-2 text-slate-mid hover:text-brand transition-colors font-outfit font-bold group",children:[e.jsx(Me,{size:20,className:"group-hover:-translate-x-1 transition-transform"}),"Sair da Missão"]}),e.jsxs("button",{onClick:()=>I(!0),className:"flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-border rounded-xl font-outfit font-bold text-slate-dark hover:bg-ice transition-all shadow-sm group",children:[e.jsx(Pe,{size:18,className:"text-brand group-hover:scale-110 transition-transform"}),e.jsx("span",{children:"Materiais"})]})]}),e.jsx(Ue,{questions:b,mode:o.mode,onComplete:fe,onTriggerBuddy:de,senseiProfile:C}),e.jsx(xe,{avatarUrl:c,avatarId:M,state:K,message:q}),e.jsx(he,{isOpen:J,onClose:()=>I(!1),activityId:S})]}),s==="RESULTS"&&o&&e.jsx(He,{config:o,questions:b,answers:a,onRestart:Y,onSave:!m&&!z?oe:void 0,isSaving:$,hideActions:!!m,rewards:l,senseiWhatsapp:g}),s==="SAVED"&&e.jsxs("div",{className:"mrp-success-state",children:[e.jsx("div",{className:"mrp-success-icon-bg",children:e.jsx(we,{size:40,className:"text-white"})}),e.jsx("h2",{children:"Missão Salva!"}),e.jsx("p",{children:"O mini role play foi adicionado à sua biblioteca. Você já pode atribuir esta atividade aos seus alunos na Central."}),e.jsxs("div",{className:"mrp-success-actions",children:[e.jsx("button",{onClick:Y,className:"mrp-btn-again",children:"Criar Outro MRP"}),e.jsx("a",{href:"/dashboard/activities",className:"mrp-btn-view",children:"Ir para Central"})]})]})]}),e.jsx("style",{children:`
                .mrp-app-host { width: 100%; padding-bottom: 4rem; }
                .mrp-loading-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 5rem 1rem; text-align: center; }
                .mrp-loading-spin { color: var(--color-brand); animation: mrp-spin 0.8s linear infinite; }
                @keyframes mrp-spin { to { transform: rotate(360deg); } }
                .mrp-loading-label { font-family: var(--font-outfit); font-size: 1.1rem; font-weight: 700; color: var(--color-slate-dark); margin: 0; }
                .mrp-loading-sub { font-family: var(--font-inter); font-size: 0.85rem; color: var(--color-slate-mid); margin: 0; }
                .mrp-error-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 4rem 1rem; text-align: center; max-width: 400px; margin: 0 auto; }
                .mrp-error-icon { color: var(--color-action); }
                .mrp-error-title { font-family: var(--font-outfit); font-size: 1.25rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
                .mrp-error-msg { font-family: var(--font-inter); font-size: 0.875rem; color: var(--color-slate-mid); margin: 0; }
                .mrp-error-btn { margin-top: 0.5rem; padding: 0.7rem 1.75rem; border: 1.5px solid var(--color-slate-border); border-radius: 0.75rem; background: none; font-family: var(--font-outfit); font-weight: 700; font-size: 0.9rem; color: var(--color-slate-dark); cursor: pointer; transition: background 150ms; }
                .mrp-error-btn:hover { background: var(--color-ice); }

                .mrp-success-state {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    padding: 5rem 1.5rem; text-align: center; gap: 1rem;
                    background: white; border-radius: 2rem; border: 1.5px solid var(--color-slate-border);
                    max-width: 600px; margin: 2rem auto; box-shadow: 0 10px 40px -10px rgba(88,49,126,0.1);
                    animation: fade-in 0.5s ease;
                }
                .mrp-success-icon-bg {
                    width: 80px; height: 80px; border-radius: 2rem; background: #22c55e;
                    display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;
                    box-shadow: 0 8px 25px rgba(34,197,94,0.3);
                }
                .mrp-success-state h2 { font-family: var(--font-outfit); font-size: 2rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
                .mrp-success-state p { font-size: 1rem; color: var(--color-slate-mid); max-width: 400px; line-height: 1.6; }
                .mrp-success-actions { display: flex; gap: 1rem; margin-top: 2rem; }
                .mrp-btn-again { padding: 0.9rem 1.5rem; border-radius: 1rem; border: 1.5px solid var(--color-slate-border); background: white; font-family: var(--font-outfit); font-weight: 700; color: var(--color-slate-dark); cursor: pointer; transition: all 150ms; }
                .mrp-btn-view { padding: 0.9rem 1.75rem; border-radius: 1rem; border: none; background: var(--color-brand); color: white; font-family: var(--font-outfit); font-weight: 800; text-decoration: none; display: flex; align-items: center; gap: 0.6rem; transition: transform 150ms; }
                .mrp-btn-view:hover { transform: scale(1.05); filter: brightness(1.1); }
            `})]})};export{fr as MrpApp};
