import{j as e}from"./jsx-runtime.u17CrQMm.js";import{r as s}from"./index.DrBtkhmp.js";import{P as O,A as L,C as B}from"./AdvancedLoading.BFuNHCun.js";import{s as F}from"./materials.astro_astro_type_script_index_0_lang.CbpkQ25P.js";import{S as M}from"./sparkles.C81tWaGI.js";import{T as V}from"./type.wDrmtEns.js";import{F as Y}from"./file-text.CiBs32nN.js";import{L as U}from"./loader-circle.CueQDEKg.js";import{C as $}from"./chevron-right.B5VOUX-2.js";import{C as q}from"./circle-check.CzS0XoDm.js";import{P as Q}from"./plus.BlVe5yMk.js";import{S as W,R as J}from"./RoleGuard.DA5ENlqy.js";import{P as X}from"./pen-line.DTdzF7jp.js";import{T as _}from"./trash-2.BQZtT8Af.js";import{CardViewer as H}from"./CardViewer.BsF3pxNk.js";import{R as K}from"./ResultScreen.BnaxJ7wd.js";import{M as Z}from"./MaterialsDrawer.BNk60Hca.js";import{L as ee}from"./layers.E8oGsr1D.js";import{A as ae}from"./arrow-left.Cf3uhIgY.js";import{B as re}from"./book-open.BXHyXqCE.js";var w=(o=>(o.N5="N5",o.N4="N4",o.N3="N3",o))(w||{});const te=({onGenerate:o,isLoading:m})=>{const[p,h]=s.useState(""),[f,g]=s.useState(""),[d,n]=s.useState(null),[c,b]=s.useState(null),[v,a]=s.useState(w.N5),[t,x]=s.useState(15),j=r=>{if(r.preventDefault(),!p.trim())return alert("Dê um nome ao seu deck.");if(!d&&f.trim().length<20)return alert("Por favor, faça upload de um PDF ou insira um texto para gerar os cards.");o({title:p,context:f,pdfBase64:d||void 0,level:v,quantity:t})};return e.jsxs("div",{className:"flash-generator-container",children:[e.jsxs("div",{className:"flash-generator-card",children:[e.jsxs("div",{className:"text-center mb-10",children:[e.jsxs("div",{className:"inline-flex items-center gap-2 badge-brand mb-4",children:[e.jsx(M,{size:12}),"Destrave Cards IA"]}),e.jsxs("h1",{className:"font-outfit text-4xl font-extrabold text-slate-dark leading-tight",children:["Criação de ",e.jsx("span",{className:"text-brand",children:"Flashdecks"})," IA"]}),e.jsx("p",{className:"mt-3 text-slate-mid font-inter",children:"Seu material de aula vira cards interativos em segundos."})]}),e.jsxs("form",{onSubmit:j,className:"flash-form",children:[e.jsxs("div",{className:"flash-field mb-4",children:[e.jsxs("label",{className:"flash-label",children:[e.jsx(V,{size:14})," Nome da Atividade (Deck)"]}),e.jsx("input",{type:"text",value:p,onChange:r=>h(r.target.value),placeholder:"Ex: Vocabulário Aula 4 - Restaurante",className:"flash-input",required:!0})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2",children:[e.jsx(O,{onFileSelected:(r,N)=>{n(r),b(N)},currentFileName:c,description:"Use o PDF da sua aula como fonte"}),e.jsxs("div",{className:"p-4 border-2 border-slate-border border-dashed rounded-[1.5rem] bg-ice/30",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(Y,{size:14,className:"text-slate-mid"}),e.jsx("label",{className:"text-[0.65rem] font-bold text-slate-mid uppercase tracking-widest",children:"Texto Manual (Opcional)"})]}),e.jsx("textarea",{value:f,onChange:r=>g(r.target.value),placeholder:"Se não tiver PDF, cole aqui a lista de palavras ou frases da aula...",className:"flash-textarea min-h-[110px]"})]})]}),e.jsxs("div",{className:"flash-config-grid",children:[e.jsxs("div",{className:"flash-field",children:[e.jsx("label",{className:"flash-label",children:"Nível de Dificuldade"}),e.jsxs("select",{value:v,onChange:r=>a(r.target.value),className:"flash-select",children:[e.jsx("option",{value:w.N5,children:"N5 - Iniciante"}),e.jsx("option",{value:w.N4,children:"N4 - Intermediário"}),e.jsx("option",{value:w.N3,children:"N3 - Avançado"})]})]}),e.jsxs("div",{className:"flash-field",children:[e.jsx("label",{className:"flash-label",children:"Quantidade de Cards"}),e.jsx("div",{className:"flash-qty-selector",children:[10,15,20].map(r=>e.jsx("button",{type:"button",onClick:()=>x(r),className:`flash-qty-btn ${t===r?"active":""}`,children:r},r))})]})]}),e.jsx("button",{type:"submit",disabled:m,className:"btn-action w-full py-4 mt-6",children:m?e.jsxs(e.Fragment,{children:[e.jsx(U,{className:"animate-spin",size:20}),"Sintonizando IA..."]}):e.jsxs(e.Fragment,{children:["Gerar Deck com Gemini",e.jsx($,{size:18})]})})]})]}),e.jsx("style",{children:`
        .flash-generator-container {
          max-width: 720px;
          margin: 0 auto;
          width: 100%;
        }
        .flash-generator-card {
          background: white;
          border-radius: 1.5rem;
          border: 1.5px solid var(--color-slate-border);
          padding: 2.5rem;
          box-shadow: 0 10px 40px -10px rgba(30,41,59,0.08);
        }
        .flash-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .flash-label {
          font-family: var(--font-inter);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-slate-mid);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .flash-input, .flash-textarea, .flash-select {
          width: 100%;
          border: 1.5px solid var(--color-slate-border);
          border-radius: 0.75rem;
          padding: 0.875rem 1rem;
          font-family: var(--font-inter);
          font-size: 1rem;
          color: var(--color-slate-dark);
          transition: all 150ms ease;
          outline: none;
          box-sizing: border-box;
        }
        .flash-input:focus, .flash-textarea:focus, .flash-select:focus {
          border-color: var(--color-brand);
          box-shadow: 0 0 0 4px rgba(88,49,126,0.1);
        }
        .flash-config-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 1.25rem;
        }
        @media (max-width: 600px) {
          .flash-config-grid { grid-template-columns: 1fr; }
        }
        .flash-qty-selector {
          display: flex;
          gap: 0.5rem;
        }
        .flash-qty-btn {
          flex: 1;
          padding: 0.8rem;
          border-radius: 0.75rem;
          border: 1.5px solid var(--color-slate-border);
          background: white;
          font-family: var(--font-outfit);
          font-weight: 700;
          color: var(--color-slate-mid);
          cursor: pointer;
          transition: all 150ms ease;
        }
        .flash-qty-btn.active {
          background: var(--color-brand);
          color: white;
          border-color: var(--color-brand);
        }
      `})]})},se=({deck:o,onApprove:m,onCancel:p,isSaving:h})=>{const[f,g]=s.useState(o.cards),[d,n]=s.useState(null),c=(a,t)=>{g(x=>x.map(j=>j.id===a?{...j,...t}:j))},b=a=>{g(t=>t.filter(x=>x.id!==a))},v=()=>{const a={id:`manual-${Date.now()}`,front:"",reading:"",back:"",example:"",exampleTranslation:"",level:o.level};g(t=>[a,...t]),n(a.id)};return e.jsxs("div",{className:"review-studio-container",children:[e.jsxs("header",{className:"review-header",children:[e.jsxs("div",{className:"review-header-info",children:[e.jsx("span",{className:"review-badge",children:"Modo de Revisão"}),e.jsx("h2",{children:o.title}),e.jsxs("p",{children:[f.length," cards extraídos pela IA. Revise e aprove para seu aluno."]})]}),e.jsxs("div",{className:"review-actions",children:[e.jsx("button",{onClick:p,className:"btn-cancel",children:"Descartar"}),e.jsx("button",{onClick:()=>m({...o,cards:f}),disabled:h||f.length===0,className:"btn-approve",children:h?e.jsx("div",{className:"flash-spinner"}):e.jsxs(e.Fragment,{children:[e.jsx(q,{size:18})," Aprovar e Salvar"]})})]})]}),e.jsxs("div",{className:"review-grid",children:[e.jsxs("button",{className:"add-card-dash",onClick:v,children:[e.jsx(Q,{size:32}),e.jsx("span",{children:"Novo Card Manual"})]}),f.map(a=>e.jsx("div",{className:`card-editor ${d===a.id?"is-editing":""}`,children:d===a.id?e.jsxs("div",{className:"editor-fields",children:[e.jsx("input",{placeholder:"Frente (Japonês)",value:a.front,onChange:t=>c(a.id,{front:t.target.value})}),e.jsx("input",{placeholder:"Leitura (Hiragana)",value:a.reading,onChange:t=>c(a.id,{reading:t.target.value})}),e.jsx("input",{placeholder:"Verso (Português)",value:a.back,onChange:t=>c(a.id,{back:t.target.value})}),e.jsx("textarea",{placeholder:"Exemplo de frase...",value:a.example,onChange:t=>c(a.id,{example:t.target.value})}),e.jsxs("button",{className:"done-btn",onClick:()=>n(null),children:[e.jsx(W,{size:14})," Concluir Edição"]})]}):e.jsxs("div",{className:"card-preview",children:[e.jsxs("div",{className:"card-front-preview",children:[e.jsx("span",{className:"p-badge",children:"FRENTE"}),e.jsx("div",{className:"p-main",children:a.front}),e.jsxs("div",{className:"p-reading",children:["(",a.reading,")"]})]}),e.jsx("div",{className:"card-divider"}),e.jsxs("div",{className:"card-back-preview",children:[e.jsx("span",{className:"p-badge",children:"VERSO"}),e.jsx("div",{className:"p-meaning",children:a.back}),e.jsxs("div",{className:"p-example italic",children:['"',a.example,'"']})]}),e.jsxs("div",{className:"card-actions-hover",children:[e.jsx("button",{onClick:()=>n(a.id),className:"a-btn edit",children:e.jsx(X,{size:16})}),e.jsx("button",{onClick:()=>b(a.id),className:"a-btn del",children:e.jsx(_,{size:16})})]})]})},a.id))]}),e.jsx("style",{children:`
        .review-studio-container { width: 100%; animation: fade-in 0.4s ease-out; }
        .review-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: 2.5rem; gap: 2rem;
        }
        .review-badge {
          display: inline-block; padding: 0.25rem 0.75rem; border-radius: 999px;
          background: rgba(255,127,50,0.1); color: var(--color-action);
          font-family: var(--font-outfit); font-weight: 800; font-size: 0.7rem;
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem;
        }
        .review-header h2 { font-family: var(--font-outfit); font-size: 2rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
        .review-header p { font-size: 0.95rem; color: var(--color-slate-mid); margin: 0.25rem 0 0; }
        
        .review-actions { display: flex; gap: 1rem; }
        .btn-cancel {
          padding: 0.75rem 1.5rem; border-radius: 0.875rem; border: 1.5px solid var(--color-slate-border);
          background: white; font-family: var(--font-outfit); font-weight: 700; color: var(--color-slate-mid);
          cursor: pointer; transition: all 150ms;
        }
        .btn-cancel:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
        
        .btn-approve {
          padding: 0.75rem 1.75rem; border-radius: 0.875rem; border: none;
          background: var(--color-brand); color: white; font-family: var(--font-outfit); font-weight: 800;
          cursor: pointer; display: flex; align-items: center; gap: 0.75rem;
          transition: transform 150ms, filter 150ms;
          box-shadow: 0 4px 15px rgba(88,49,126,0.25);
        }
        .btn-approve:hover { filter: brightness(1.1); transform: translateY(-2px); }
        .btn-approve:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .review-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem; padding-bottom: 5rem;
        }
        
        .add-card-dash {
          height: 220px; border: 2.5px dashed var(--color-slate-border); border-radius: 1.25rem;
          background: transparent; color: var(--color-slate-mid); cursor: pointer;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 1rem; transition: all 150ms; font-family: var(--font-outfit); font-weight: 700;
        }
        .add-card-dash:hover { border-color: var(--color-brand); color: var(--color-brand); background: rgba(88,49,126,0.02); }

        .card-editor {
          height: 220px; background: white; border-radius: 1.25rem; border: 1.5px solid var(--color-slate-border);
          position: relative; transition: all 200ms ease; overflow: hidden;
        }
        .card-editor:hover { border-color: var(--color-brand); transform: translateY(-3px); box-shadow: 0 8px 30px rgba(30,41,59,0.08); }
        .card-editor.is-editing { height: auto; min-height: 220px; border-color: var(--color-brand); z-index: 10; }

        .card-preview { height: 100%; display: flex; flex-direction: column; padding: 1.25rem; }
        .p-badge { font-size: 0.6rem; font-weight: 900; color: var(--color-slate-border); letter-spacing: 0.1em; margin-bottom: 0.25rem; }
        .p-main { font-family: var(--font-outfit); font-size: 1.4rem; font-weight: 800; color: var(--color-slate-dark); }
        .p-reading { font-size: 0.85rem; color: var(--color-slate-mid); margin-top: -0.1rem; }
        .card-divider { height: 1.5px; background: var(--color-slate-border); margin: 1rem 0; width: 40px; }
        .p-meaning { font-weight: 700; color: var(--color-brand); font-size: 1.1rem; margin-bottom: 0.25rem; }
        .p-example { font-size: 0.75rem; color: var(--color-slate-mid); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        .card-actions-hover {
          position: absolute; top: 0.75rem; right: 0.75rem; display: flex; gap: 0.4rem;
          opacity: 0; transform: translateX(10px); transition: all 200ms;
        }
        .card-editor:hover .card-actions-hover { opacity: 1; transform: translateX(0); }
        .a-btn {
          width: 32px; height: 32px; border-radius: 0.625rem; border: none;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          transition: background 150ms;
        }
        .a-btn.edit { background: var(--color-ice); color: var(--color-slate-dark); }
        .a-btn.edit:hover { background: #e2e8f0; }
        .a-btn.del { background: #fef2f2; color: #dc2626; }
        .a-btn.del:hover { background: #fee2e2; }

        .editor-fields { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .editor-fields input, .editor-fields textarea {
          width: 100%; border: 1.5px solid var(--color-slate-border); border-radius: 0.5rem;
          padding: 0.5rem 0.75rem; font-family: var(--font-inter); font-size: 0.9rem; outline: none; box-sizing: border-box;
        }
        .editor-fields input:focus, .editor-fields textarea:focus { border-color: var(--color-brand); }
        .done-btn {
          background: var(--color-brand); color: white; border: none; border-radius: 0.5rem;
          padding: 0.6rem; font-family: var(--font-outfit); font-weight: 700; font-size: 0.8rem;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        }
        
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `})]})},Se=({userToken:o,assignmentId:m,editingId:p,initialDeck:h,publicAccess:f,initialTitle:g})=>{const[d,n]=s.useState(m&&h?"PLAYING":h?"REVIEW":"GENERATE"),[c,b]=s.useState(h||null),[v,a]=s.useState(!1),[t,x]=s.useState(!1),[j,r]=s.useState(null),[N,S]=s.useState(null),[C,E]=s.useState(null),[T,z]=s.useState(!1),G=async l=>{a(!0),n("LOADING"),r(null);try{const i=await fetch("/api/flashcards/generate-deck",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)}),u=await i.json();if(!i.ok)throw new Error(u.error||"Erro ao gerar deck.");b({title:l.title,level:l.level,cards:u.cards}),n("REVIEW")}catch(i){r(i.message),n("GENERATE")}finally{a(!1)}},P=async l=>{x(!0),r(null);try{const{data:{session:i}}=await F.auth.getSession(),u=i?.access_token||o;if(!u)throw new Error("Sessão expirada. Por favor, faça login novamente.");const R=await fetch(p?"/api/activities/update":"/api/activities/save",{method:p?"PUT":"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${u}`},body:JSON.stringify({id:p,title:l.title,type:"flashcards",config:l})}),I=await R.json();if(!R.ok)throw new Error(I.error||"Erro ao salvar atividade.");n("SAVED")}catch(i){console.error("[Flashcards Save Error]",i),r(i.message),alert(`Falha ao salvar: ${i.message}`)}finally{x(!1)}},D=async l=>{E(l),n("RESULT");try{const{data:{session:i}}=await F.auth.getSession(),u=i?.access_token||o;if(u&&m){const y=await fetch("/api/missions/save-result",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${u}`},body:JSON.stringify({assignmentId:m,score:l.score,totalQuestions:l.total,history:l.history,timeSpent:l.timeSpent,targetTime:l.targetTime,title:g||c?.title||"Missão de Flashcards"})});if(y.ok){const k=await y.json();k.rewards&&S(k.rewards)}}}catch(i){console.error("[Flashcards] Error saving result:",i)}},A=()=>{b(null),n("GENERATE"),r(null),S(null),E(null)};return e.jsxs("div",{className:"flash-app-host",children:[e.jsxs(J,{allowedRole:"teacher",bypassIfAssignmentId:m,publicAccess:f,children:[d==="GENERATE"&&e.jsx(te,{onGenerate:G,isLoading:v}),d==="LOADING"&&e.jsx(L,{title:"Construindo seu Deck",Icon:ee,type:"cards",messages:["Baralhando o conhecimento estratégico...","Sintonizando com o Gemini...","Extraindo vocabulário contextual...","Preparando algoritmos de repetição..."]}),d==="REVIEW"&&c&&e.jsx(se,{deck:c,onApprove:P,onCancel:A,isSaving:t}),d==="PLAYING"&&c&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-4 max-w-4xl mx-auto",children:[e.jsxs("a",{href:"/dashboard",className:"inline-flex items-center gap-2 text-slate-mid hover:text-brand transition-colors font-outfit font-bold group",children:[e.jsx(ae,{size:20,className:"group-hover:-translate-x-1 transition-transform"}),"Sair da Missão"]}),e.jsxs("button",{onClick:()=>z(!0),className:"flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-border rounded-xl font-outfit font-bold text-slate-dark hover:bg-ice transition-all shadow-sm group",children:[e.jsx(re,{size:18,className:"text-brand group-hover:scale-110 transition-transform"}),e.jsx("span",{children:"Materiais"})]})]}),e.jsx(H,{cards:c.cards,onFinish:D}),e.jsx(Z,{isOpen:T,onClose:()=>z(!1)})]}),d==="RESULT"&&C&&e.jsx(K,{result:C,onRestart:()=>n("PLAYING"),hideActions:!!m,rewards:N}),d==="SAVED"&&e.jsxs("div",{className:"flash-success-state",children:[e.jsx("div",{className:"success-icon-bg",children:e.jsx(B,{size:40,className:"text-white"})}),e.jsx("h2",{children:"Deck Pronto!"}),e.jsx("p",{children:"Seus cards foram sintonizados e salvos. Seu aluno já pode começar a prática SRS no portal dele."}),e.jsxs("div",{className:"success-actions",children:[e.jsx("button",{onClick:A,className:"btn-again",children:"Criar Outro Deck"}),e.jsx("a",{href:"/dashboard/activities",className:"btn-view",children:"Ir para Central de Atividades"})]})]})]}),e.jsx("style",{children:`
                .flash-app-host { padding: 1rem 0 4rem; width: 100%; }
                
                .flash-loading-state {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    padding: 6rem 1rem; text-align: center; gap: 1rem;
                }
                .flash-loading-state h3 { font-family: var(--font-outfit); font-size: 1.5rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
                .flash-loading-state p { font-size: 1rem; color: var(--color-slate-mid); max-width: 400px; line-height: 1.5; }

                .flash-success-state {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    padding: 5rem 1rem; text-align: center; gap: 1rem;
                    background: white; border-radius: 2rem; border: 1.5px solid var(--color-slate-border);
                    max-width: 600px; margin: 0 auto; box-shadow: 0 10px 40px -10px rgba(88,49,126,0.1);
                    animation: fade-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .success-icon-bg {
                    width: 80px; height: 80px; border-radius: 2rem; background: #22c55e;
                    display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;
                    box-shadow: 0 8px 25px rgba(34,197,94,0.3);
                }
                .flash-success-state h2 { font-family: var(--font-outfit); font-size: 2rem; font-weight: 800; color: var(--color-slate-dark); margin: 0; }
                .flash-success-state p { font-size: 1rem; color: var(--color-slate-mid); max-width: 450px; line-height: 1.6; }
                .success-actions { display: flex; gap: 1rem; margin-top: 2rem; }
                .btn-again {
                    padding: 0.875rem 1.5rem; border-radius: 1rem; border: 1.5px solid var(--color-slate-border);
                    background: white; font-family: var(--font-outfit); font-weight: 700; color: var(--color-slate-dark);
                    cursor: pointer; transition: all 150ms;
                }
                .btn-again:hover { background: var(--color-ice); border-color: var(--color-brand); color: var(--color-brand); }
                .btn-view {
                    padding: 0.875rem 1.5rem; border-radius: 1rem; border: none;
                    background: var(--color-brand); color: white; font-family: var(--font-outfit); font-weight: 800;
                    text-decoration: none; display: flex; align-items: center; gap: 0.5rem;
                    transition: transform 150ms;
                }
                .btn-view:hover { transform: scale(1.05); }

                @keyframes fade-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
            `})]})};export{Se as FlashcardsApp};
