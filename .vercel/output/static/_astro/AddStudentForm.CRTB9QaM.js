import{j as e}from"./jsx-runtime.u17CrQMm.js";import{r as t}from"./index.DrBtkhmp.js";import{s as h}from"./materials.astro_astro_type_script_index_0_lang.CbpkQ25P.js";const g=["Iniciante","Básico","Intermediário","Avançado"],x=["Japonês","Inglês","Espanhol","Francês","Alemão","Italiano","Outro"];function N(){const[i,d]=t.useState(!1),[c,m]=t.useState(null),[a,u]=t.useState({name:"",email:"",password:"",language:"Japonês",level:"Iniciante",notes:""}),s=r=>{const{name:o,value:l}=r.target;u(n=>({...n,[o]:l}))},p=async r=>{r.preventDefault(),d(!0),m(null);try{const{data:{session:o}}=await h.auth.getSession();if(!o)throw new Error("Sessão expirada. Faça login novamente.");const l=await fetch("/api/admin/create-student",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o.access_token}`},body:JSON.stringify({name:a.name,email:a.email,password:a.password,language:a.language,level:a.level,metadata:{notes:a.notes}})}),n=await l.json();if(!l.ok)throw new Error(n.error||"Erro ao criar aluno.");const f=new URLSearchParams({name:a.name,email:a.email,password:a.password});window.location.href=`/dashboard/students/success?${f.toString()}`}catch(o){m(o.message),d(!1)}};return e.jsxs("form",{onSubmit:p,className:"add-student-form",children:[e.jsxs("div",{className:"form-card",children:[e.jsxs("div",{className:"form-section",children:[e.jsx("h3",{className:"section-title",children:"Credenciais de Acesso"}),e.jsx("p",{className:"section-desc",children:"Essas informações serão usadas pelo aluno para entrar na plataforma."}),e.jsxs("div",{className:"field-group",children:[e.jsx("label",{className:"field-label",children:"Nome Completo *"}),e.jsx("input",{type:"text",name:"name",value:a.name,onChange:s,required:!0,className:"field-input",placeholder:"Ex: Yuki Tanaka"})]}),e.jsxs("div",{className:"field-grid",children:[e.jsxs("div",{className:"field-group",children:[e.jsx("label",{className:"field-label",children:"E-mail *"}),e.jsx("input",{type:"email",name:"email",value:a.email,onChange:s,required:!0,className:"field-input",placeholder:"aluno@email.com"})]}),e.jsxs("div",{className:"field-group",children:[e.jsx("label",{className:"field-label",children:"Senha Inicial *"}),e.jsx("input",{type:"password",name:"password",value:a.password,onChange:s,required:!0,className:"field-input",placeholder:"Mínimo 6 caracteres"})]})]})]}),e.jsx("div",{className:"form-divider"}),e.jsxs("div",{className:"form-section",children:[e.jsx("h3",{className:"section-title",children:"Perfil Pedagógico"}),e.jsx("p",{className:"section-desc",children:"Defina o foco e o nível atual do aluno."}),e.jsxs("div",{className:"field-grid",children:[e.jsxs("div",{className:"field-group",children:[e.jsx("label",{className:"field-label",children:"Idioma"}),e.jsx("select",{name:"language",value:a.language,onChange:s,className:"field-input",children:x.map(r=>e.jsx("option",{value:r,children:r},r))})]}),e.jsxs("div",{className:"field-group",children:[e.jsx("label",{className:"field-label",children:"Nível de Proficiência"}),e.jsx("select",{name:"level",value:a.level,onChange:s,className:"field-input",children:g.map(r=>e.jsx("option",{value:r,children:r},r))})]})]}),e.jsxs("div",{className:"field-group",children:[e.jsx("label",{className:"field-label",children:"Notas Internas (Opcional)"}),e.jsx("textarea",{name:"notes",value:a.notes,onChange:s,className:"field-input textarea",placeholder:"Ex: Aluno focado em conversação para viagem.",rows:3})]})]}),c&&e.jsxs("div",{className:"form-error",children:[e.jsx("span",{className:"error-icon",children:"⚠️"}),c]}),e.jsxs("div",{className:"form-actions",children:[e.jsx("button",{type:"button",onClick:()=>window.history.back(),className:"btn-ghost",disabled:i,children:"Cancelar"}),e.jsx("button",{type:"submit",className:"btn-action",disabled:i,children:i?"Criando Conta...":"Cadastrar Aluno"})]})]}),e.jsx("style",{children:`
                .add-student-form {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .form-card {
                    background: white;
                    border: 1px solid var(--color-slate-border);
                    border-radius: 1.5rem;
                    padding: 2.5rem;
                    box-shadow: var(--shadow-card);
                }
                .form-section {
                    margin-bottom: 2rem;
                }
                .section-title {
                    font-family: var(--font-outfit);
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--color-brand);
                    margin: 0 0 0.25rem;
                }
                .section-desc {
                    font-size: 0.875rem;
                    color: var(--color-slate-mid);
                    margin-bottom: 1.5rem;
                }
                .form-divider {
                    height: 1px;
                    background: var(--color-slate-border);
                    margin: 2rem 0;
                }
                .field-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-bottom: 1.25rem;
                }
                .field-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.25rem;
                }
                .field-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--color-slate-dark);
                }
                .field-input {
                    padding: 0.75rem 1rem;
                    border-radius: 0.75rem;
                    border: 1px solid var(--color-slate-border);
                    background: var(--color-ice);
                    color: var(--color-slate-dark);
                    font-size: 0.95rem;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .field-input:focus {
                    border-color: var(--color-brand);
                    box-shadow: 0 0 0 4px rgba(88, 49, 126, 0.1);
                }
                .field-input.textarea {
                    resize: vertical;
                    min-height: 80px;
                }
                .form-error {
                    background: #FEF2F2;
                    border: 1px solid #FEE2E2;
                    color: #B91C1C;
                    padding: 1rem;
                    border-radius: 0.75rem;
                    font-size: 0.9rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                
                @media (max-width: 640px) {
                    .field-grid {
                        grid-template-columns: 1fr;
                    }
                    .form-card {
                        padding: 1.5rem;
                    }
                }
            `})]})}export{N as default};
