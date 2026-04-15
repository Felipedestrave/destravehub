import{j as e}from"./jsx-runtime.u17CrQMm.js";import{r as i}from"./index.DrBtkhmp.js";import{s as d}from"./materials.astro_astro_type_script_index_0_lang.CbpkQ25P.js";import{S as x}from"./store.BRx3I6wk.js";function N(){const[l,m]=i.useState([]),[p,c]=i.useState(!0),[r,f]=i.useState(null);i.useEffect(()=>{async function s(){try{c(!0);const{data:{session:a}}=await d.auth.getSession();if(!a)return;const{data:o}=await d.from("profiles").select("*").eq("id",a.user.id).single();f(o);const t=await fetch("/api/student/missions",{headers:{Authorization:`Bearer ${a.access_token}`}});if(!t.ok)throw new Error("Falha ao carregar missões");const n=await t.json();m(n.missions||[])}catch(a){console.error("[MissionList] Unexpected error:",a)}finally{c(!1)}}s()},[]);const h=s=>{switch(s){case"completed":return e.jsx("span",{className:"status-badge completed",children:"Concluída"});case"in_progress":return e.jsx("span",{className:"status-badge in-progress",children:"Em andamento"});default:return e.jsx("span",{className:"status-badge pending",children:"Pendente"})}},g=s=>{switch(s){case"escuta":return"🎧";case"mrp":return"🎭";case"flashcards":return"🃏";default:return"📄"}},u=s=>{if(!s.activities){alert("Esta atividade ainda não teve as permissões de acesso liberadas pelo seu professor.");return}const a=s.activities.type;a==="escuta"&&(window.location.href=`/dashboard/missions/escuta?assignment=${s.id}`),a==="mrp"&&(window.location.href=`/dashboard/missions/mrp?assignment=${s.id}`),a==="flashcards"&&(window.location.href=`/dashboard/missions/flashcards?assignment=${s.id}`)};return p?e.jsx("div",{className:"loading-container",children:e.jsx("div",{className:"spinner"})}):r?.role==="teacher"?e.jsxs("div",{className:"message-card",children:[e.jsx("h3",{children:"Visão de Professor"}),e.jsx("p",{children:'Como professor, você deve gerenciar seus alunos na aba "Alunos" para ver o progresso deles.'}),e.jsx("a",{href:"/dashboard",className:"btn-action",children:"Ver Alunos"})]}):e.jsxs("div",{className:"missions-container",children:[e.jsxs("div",{className:"header-section",children:[e.jsxs("div",{className:"flex items-baseline gap-2 mb-1",children:[e.jsx("h1",{className:"title",style:{margin:0},children:"Minhas Missões"}),r?.equipped?.title&&e.jsx("span",{className:"equipped-title-tag",children:x.find(s=>s.id===r.equipped.title)?.name||""})]}),e.jsxs("p",{className:"subtitle",children:["Olá, ",e.jsx("strong",{children:r?.full_name?.split(" ")[0]||"Aluno"}),"! Mergulhe no japonês com as tarefas preparadas pelo seu professor."]})]}),e.jsxs("div",{className:"stats-row",children:[e.jsxs("div",{className:"stat-card balance-card",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[e.jsx("span",{style:{fontSize:"1rem"},children:"🪙"}),e.jsx("p",{className:"stat-label",style:{margin:0},children:"Meus Coins"})]}),e.jsxs("p",{className:"stat-value",style:{color:"#d97706"},children:[r?.coins||0," ",e.jsx("span",{className:"dc-label",children:"DC"})]})]}),e.jsxs("div",{className:"stat-card balance-card",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[e.jsx("span",{style:{fontSize:"1rem"},children:"⚡"}),e.jsx("p",{className:"stat-label",style:{margin:0},children:"Nível XP"})]}),e.jsxs("p",{className:"stat-value",style:{color:"#4f46e5"},children:[r?.xp||0," ",e.jsx("span",{className:"dc-label",children:"XP"})]})]})]}),l.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsx("div",{className:"empty-icon",children:"📂"}),e.jsx("h2",{className:"empty-title",children:"Nenhuma missão encontrada"}),e.jsxs("p",{className:"empty-desc",children:["Seu professor ainda não enviou tarefas para sua conta: ",e.jsx("strong",{children:r?.full_name||"Usuário"})]})]}):e.jsx("div",{className:"mission-grid",children:l.map(s=>{const a=s.activities?.config||{},o=a.language||"Japonês",t=a.level||"Iniciante",n=s.assigned_at?new Date(s.assigned_at).toLocaleDateString("pt-BR"):"—";return e.jsxs("div",{className:`mission-card ${s.status==="completed"?"completed-card":""}`,onClick:()=>u(s),children:[e.jsx("div",{className:"mission-type-icon",children:g(s.activities?.type||"escuta")}),e.jsxs("div",{className:"mission-content",children:[e.jsxs("div",{className:"mission-header",children:[e.jsx("h3",{className:"mission-title",children:s.activities?.title||"Missão Sem Título"}),h(s.status)]}),e.jsxs("div",{className:"mission-footer",children:[e.jsxs("span",{className:"mission-meta",children:["🗣️ ",o]}),e.jsxs("span",{className:"mission-meta",children:["📊 ",t]}),e.jsxs("span",{className:"mission-meta",children:["📅 ",n]})]})]}),e.jsx("div",{className:"mission-arrow",children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"m9 18 6-6-6-6"})})})]},s.id)})}),e.jsx("style",{children:`
        .missions-container {
          padding-bottom: 2rem;
        }
        .header-section {
          margin-bottom: 2rem;
        }
        .title {
          font-family: var(--font-outfit);
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-slate-dark);
          margin-bottom: 0.5rem;
        }
        .subtitle {
          color: var(--color-slate-mid);
          font-size: 1rem;
        }

        .equipped-title-tag {
          background: var(--color-ice);
          color: var(--color-brand);
          font-family: var(--font-outfit);
          font-weight: 900;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.25rem 0.75rem;
          border-radius: 99px;
          border: 1.5px solid rgba(88,49,126,0.1);
          animation: fade-in 0.5s ease;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          background: white;
          border: 1px solid var(--color-slate-border);
          border-radius: 1.25rem;
          padding: 1.25rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .stat-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-slate-mid);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }
        .stat-value {
          font-family: var(--font-outfit);
          font-size: 1.75rem;
          font-weight: 800;
          margin: 0;
          color: var(--color-slate-dark);
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }
        .dc-label {
          font-size: 0.75rem;
          opacity: 0.6;
        }

        .balance-card {
           border-bottom: 4px solid var(--color-slate-border);
           transition: all 0.3s ease;
        }
        .balance-card:hover {
           transform: translateY(-4px);
           border-bottom-color: var(--color-brand);
        }

        .mission-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.25rem;
        }

        .mission-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          background: white;
          border: 1px solid var(--color-slate-border);
          border-radius: 1.25rem;
          padding: 1.25rem;
          cursor: pointer;
          transition: all 200ms ease;
          position: relative;
          overflow: hidden;
        }
        .mission-card:hover {
          border-color: var(--color-brand);
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .mission-type-icon {
          width: 60px;
          height: 60px;
          background: var(--color-ice);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          flex-shrink: 0;
        }
        .mission-content {
          flex: 1;
        }
        .mission-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          gap: 1rem;
        }
        .mission-title {
          font-family: var(--font-outfit);
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--color-slate-dark);
          margin: 0;
        }
        .status-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 2rem;
        }
        .status-badge.pending {
          background: #FEF3C7;
          color: #92400E;
        }
        .status-badge.in-progress {
          background: #DBEAFE;
          color: #1E40AF;
        }
        .status-badge.completed {
          background: #DCFCE7;
          color: #166534;
        }

        .mission-footer {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: var(--color-slate-mid);
        }

        .mission-arrow {
          color: var(--color-slate-border);
          transition: color 200ms ease, transform 200ms ease;
        }
        .mission-card:hover .mission-arrow {
          color: var(--color-brand);
          transform: translateX(4px);
        }

        .completed-card {
          opacity: 0.85;
          background: var(--color-ice);
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border: 2px dashed var(--color-slate-border);
          border-radius: 2rem;
        }
        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        
        .loading-container {
          display: flex;
          justify-content: center;
          padding: 4rem;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--color-ice);
          border-top-color: var(--color-brand);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .message-card {
          background: white;
          padding: 2rem;
          border-radius: 1.5rem;
          border: 1px solid var(--color-slate-border);
          text-align: center;
        }

        @media (max-width: 640px) {
          .mission-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .mission-type-icon {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
          }
        }
      `})]})}export{N as default};
