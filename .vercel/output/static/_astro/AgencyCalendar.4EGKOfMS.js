import{j as e}from"./jsx-runtime.u17CrQMm.js";import{r}from"./index.DrBtkhmp.js";import{s as u}from"./materials.astro_astro_type_script_index_0_lang.CbpkQ25P.js";function G(){const[p,x]=r.useState(new Date),[b,_]=r.useState([]),[I,v]=r.useState([]),[y,M]=r.useState(null),[E,w]=r.useState(!0),[L,l]=r.useState(!1),[h,B]=r.useState(null),[j,k]=r.useState(!1),[S,D]=r.useState(""),[m,N]=r.useState(""),[C,O]=r.useState("09:00"),[A,q]=r.useState("60"),F=r.useCallback(async t=>{w(!0);try{const{data:a}=await u.from("students").select("*").eq("teacher_id",t).order("name");_(a||[]);const{data:i}=await u.from("appointments").select("*, student:students(*)").eq("teacher_id",t);v(i||[])}catch(a){console.error("Error fetching calendar data:",a)}finally{w(!1)}},[]);r.useEffect(()=>{(async()=>{const{data:{session:a}}=await u.auth.getSession();a?.user&&(M(a.user.id),F(a.user.id))})()},[F]);const H=(t,a)=>new Date(t,a+1,0).getDate(),R=(t,a)=>new Date(t,a,1).getDay(),z=t=>{x(a=>new Date(a.getFullYear(),a.getMonth()+t,1))},Y=t=>{B(t),l(!0),D(""),N("")},$=async t=>{if(t.preventDefault(),!y||!h)return;k(!0);const a=new Date(h),[i,g]=C.split(":").map(Number);a.setHours(i,g,0,0);const d=new Date(a.getTime()+parseInt(A)*6e4);try{const{data:o,error:s}=await u.from("appointments").insert({teacher_id:y,student_id:m||null,title:S||(m?`Aula: ${b.find(c=>c.id===m)?.name}`:"Aula"),start_time:a.toISOString(),end_time:d.toISOString(),color:"#58317E"}).select("*, student:students(*)").single();if(s)throw s;v(c=>[...c,o]),l(!1)}catch(o){alert("Erro ao agendar aula."),console.error(o)}finally{k(!1)}},Q=()=>{const t=p.getFullYear(),a=p.getMonth(),i=H(t,a),g=R(t,a),d=[];for(let o=0;o<g;o++)d.push(e.jsx("div",{className:"calendar-day empty"},`empty-${o}`));for(let o=1;o<=i;o++){const s=new Date(t,a,o),c=new Date().toDateString()===s.toDateString(),f=I.filter(n=>new Date(n.start_time).toDateString()===s.toDateString()).sort((n,T)=>n.start_time.localeCompare(T.start_time));d.push(e.jsxs("div",{className:`calendar-day ${c?"today":""}`,onClick:()=>Y(s),children:[e.jsx("span",{className:"day-number",children:o}),e.jsxs("div",{className:"event-stack",children:[f.slice(0,3).map(n=>e.jsxs("div",{className:"event-pill",title:n.title,children:[new Date(n.start_time).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})," - ",n.student?.name||n.title]},n.id)),f.length>3&&e.jsxs("div",{className:"event-more",children:["+",f.length-3," mais"]})]})]},o))}return d};return E?e.jsx("div",{className:"calendar-loading",children:"Carregando Agenda..."}):e.jsxs("div",{className:"calendar-wrapper",children:[e.jsxs("header",{className:"calendar-header",children:[e.jsx("div",{children:e.jsx("h2",{className:"calendar-month-title",children:p.toLocaleString("pt-BR",{month:"long",year:"numeric"})})}),e.jsxs("div",{className:"calendar-nav-btns",children:[e.jsx("button",{onClick:()=>x(new Date),className:"btn-today",children:"Hoje"}),e.jsx("button",{onClick:()=>z(-1),className:"nav-btn",children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})})}),e.jsx("button",{onClick:()=>z(1),className:"nav-btn",children:e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"9 18 15 12 9 6"})})})]})]}),e.jsx("div",{className:"weekday-header",children:["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map(t=>e.jsx("div",{className:"weekday-label",children:t},t))}),e.jsx("div",{className:"calendar-grid",children:Q()}),L&&e.jsx("div",{className:"modal-overlay",onClick:t=>t.target===t.currentTarget&&l(!1),children:e.jsxs("div",{className:"modal-box",children:[e.jsxs("div",{className:"modal-header",children:[e.jsxs("h3",{children:["Agendar Aula — ",h?.toLocaleDateString("pt-BR")]}),e.jsx("button",{onClick:()=>l(!1),className:"close-btn",children:"✕"})]}),e.jsxs("form",{onSubmit:$,className:"modal-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Aluno"}),e.jsxs("select",{value:m,onChange:t=>N(t.target.value),className:"form-input",children:[e.jsx("option",{value:"",children:"Selecione um aluno (opcional)"}),b.map(t=>e.jsxs("option",{value:t.id,children:[t.name," (",t.language,")"]},t.id))]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Título (Opcional)"}),e.jsx("input",{type:"text",placeholder:"Ex: Aula de Conversação",value:S,onChange:t=>D(t.target.value),className:"form-input"})]}),e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Horário"}),e.jsx("input",{type:"time",value:C,onChange:t=>O(t.target.value),className:"form-input",required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Duração (minutos)"}),e.jsxs("select",{value:A,onChange:t=>q(t.target.value),className:"form-input",children:[e.jsx("option",{value:"30",children:"30 min"}),e.jsx("option",{value:"45",children:"45 min"}),e.jsx("option",{value:"60",children:"1h"}),e.jsx("option",{value:"90",children:"1h 30min"}),e.jsx("option",{value:"120",children:"2h"})]})]})]}),e.jsxs("div",{className:"modal-actions",children:[e.jsx("button",{type:"button",onClick:()=>l(!1),className:"btn-cancel",children:"Cancelar"}),e.jsx("button",{type:"submit",disabled:j,className:"btn-confirm",children:j?"Agendando...":"Confirmar Agenda"})]})]})]})}),e.jsx("style",{children:`
                .calendar-wrapper {
                    background: white;
                    border-radius: 1.5rem;
                    border: 1px solid var(--color-slate-border);
                    padding: 1.5rem;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
                }
                .calendar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .calendar-month-title {
                    font-family: var(--font-outfit);
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--color-slate-dark);
                    text-transform: capitalize;
                }
                .calendar-nav-btns {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                }
                .nav-btn, .btn-today {
                    background: var(--color-ice);
                    border: 1px solid var(--color-slate-border);
                    color: var(--color-slate-dark);
                    padding: 0.5rem;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-weight: 600;
                    font-size: 0.85rem;
                }
                .btn-today { padding: 0.5rem 1rem; }
                .nav-btn:hover, .btn-today:hover { background: white; border-color: var(--color-brand); }

                .weekday-header {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    margin-bottom: 0.5rem;
                }
                .weekday-label {
                    text-align: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--color-slate-mid);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 1px;
                    background: var(--color-slate-border);
                    border: 1px solid var(--color-slate-border);
                    border-radius: 1rem;
                    overflow: hidden;
                }
                .calendar-day {
                    background: white;
                    min-height: 120px;
                    padding: 0.75rem;
                    cursor: pointer;
                    transition: background 0.15s;
                    position: relative;
                }
                .calendar-day:hover { background: #F8FAFC; }
                .calendar-day.empty { background: #FAFAFA; cursor: default; }
                .calendar-day.today { background: rgba(88,49,126,0.03); }
                .calendar-day.today .day-number {
                    background: var(--color-brand);
                    color: white;
                    width: 24px; height: 24px;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 6px;
                }

                .day-number {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--color-slate-dark);
                }

                .event-stack {
                    margin-top: 0.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .event-pill {
                    background: var(--color-brand);
                    color: white;
                    font-size: 0.7rem;
                    padding: 0.2rem 0.4rem;
                    border-radius: 4px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .event-more {
                    font-size: 0.65rem;
                    color: var(--color-slate-mid);
                    font-weight: 600;
                    padding-left: 0.2rem;
                }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(30,41,59,0.5);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                }
                .modal-box {
                    background: white;
                    padding: 2rem;
                    border-radius: 1.5rem;
                    width: 100%;
                    max-width: 450px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .modal-header h3 {
                    font-family: var(--font-outfit);
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: var(--color-slate-dark);
                }
                .close-btn { background: none; border: none; font-size: 1.25rem; cursor: pointer; color: var(--color-slate-mid); }
                
                .modal-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }
                .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
                .form-group label { font-size: 0.8rem; font-weight: 700; color: var(--color-slate-dark); }
                .form-input {
                    padding: 0.75rem 1rem;
                    border-radius: 0.75rem;
                    border: 1px solid var(--color-slate-border);
                    background: var(--color-ice);
                    font-size: 0.9rem;
                    outline: none;
                }
                .form-input:focus { border-color: var(--color-brand); box-shadow: 0 0 0 3px rgba(88,49,126,0.1); }
                .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    margin-top: 1rem;
                }
                .btn-cancel {
                    padding: 0.6rem 1.25rem;
                    border-radius: 0.75rem;
                    border: 1px solid var(--color-slate-border);
                    background: white;
                    font-weight: 600;
                    cursor: pointer;
                }
                .btn-confirm {
                    padding: 0.6rem 1.5rem;
                    border-radius: 0.75rem;
                    background: var(--color-action);
                    color: white;
                    border: none;
                    font-weight: 700;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .btn-confirm:hover { transform: translateY(-2px); }
                .btn-confirm:disabled { opacity: 0.6; cursor: not-allowed; }

                .calendar-loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 400px;
                    font-family: var(--font-outfit);
                    font-weight: 700;
                    color: var(--color-brand);
                }
            `})]})}export{G as default};
