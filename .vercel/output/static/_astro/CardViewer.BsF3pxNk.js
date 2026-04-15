import{j as e}from"./jsx-runtime.u17CrQMm.js";import{r as s}from"./index.DrBtkhmp.js";import{C as J,B as Q}from"./BuddyView.baO4iarD.js";import{s as M}from"./materials.astro_astro_type_script_index_0_lang.CbpkQ25P.js";import{S as Z}from"./store.BRx3I6wk.js";import{C as H,M as K,g as I}from"./MaterialsDrawer.BNk60Hca.js";import{T as W}from"./target.DQNRlkPP.js";import{C as w}from"./circle-check.CzS0XoDm.js";import{C as j}from"./clock.B6Naz5I-.js";import{R as X}from"./rocket.LcF0NtKe.js";import{T as ee}from"./trophy.31LVHM7q.js";import{Z as te,A as re}from"./zap.DHUuwei_.js";import{c as ae}from"./createLucideIcon.BukDFzw_.js";const se=[["path",{d:"M16.466 7.5C15.643 4.237 13.952 2 12 2 9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2",key:"10n0gc"}],["path",{d:"m15.194 13.707 3.814 1.86-1.86 3.814",key:"16shm9"}],["path",{d:"M19 15.57c-1.804.885-4.274 1.43-7 1.43-5.523 0-10-2.239-10-5s4.477-5 10-5c4.838 0 8.873 1.718 9.8 4",key:"1lxi77"}]],ie=ae("rotate-3d",se),ve=({cards:o,onFinish:N,senseiWhatsapp:k,activityId:$})=>{const[l,y]=s.useState("SETUP"),[m,E]=s.useState(0),[c,x]=s.useState(!1),[f,Y]=s.useState(0),[d,R]=s.useState(0),[P,L]=s.useState([]),[U,S]=s.useState(!1),[O,C]=s.useState("idle"),[q,z]=s.useState(null),[B,D]=s.useState("/assets/avatars/tanuki-novato.png"),[b,F]=s.useState(null);s.useEffect(()=>{M.auth.getSession().then(({data:{session:r}})=>{r&&M.from("profiles").select("equipped").eq("id",r.user.id).single().then(({data:t})=>{const a=t?.equipped;if(a?.avatar){F(a.avatar);const i=Z.find(T=>T.id===a.avatar);i?.previewUrl&&D(i.previewUrl)}})})},[]);const A=(r,t)=>{C(r),t&&z(t),setTimeout(()=>{C("idle"),z(null)},2e3)},[u,V]=s.useState(Math.ceil(o.length*.75)),[h,_]=s.useState("02:00"),n=o[m];s.useEffect(()=>{let r;return l==="PLAYING"&&(r=setInterval(()=>{R(t=>t+1)},1e3)),()=>clearInterval(r)},[l]),s.useEffect(()=>{const r=t=>{l==="PLAYING"&&(t.code==="Space"||t.code==="Enter"?(t.preventDefault(),x(a=>!a)):c&&(t.key==="1"||t.code==="ArrowLeft"?p("wrong"):(t.key==="2"||t.code==="ArrowRight")&&p("correct")))};return window.addEventListener("keydown",r),()=>window.removeEventListener("keydown",r)},[c,l,m]);const p=r=>{const t=r==="correct";t?(Y(a=>a+1),A("success",I(b||null,"success"))):A("error",I(b||null,"error")),L(a=>[...a,{correct:t,card:n,timestamp:new Date().toISOString()}]),x(!1),setTimeout(()=>{m+1<o.length?E(a=>a+1):(y("SUMMARY"),N&&N({score:f+(t?1:0),total:o.length,history:[...P,{correct:t,card:n}],timeSpent:d,targetTime:v()}))},200)},g=r=>{const t=Math.floor(r/60),a=r%60;return`${t.toString().padStart(2,"0")}:${a.toString().padStart(2,"0")}`},v=()=>{const[r,t]=h.split(":").map(Number);return r*60+(t||0)};if(l==="SETUP")return e.jsxs("div",{className:"setup-card animation-bounce-in shadow-2xl bg-white border-2 border-slate-border rounded-[2.5rem] p-10 max-w-2xl mx-auto",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("div",{className:"w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4",children:e.jsx(W,{size:32,className:"text-brand"})}),e.jsx("h2",{className:"font-outfit text-3xl font-black text-slate-dark mb-2",children:"Configurar Missão"}),e.jsx("p",{className:"text-slate-mid font-medium",children:"Defina seus alvos estratégicos para este deck."})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 mb-10",children:[e.jsxs("div",{className:"setup-field",children:[e.jsxs("label",{className:"field-label",children:[e.jsx(w,{size:16})," Alvo de Acertos"]}),e.jsxs("div",{className:"field-input-wrapper",children:[e.jsx("input",{type:"number",value:u,onChange:r=>V(Number(r.target.value)),max:o.length,min:1}),e.jsxs("span",{className:"input-suffix",children:["de ",o.length]})]})]}),e.jsxs("div",{className:"setup-field",children:[e.jsxs("label",{className:"field-label",children:[e.jsx(j,{size:16})," Tempo Alvo"]}),e.jsx("div",{className:"field-input-wrapper",children:e.jsx("input",{type:"text",value:h,onChange:r=>_(r.target.value),placeholder:"mm:ss"})})]})]}),e.jsxs("button",{onClick:()=>y("PLAYING"),className:"w-full bg-brand text-white font-outfit font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transform transition-all shadow-xl shadow-brand/20",children:["Iniciar Atividade ",e.jsx(X,{size:22})]})]});if(l==="SUMMARY"){const r=v(),t=f>=u,a=d<=r,i=t&&a;return e.jsxs("div",{className:`summary-card animation-bounce-in shadow-2xl bg-white border-2 rounded-[2.5rem] p-10 text-center max-w-lg mx-auto relative overflow-hidden ${i?"border-green-500/30 glow-success":"border-amber-500/30"}`,children:[i&&e.jsx("div",{className:"confetti-container",children:[...Array(30)].map((T,G)=>e.jsx("div",{className:"confetti"},G))}),e.jsx("div",{className:`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${i?"bg-green-100":"bg-amber-100"}`,children:i?e.jsx(ee,{size:48,className:"text-green-600 bounce"}):e.jsx(te,{size:48,className:"text-amber-500 shake"})}),e.jsx("h2",{className:"font-outfit text-4xl font-black text-slate-dark mb-3",children:i?"Missão Cumprida!":"Quase Lá!"}),e.jsx("div",{className:"h-1 w-20 bg-brand/20 mx-auto mb-6 rounded-full"}),e.jsx("p",{className:"text-slate-mid font-semibold mb-10 leading-relaxed px-6",children:i?"Você dominou o tempo e a precisão. Alvos destruídos!":"O tempo ou a precisão escaparam um pouco. Vamos recalibrar?"}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 mb-8",children:[e.jsxs("div",{className:`p-6 rounded-[2rem] border-2 transition-all duration-500 ${a?"bg-green-50 border-green-200":"bg-red-50 border-red-200"}`,children:[e.jsx(j,{size:20,className:a?"text-green-600 mb-2 mx-auto":"text-red-600 mb-2 mx-auto"}),e.jsx("span",{className:"text-[0.65rem] uppercase tracking-widest font-black text-slate-mid block mb-1",children:"Tempo Final"}),e.jsx("div",{className:`text-2xl font-black font-outfit ${a?"text-green-700":"text-red-700"}`,children:g(d)}),e.jsxs("span",{className:"text-[0.6rem] font-bold opacity-60 italic",children:["Alvo: ",h]})]}),e.jsxs("div",{className:`p-6 rounded-[2rem] border-2 transition-all duration-500 ${t?"bg-green-50 border-green-200":"bg-red-50 border-red-200"}`,children:[e.jsx(w,{size:20,className:t?"text-green-600 mb-2 mx-auto":"text-red-600 mb-2 mx-auto"}),e.jsx("span",{className:"text-[0.65rem] uppercase tracking-widest font-black text-slate-mid block mb-1",children:"Acertos"}),e.jsxs("div",{className:`text-2xl font-black font-outfit ${t?"text-green-700":"text-red-700"}`,children:[f,"/",o.length]}),e.jsxs("span",{className:"text-[0.6rem] font-bold opacity-60 italic",children:["Alvo: ",u," acertos"]})]})]}),!i&&e.jsxs("div",{className:"bg-amber-50 text-amber-700 p-4 rounded-2xl mb-8 flex items-center gap-3 text-sm font-bold border border-amber-200 shadow-sm animate-pulse",children:[e.jsx(H,{size:18})," A persistência é o segredo da maestria!"]}),k?e.jsx("a",{href:`/api/contact/sensei?teacherId=${k}&text=${encodeURIComponent(`Oi Sensei! Acabei de completar a missão de Flashcards. Acertei ${f} de ${o.length} no tempo de ${g(d)}. Quero saber mais sobre as aulas! 🃏`)}`,target:"_blank",rel:"noopener noreferrer",className:"w-full bg-[#25D366] text-white font-outfit font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transform transition-all shadow-xl shadow-green-500/20 mb-4",style:{textDecoration:"none"},children:"💬 Falar com o Sensei no WhatsApp"}):null,e.jsxs("button",{onClick:()=>window.location.reload(),className:`w-full text-white font-outfit font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transform transition-all shadow-xl shadow-brand/20 ${i?"bg-brand":"bg-slate-dark"}`,children:[i?"Praticar Novamente":"Recalibrar Missão"," ",e.jsx(re,{size:20})]})]})}return n?e.jsxs("div",{className:"card-viewer-host",children:[e.jsx("div",{className:"viewer-header-layout",children:e.jsxs("div",{className:"viewer-progress-header",children:[e.jsxs("div",{className:"flex justify-between items-center mb-1",children:[e.jsxs("span",{className:"p-text",children:["Card ",m+1," de ",o.length]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:()=>S(!0),className:"flex items-center gap-2 px-3 py-1 bg-white border border-slate-border rounded-lg font-outfit font-bold text-slate-dark hover:bg-ice transition-all text-xs",children:"📖 Materiais"}),e.jsxs("div",{className:`timer-badge ${d>v()?"timer-over":""}`,children:[e.jsx(j,{size:14}),e.jsx("span",{children:g(d)})]})]})]}),e.jsx("div",{className:"p-track",children:e.jsx("div",{className:"p-fill",style:{width:`${(m+1)/o.length*100}%`}})})]})}),e.jsx("div",{className:`flip-card ${c?"is-flipped":""}`,onClick:()=>x(!c),children:e.jsxs("div",{className:"flip-card-inner",children:[e.jsxs("div",{className:"flip-card-front",children:[e.jsx("div",{className:"card-glass-effect"}),e.jsx("span",{className:"card-side-tag",children:"Japonês"}),e.jsxs("div",{className:"card-content-main",children:[e.jsx("h1",{className:"kanji-text",children:n.front}),e.jsx("p",{className:"reading-text",children:c?"":"Virar [Espaço/Enter]"})]}),e.jsxs("div",{className:"card-instruction",children:[e.jsx(ie,{size:16})," Toque para virar"]})]}),e.jsxs("div",{className:"flip-card-back",children:[e.jsx("div",{className:"card-glass-effect-dark"}),e.jsx("span",{className:"card-side-tag-white",children:"Significado"}),e.jsxs("div",{className:"card-back-main",children:[e.jsx("div",{className:"back-reading-white",children:n.reading}),e.jsx("h2",{className:"back-meaning-white",children:n.back}),e.jsxs("div",{className:"example-box-dark",children:[e.jsx("span",{className:"ex-label-white",children:"Exemplo:"}),e.jsx("p",{className:"ex-jp-white",children:n.example}),e.jsx("p",{className:"ex-pt-white",children:n.exampleTranslation})]})]}),e.jsx("div",{className:"card-instruction-white",children:"Clique para voltar à frente"})]})]})}),e.jsxs("div",{className:`srs-actions ${c?"visible":""}`,children:[e.jsx("p",{className:"srs-query font-outfit",children:"Como foi lembrar deste card?"}),e.jsxs("div",{className:"srs-buttons",children:[e.jsxs("button",{onClick:r=>{r.stopPropagation(),p("wrong")},className:"srs-btn wrong group",children:[e.jsx(J,{size:22,className:"group-hover:rotate-12 transition-transform"}),e.jsx("span",{children:"Errado [1]"})]}),e.jsxs("button",{onClick:r=>{r.stopPropagation(),p("correct")},className:"srs-btn correct group",children:[e.jsx(w,{size:22,className:"group-hover:scale-125 transition-transform"}),e.jsx("span",{children:"Certo [2]"})]})]})]}),l==="PLAYING"&&e.jsxs(e.Fragment,{children:[e.jsx(K,{isOpen:U,onClose:()=>S(!1),activityId:$}),e.jsx(Q,{avatarUrl:B,avatarId:b,state:O,message:q})]}),e.jsx("style",{children:`
        .card-viewer-host {
          max-width: 650px; margin: 0 auto; width: 100%;
          display: flex; flex-direction: column; gap: 2rem; align-items: center;
          animation: fade-in 0.5s ease;
        }
        
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

        /* SETUP STYLES */
        .setup-field { flex: 1; }
        .field-label { font-size: 0.7rem; font-weight: 800; color: var(--color-slate-mid); text-transform: uppercase; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
        .field-input-wrapper { display: flex; align-items: center; border: 2.5px solid var(--color-slate-border); border-radius: 1.25rem; padding: 0.75rem 1.25rem; transition: all 0.2s; background: white; }
        .field-input-wrapper:focus-within { border-color: var(--color-brand); box-shadow: 0 0 0 4px rgba(88,49,126,0.1); }
        .field-input-wrapper input { border: none; outline: none; background: transparent; font-family: var(--font-outfit); font-size: 1.5rem; font-weight: 800; color: var(--color-slate-dark); width: 100%; }
        .input-suffix { font-size: 0.8rem; font-weight: 700; color: var(--color-slate-mid); white-space: nowrap; }

        /* VIEWER STYLES */
        .viewer-header-layout { width: 100%; }
        .timer-badge { display: flex; align-items: center; gap: 0.4rem; background: rgba(88,49,126,0.06); color: var(--color-brand); padding: 0.4rem 1rem; border-radius: 999px; font-family: var(--font-outfit); font-weight: 800; font-size: 0.85rem; border: 1.5px solid rgba(88,49,126,0.1); transition: all 0.3s; }
        .timer-over { background: #fee2e2; color: #dc2626; border-color: #fecaca; }

        .p-track { height: 10px; background: var(--color-slate-border); border-radius: 999px; overflow: hidden; }
        .p-fill { height: 100%; background: var(--color-brand); border-radius: 999px; transition: width 0.3s ease; box-shadow: 0 0 10px rgba(88,49,126,0.3); }

        .flip-card {
          width: 100%; height: 480px;
          perspective: 1500px; cursor: pointer;
        }
        .flip-card-inner {
          position: relative; width: 100%; height: 100%; text-align: center;
          transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
        }
        .flip-card.is-flipped .flip-card-inner { transform: rotateY(180deg); }

        .flip-card-front, .flip-card-back {
          position: absolute; width: 100%; height: 100%;
          -webkit-backface-visibility: hidden; backface-visibility: hidden;
          border-radius: 3rem; border: 2.5px solid var(--color-slate-border);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 3rem; box-sizing: border-box; overflow: hidden;
          box-shadow: 0 30px 60px -12px rgba(30,41,59,0.15);
        }

        .flip-card-front { background: white; color: var(--color-slate-dark); }
        .flip-card-back { 
            background: linear-gradient(135deg, #58317e 0%, #311b47 100%); 
            transform: rotateY(180deg);
            border-color: #4c2b6d;
        }

        .kanji-text { font-family: 'Noto Sans JP', sans-serif; font-size: 5rem; font-weight: 900; margin: 0; filter: drop-shadow(0 5px 15px rgba(0,0,0,0.05)); }
        .reading-text { font-size: 1.1rem; color: var(--color-slate-mid); margin-top: 2rem; font-weight: 600; font-family: var(--font-outfit); opacity: 0.7; }

        .back-reading-white { font-family: var(--font-inter); font-size: 1.4rem; color: rgba(255,255,255,0.7); margin-bottom: 0.5rem; letter-spacing: 0.05em; }
        .back-meaning-white { font-family: var(--font-outfit); font-size: 3.5rem; font-weight: 900; color: white; margin: 0 0 1.5rem; filter: drop-shadow(0 5px 20px rgba(0,0,0,0.3)); }

        .example-box-dark {
          background: rgba(255,255,255,0.07); border-radius: 2rem; padding: 2rem; text-align: left; width: 100%;
          border: 1px solid rgba(255,255,255,0.15); backdrop-filter: blur(15px);
        }
        .ex-label-white { font-size: 0.75rem; font-weight: 900; color: #c4b5fd; text-transform: uppercase; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
        .ex-jp-white { font-size: 1.2rem; color: white; margin: 0; line-height: 1.6; font-weight: 500; font-family: 'Noto Sans JP', sans-serif; }
        .ex-pt-white { font-size: 1rem; color: rgba(255,255,255,0.5); margin: 0.75rem 0 0; font-family: var(--font-inter); }
        .card-instruction-white { position: absolute; bottom: 2rem; color: rgba(255,255,255,0.3); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }

        /* SRS ACTIONS */
        .srs-actions {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          opacity: 0;
          pointer-events: none;
          transform: translateY(20px);
          transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
          margin-top: 1rem;
        }
        .srs-actions.visible {
          opacity: 1;
          pointer-events: all;
          transform: translateY(0);
        }
        .srs-query {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-slate-mid);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }
        .srs-buttons {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .srs-btn {
          height: 80px;
          border-radius: 2rem;
          border: 2px solid transparent;
          font-family: var(--font-outfit);
          font-weight: 900;
          font-size: 1.25rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 20px -5px rgba(0,0,0,0.05);
        }
        .srs-btn.wrong {
          background: rgba(255, 95, 133, 0.08);
          border-color: rgba(255, 95, 133, 0.15);
          color: #ff5f85;
        }
        .srs-btn.wrong:hover {
          background: rgba(255, 95, 133, 0.15);
          border-color: #ff5f85;
          transform: translateY(-5px);
          box-shadow: 0 15px 30px -10px rgba(255, 95, 133, 0.4);
        }
        .srs-btn.correct {
          background: rgba(46, 213, 115, 0.08);
          border-color: rgba(46, 213, 115, 0.15);
          color: #2ed573;
        }
        .srs-btn.correct:hover {
          background: rgba(46, 213, 115, 0.15);
          border-color: #2ed573;
          transform: translateY(-5px);
          box-shadow: 0 15px 30px -10px rgba(46, 213, 115, 0.4);
        }

        /* ANIMATIONS & EFFECTS */
        .glow-success { box-shadow: 0 0 50px rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.3) !important; animation: border-pulse 2s infinite; }
        @keyframes border-pulse { 0%, 100% { border-color: rgba(34,197,94,0.3); } 50% { border-color: rgba(34,197,94,0.6); } }
        
        @keyframes bounce-in { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animation-bounce-in { animation: bounce-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

        .confetti-container { position: absolute; inset: 0; pointer-events: none; }
        .confetti { position: absolute; width: 10px; height: 10px; top: -10px; border-radius: 2px; animation: confetti-fall 3s ease-out infinite; }
        .confetti:nth-child(5n) { background: #8b5cf6; } .confetti:nth-child(5n+1) { background: #3b82f6; } 
        .confetti:nth-child(5n+2) { background: #10b981; } .confetti:nth-child(5n+3) { background: #f59e0b; }
        .confetti:nth-child(5n+4) { background: #ec4899; }
        
        @keyframes confetti-fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; left: var(--left, 50%); }
            100% { transform: translateY(500px) rotate(720deg); opacity: 0; left: var(--left-end, 50%); }
        }
        ${[...Array(30)].map((r,t)=>`
            .confetti:nth-child(${t+1}) { 
                --left: ${Math.random()*100}%; 
                --left-end: ${Math.random()*100+(Math.random()-.5)*20}%; 
                animation-delay: ${Math.random()*2}s;
                animation-duration: ${2+Math.random()*2}s;
            }
        `).join("")}

        .bounce { animation: bounce 2s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        
        .shake { animation: shake 0.5s infinite; }
        @keyframes shake { 0% { transform: rotate(0); } 25% { transform: rotate(5deg); } 50% { transform: rotate(0); } 75% { transform: rotate(-5deg); } 100% { transform: rotate(0); } }
      `})]}):null};export{ve as CardViewer};
