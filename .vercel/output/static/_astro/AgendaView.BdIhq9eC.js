import{j as e}from"./jsx-runtime.u17CrQMm.js";import{r as d}from"./index.DrBtkhmp.js";import{s}from"./materials.astro_astro_type_script_index_0_lang.CbpkQ25P.js";import{C as x}from"./clock.B6Naz5I-.js";import{T as f}from"./target.DQNRlkPP.js";const N=()=>{const[i,c]=d.useState([]),[m,l]=d.useState(!0);return d.useEffect(()=>{(async()=>{l(!0);try{const{data:{session:r}}=await s.auth.getSession();if(!r)return;const{data:o}=await s.from("students").select("id").eq("student_id",r.user.id).single();if(!o)return;const{data:g}=await s.from("appointments").select("*").eq("student_id",o.id).gte("start_time",new Date().toISOString()).order("start_time",{ascending:!0}),{data:h}=await s.from("assignments").select("*, activities(title, type)").eq("student_id",o.id).eq("status","pending").order("assigned_at",{ascending:!1}).limit(5),n=[];g?.forEach(t=>{n.push({id:t.id,type:"class",title:t.title,date:new Date(t.start_time),time:new Date(t.start_time).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),meta:t.description||void 0})}),h?.forEach(t=>{n.push({id:t.id,type:"mission",title:t.activities?.title||"Missão Sem Título",date:new Date(t.assigned_at||Date.now()),status:t.status||void 0,meta:t.activities?.type||void 0})}),n.sort((t,p)=>t.date.getTime()-p.date.getTime()),c(n)}catch(r){console.error("[AgendaView] Error:",r)}finally{l(!1)}})()},[]),m?e.jsx("div",{className:"agenda-loading",children:"Sincronizando agenda..."}):i.length===0?e.jsxs("div",{className:"agenda-empty",children:[e.jsx("div",{className:"empty-glow",children:"✨"}),e.jsx("h3",{children:"Sua agenda está livre!"}),e.jsx("p",{children:"Aproveite para revisar seus itens na loja ou praticar no modo livre."})]}):e.jsxs("div",{className:"agenda-container",children:[e.jsx("h2",{className:"agenda-title",children:"Programação Próxima"}),e.jsx("div",{className:"timeline",children:i.map((a,r)=>{const o=a.date.toDateString()===new Date().toDateString();return e.jsxs("div",{className:`timeline-item ${a.type}`,children:[e.jsxs("div",{className:"timeline-left",children:[e.jsxs("div",{className:"time-box",children:[o?e.jsx("span",{className:"today-badge",children:"HOJE"}):e.jsx("span",{className:"date-label",children:a.date.toLocaleDateString("pt-BR",{day:"2-digit",month:"short"})}),e.jsx("span",{className:"hour-label",children:a.time||"—"})]}),e.jsx("div",{className:"line-node"})]}),e.jsx("div",{className:"timeline-content",children:e.jsxs("div",{className:"content-card",children:[e.jsx("div",{className:"card-icon",children:a.type==="class"?e.jsx(x,{size:16}):e.jsx(f,{size:16})}),e.jsxs("div",{className:"card-info",children:[e.jsx("div",{className:"card-type-label",children:a.type==="class"?"AULA AGENDADA":"MISSÃO PENDENTE"}),e.jsx("h4",{className:"card-title",children:a.title}),a.meta&&a.type==="class"&&e.jsx("p",{className:"card-meta",children:a.meta})]}),e.jsx("div",{className:"card-action-hint",children:e.jsx(u,{size:18})})]})})]},a.id)})}),e.jsx("style",{children:`
                .agenda-container {
                    background: white;
                    border-radius: 1.5rem;
                    padding: 1.5rem;
                    border: 1px solid var(--color-slate-border);
                    height: 100%;
                }
                .agenda-title {
                    font-family: var(--font-outfit);
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--color-slate-dark);
                    margin-bottom: 2rem;
                }

                .timeline {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .timeline-item {
                    display: flex;
                    gap: 1.5rem;
                    position: relative;
                }

                .timeline-left {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 60px;
                    flex-shrink: 0;
                }

                .time-box {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                }
                .today-badge {
                    background: #22c55e;
                    color: white;
                    font-size: 0.6rem;
                    font-weight: 800;
                    padding: 0.2rem 0.5rem;
                    border-radius: 4px;
                }
                .date-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--color-slate-dark);
                }
                .hour-label {
                    font-size: 0.7rem;
                    color: var(--color-slate-mid);
                    font-weight: 600;
                }

                .line-node {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: 2px solid white;
                    box-shadow: 0 0 0 2px var(--color-brand);
                    background: white;
                    margin-top: 1rem;
                    z-index: 2;
                }
                .timeline-item::after {
                    content: '';
                    position: absolute;
                    left: 29px;
                    top: 40px;
                    bottom: -30px;
                    width: 2px;
                    background: var(--color-slate-border);
                    z-index: 1;
                }
                .timeline-item:last-child::after {
                    display: none;
                }

                .timeline-content {
                    flex: 1;
                }
                .content-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: var(--color-ice);
                    padding: 1rem;
                    border-radius: 1.25rem;
                    transition: all 0.2s;
                    cursor: pointer;
                    border: 1.5px solid transparent;
                }
                .content-card:hover {
                    background: white;
                    border-color: var(--color-brand);
                    transform: translateX(4px);
                    box-shadow: 0 4px 12px rgba(88,49,126,0.06);
                }

                .card-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 0.75rem;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--color-brand);
                    flex-shrink: 0;
                }
                .timeline-item.class .card-icon { color: #3b82f6; }
                .timeline-item.mission .card-icon { color: #f59e0b; }

                .card-info {
                    flex: 1;
                }
                .card-type-label {
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    color: var(--color-slate-mid);
                    margin-bottom: 0.2rem;
                }
                .card-title {
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: var(--color-slate-dark);
                    margin: 0;
                }
                .card-meta {
                    font-size: 0.75rem;
                    color: var(--color-slate-mid);
                    margin-top: 0.2rem;
                }

                .card-action-hint {
                    color: var(--color-slate-border);
                }

                .agenda-loading, .agenda-empty {
                    padding: 3rem;
                    text-align: center;
                    background: white;
                    border-radius: 1.5rem;
                    border: 1px dashed var(--color-slate-border);
                }
                .empty-glow { font-size: 2rem; margin-bottom: 0.5rem; }
                .agenda-empty h3 { font-family: var(--font-outfit); font-weight: 800; margin-bottom: 0.5rem; }
                .agenda-empty p { font-size: 0.85rem; color: var(--color-slate-mid); }
            `})]})},u=({size:i})=>e.jsx("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"m9 18 6-6-6-6"})});export{N as AgendaView};
