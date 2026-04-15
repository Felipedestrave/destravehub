import{j as e}from"./jsx-runtime.u17CrQMm.js";import{r as a}from"./index.DrBtkhmp.js";import{s as l}from"./materials.astro_astro_type_script_index_0_lang.CbpkQ25P.js";import{c as D}from"./createLucideIcon.BukDFzw_.js";import{T as _}from"./trending-up.BkMIaZpJ.js";import{P as F}from"./pen.DSAZthV2.js";import{L as $}from"./link.DF_FTUNB.js";import{T as k}from"./trash-2.BQZtT8Af.js";import{X as q}from"./x.BrQxZFfz.js";import{C as R}from"./circle-check.CzS0XoDm.js";const J=[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}]],M=D("ellipsis-vertical",J);function Z(){const[r,d]=a.useState([]),[P,E]=a.useState(null),[z,C]=a.useState(!0),[f,n]=a.useState(null),c=a.useRef(null),[m,u]=a.useState(null),[o,x]=a.useState(null),[p,h]=a.useState(""),[b,g]=a.useState(""),[v,j]=a.useState("");a.useEffect(()=>{const t=s=>{c.current&&!c.current.contains(s.target)&&n(null)};return document.addEventListener("mousedown",t),()=>document.removeEventListener("mousedown",t)},[]);const N=a.useCallback(async t=>{const{data:s}=await l.from("students").select("*").eq("teacher_id",t).order("created_at",{ascending:!1});d(s??[])},[]);a.useEffect(()=>{l.auth.getSession().then(({data:{session:t}})=>{if(!t){window.location.href="/auth/login";return}E(t.user.id),N(t.user.id).finally(()=>C(!1))})},[N]);const S=t=>{u(t),h(t.name),g(t.language??"Japonês"),j(t.level??"Iniciante"),n(null)},I=async t=>{if(t.preventDefault(),!m)return;const{data:s,error:i}=await l.from("students").update({name:p,language:b,level:v}).eq("id",m.id).select().single();if(i){console.error("Erro ao atualizar aluno:",i),alert("Não foi possível atualizar o aluno.");return}d(B=>B.map(y=>y.id===s.id?s:y)),u(null)},A=t=>{x(t),n(null)},L=async()=>{if(!o)return;const{error:t}=await l.from("students").delete().eq("id",o.id);if(t){console.error("Erro ao excluir aluno:",t),alert("Não foi possível excluir. O aluno pode estar vinculado a atividades.");return}d(s=>s.filter(i=>i.id!==o.id)),x(null)},T=t=>{if(!t)return;const s=`${window.location.origin}/play/experimental/${t}`;navigator.clipboard.writeText(s),alert("Link copiado para a área de transferência!"),n(null)},w={N5:"#64748B",N4:"#22C55E",N3:"#3B82F6",N2:"#F59E0B",N1:"#EF4444",Iniciante:"#64748B",Básico:"#22C55E",Intermediário:"#3B82F6",Avançado:"#EF4444"};return z?e.jsxs("div",{className:"students-loading",children:[e.jsx("div",{className:"students-spinner"}),e.jsx("p",{children:"Carregando alunos…"})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"students-header",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"students-title",children:"Seus Alunos"}),e.jsx("p",{className:"students-subtitle",children:r.length===0?"Nenhum aluno cadastrado ainda.":`${r.length} aluno${r.length>1?"s":""} cadastrado${r.length>1?"s":""}.`})]}),e.jsx("a",{href:"/dashboard/students/new",id:"add-student-btn",className:"btn-action",style:{textDecoration:"none"},children:"+ Novo Aluno"})]}),e.jsxs("div",{className:"stats-row",children:[e.jsxs("div",{className:"stat-card",children:[e.jsx("p",{className:"stat-label",children:"Total de Alunos"}),e.jsx("p",{className:"stat-value",style:{color:"var(--color-brand)"},children:r.length})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("p",{className:"stat-label",children:"Contas Ativas"}),e.jsx("p",{className:"stat-value",style:{color:"var(--color-brand)"},children:r.filter(t=>t.student_id).length})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("p",{className:"stat-label",children:"Experimentais"}),e.jsx("p",{className:"stat-value",style:{color:"var(--color-slate-mid)"},children:r.filter(t=>t.experimental_uuid).length})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("p",{className:"stat-label",children:"Foco Atual"}),e.jsx("p",{className:"stat-value",style:{color:"#22C55E",fontSize:"1.25rem",display:"flex",alignItems:"center"},children:r.length>0?r[0]?.language??"Japonês":"—"})]})]}),r.length===0?e.jsxs("div",{className:"students-empty",children:[e.jsx("div",{className:"empty-icon",children:"👥"}),e.jsx("h3",{className:"empty-title",children:"Nenhum aluno cadastrado"}),e.jsx("p",{className:"empty-desc",children:"Registre seus primeiros alunos para começar a enviar missões interativas."}),e.jsx("a",{href:"/dashboard/students/new",className:"btn-action",style:{textDecoration:"none"},children:"Registrar Primeiro Aluno"})]}):e.jsx("div",{className:"students-grid",ref:c,children:r.map(t=>e.jsxs("div",{className:"student-card",children:[e.jsx("div",{className:"student-avatar",children:t.name.charAt(0).toUpperCase()}),e.jsxs("div",{className:"student-info",children:[e.jsx("p",{className:"student-name",children:t.name}),e.jsxs("p",{className:"student-meta flex items-center gap-1",children:[t.student_id?"✅ Conta oficial":"🔗 Link único",t.language&&` • 🗣️ ${t.language}`]})]}),e.jsx("span",{className:"student-level hidden sm:inline-flex",style:{borderColor:w[t.level??"Iniciante"]??"#64748B",color:w[t.level??"Iniciante"]??"#64748B"},children:t.level??"Iniciante"}),e.jsxs("div",{className:"action-menu-container",children:[e.jsx("button",{className:"kebab-btn",onClick:()=>n(f===t.id?null:t.id),children:e.jsx(M,{size:20,className:"text-slate-400 hover:text-brand"})}),f===t.id&&e.jsxs("div",{className:"dropdown-panel animation-fade-in shadow-xl",children:[e.jsxs("a",{href:`/dashboard/students/${t.id}`,className:"dropdown-item",children:[e.jsx(_,{size:16})," Ver Perfil"]}),e.jsxs("button",{onClick:()=>S(t),className:"dropdown-item",children:[e.jsx(F,{size:16})," Editar Aluno"]}),!t.student_id&&t.experimental_uuid&&e.jsxs("button",{onClick:()=>T(t.experimental_uuid),className:"dropdown-item",children:[e.jsx($,{size:16})," Copiar Link"]}),e.jsx("div",{className:"dropdown-divider"}),e.jsxs("button",{onClick:()=>A(t),className:"dropdown-item danger",children:[e.jsx(k,{size:16})," Excluir"]})]})]})]},t.id))}),m&&e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-content animation-bounce-in max-w-md w-full",children:[e.jsxs("div",{className:"flex justify-between items-center mb-6",children:[e.jsx("h2",{className:"font-outfit text-2xl font-black text-slate-dark",children:"Editar Aluno"}),e.jsx("button",{onClick:()=>u(null),className:"text-slate-400 hover:text-slate-dark",children:e.jsx(q,{size:24})})]}),e.jsxs("form",{onSubmit:I,className:"flex flex-col gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-bold text-slate-mid uppercase mb-2",children:"Nome do Aluno"}),e.jsx("input",{type:"text",value:p,onChange:t=>h(t.target.value),className:"w-full border-2 border-slate-200 rounded-xl p-3 font-outfit font-bold outline-none focus:border-brand",required:!0})]}),e.jsxs("div",{className:"flex gap-4",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx("label",{className:"block text-xs font-bold text-slate-mid uppercase mb-2",children:"Foco/Idioma"}),e.jsxs("select",{value:b,onChange:t=>g(t.target.value),className:"w-full border-2 border-slate-200 rounded-xl p-3 font-outfit font-bold outline-none focus:border-brand",children:[e.jsx("option",{value:"Japonês",children:"Japonês"}),e.jsx("option",{value:"Inglês",children:"Inglês"}),e.jsx("option",{value:"Espanhol",children:"Espanhol"})]})]}),e.jsxs("div",{className:"flex-1",children:[e.jsx("label",{className:"block text-xs font-bold text-slate-mid uppercase mb-2",children:"Nível"}),e.jsxs("select",{value:v,onChange:t=>j(t.target.value),className:"w-full border-2 border-slate-200 rounded-xl p-3 font-outfit font-bold outline-none focus:border-brand",children:[e.jsx("option",{value:"Iniciante",children:"Iniciante"}),e.jsx("option",{value:"Básico",children:"Básico"}),e.jsx("option",{value:"Intermediário",children:"Intermediário"}),e.jsx("option",{value:"Avançado",children:"Avançado"})]})]})]}),e.jsxs("button",{type:"submit",className:"mt-4 w-full bg-brand text-white font-outfit font-black py-4 rounded-xl flex justify-center items-center gap-2 hover:opacity-90 transition-all",children:[e.jsx(R,{size:20})," Salvar Alterações"]})]})]})}),o&&e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-content animation-bounce-in max-w-sm w-full text-center",children:[e.jsx("div",{className:"w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4",children:e.jsx(k,{size:32,className:"text-red-500"})}),e.jsx("h2",{className:"font-outfit text-2xl font-black text-slate-dark mb-2",children:"Excluir Aluno?"}),e.jsxs("p",{className:"text-slate-mid text-sm mb-6",children:["Você tem certeza que deseja excluir ",e.jsx("b",{children:o.name}),"? O histórico de missões deste aluno não poderá ser recuperado."]}),e.jsxs("div",{className:"flex gap-3",children:[e.jsx("button",{onClick:()=>x(null),className:"flex-1 border-2 border-slate-200 text-slate-dark font-outfit font-bold py-3 rounded-xl hover:bg-slate-50 transition-all",children:"Cancelar"}),e.jsx("button",{onClick:L,className:"flex-1 bg-red-500 text-white font-outfit font-bold py-3 rounded-xl hover:bg-red-600 transition-all",children:"Sim, Excluir"})]})]})}),e.jsx("style",{children:`
                .students-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    min-height: 300px;
                    color: var(--color-slate-mid);
                }
                .students-spinner {
                    width: 40px; height: 40px;
                    border: 3px solid var(--color-slate-border);
                    border-top-color: var(--color-brand);
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .students-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .students-title {
                    font-family: var(--font-outfit);
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: var(--color-slate-dark);
                    margin: 0 0 0.25rem;
                }
                .students-subtitle {
                    font-size: 0.875rem;
                    color: var(--color-slate-mid);
                    margin: 0;
                }

                /* Stats */
                .stats-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                .stat-card {
                    background: white;
                    border: 1px solid var(--color-slate-border);
                    border-radius: 1rem;
                    padding: 1.25rem 1.5rem;
                    box-shadow: var(--shadow-card);
                }
                .stat-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--color-slate-mid);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin: 0 0 0.5rem;
                }
                .stat-value {
                    font-family: var(--font-outfit);
                    font-size: 2rem;
                    font-weight: 800;
                    margin: 0;
                    line-height: 1;
                }

                /* Student grid */
                .students-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .student-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: white;
                    border: 1px solid var(--color-slate-border);
                    border-radius: 1rem;
                    padding: 1rem 1.25rem;
                    box-shadow: var(--shadow-card);
                    transition: box-shadow 150ms ease, transform 150ms ease;
                }
                .student-card:hover {
                    box-shadow: var(--shadow-hover);
                    transform: translateY(-2px);
                }
                .student-avatar {
                    width: 44px; height: 44px;
                    border-radius: 12px;
                    background-color: var(--color-brand);
                    color: white;
                    font-family: var(--font-outfit);
                    font-weight: 800;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .student-info {
                    flex: 1;
                    min-width: 0;
                }
                .student-name {
                    font-family: var(--font-outfit);
                    font-weight: 700;
                    font-size: 0.95rem;
                    color: var(--color-slate-dark);
                    margin: 0 0 0.2rem;
                }
                .student-meta {
                    font-size: 0.78rem;
                    color: var(--color-slate-mid);
                    margin: 0;
                }
                .student-level {
                    font-family: var(--font-outfit);
                    font-weight: 800;
                    font-size: 0.8rem;
                    padding: 0.3rem 0.75rem;
                    border: 2px solid;
                    border-radius: 8px;
                    flex-shrink: 0;
                }

                /* Empty state */
                .students-empty {
                    background: white;
                    border: 2px dashed var(--color-slate-border);
                    border-radius: 1.5rem;
                    padding: 4rem 2rem;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }
                .empty-icon { font-size: 3rem; }
                .empty-title {
                    font-family: var(--font-outfit);
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: var(--color-slate-dark);
                    margin: 0;
                }
                .empty-desc {
                    color: var(--color-slate-mid);
                    font-size: 0.9rem;
                    max-width: 360px;
                    margin: 0;
                }
                
                /* Kebab Menu & Dropdown */
                .action-menu-container {
                    position: relative;
                    margin-left: 0.5rem;
                }
                .kebab-btn {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .kebab-btn:hover {
                    background: rgba(88, 49, 126, 0.05);
                }
                .dropdown-panel {
                    position: absolute;
                    right: 0;
                    top: calc(100% + 5px);
                    background: white;
                    border: 1px solid var(--color-slate-border);
                    border-radius: 1rem;
                    padding: 0.5rem;
                    min-width: 180px;
                    z-index: 50;
                    transform-origin: top right;
                }
                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: none;
                    background: transparent;
                    font-family: var(--font-inter);
                    font-weight: 600;
                    font-size: 0.85rem;
                    color: var(--color-slate-dark);
                    cursor: pointer;
                    border-radius: 0.5rem;
                    text-align: left;
                    transition: all 0.15s;
                }
                .dropdown-item:hover {
                    background: rgba(88, 49, 126, 0.05);
                    color: var(--color-brand);
                }
                .dropdown-item.danger {
                    color: #ef4444;
                }
                .dropdown-item.danger:hover {
                    background: #fef2f2;
                }
                .dropdown-divider {
                    height: 1px;
                    background: var(--color-slate-border);
                    margin: 0.25rem 0;
                }

                /* Modais */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(4px);
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }
                .modal-content {
                    background: white;
                    border-radius: 2rem;
                    padding: 2.5rem;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
                }
                
                .animation-fade-in { animation: fade-in 0.2s ease forwards; }
                @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                
                .animation-bounce-in { animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                @keyframes bounce-in { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

                @media (prefers-reduced-motion: reduce) {
                    .students-spinner { animation: none; }
                    .student-card:hover { transform: none; }
                }
            `})]})}export{Z as default};
