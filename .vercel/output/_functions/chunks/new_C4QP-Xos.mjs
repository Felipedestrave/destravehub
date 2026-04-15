import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_B_DQSMrb.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { s as supabase } from './supabase_Cb0dhCq8.mjs';

const PROFICIENCY_LEVELS = [
  "Iniciante",
  "Básico",
  "Intermediário",
  "Avançado"
];
const LANGUAGES = [
  "Japonês",
  "Inglês",
  "Espanhol",
  "Francês",
  "Alemão",
  "Italiano",
  "Outro"
];
function AddStudentForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    language: "Japonês",
    level: "Iniciante",
    notes: ""
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sessão expirada. Faça login novamente.");
      const response = await fetch("/api/admin/create-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          language: formData.language,
          level: formData.level,
          metadata: { notes: formData.notes }
        })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Erro ao criar aluno.");
      }
      const params = new URLSearchParams({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      window.location.href = `/dashboard/students/success?${params.toString()}`;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "add-student-form", children: [
    /* @__PURE__ */ jsxs("div", { className: "form-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "form-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "section-title", children: "Credenciais de Acesso" }),
        /* @__PURE__ */ jsx("p", { className: "section-desc", children: "Essas informações serão usadas pelo aluno para entrar na plataforma." }),
        /* @__PURE__ */ jsxs("div", { className: "field-group", children: [
          /* @__PURE__ */ jsx("label", { className: "field-label", children: "Nome Completo *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "name",
              value: formData.name,
              onChange: handleChange,
              required: true,
              className: "field-input",
              placeholder: "Ex: Yuki Tanaka"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "field-grid", children: [
          /* @__PURE__ */ jsxs("div", { className: "field-group", children: [
            /* @__PURE__ */ jsx("label", { className: "field-label", children: "E-mail *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                name: "email",
                value: formData.email,
                onChange: handleChange,
                required: true,
                className: "field-input",
                placeholder: "aluno@email.com"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "field-group", children: [
            /* @__PURE__ */ jsx("label", { className: "field-label", children: "Senha Inicial *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                name: "password",
                value: formData.password,
                onChange: handleChange,
                required: true,
                className: "field-input",
                placeholder: "Mínimo 6 caracteres"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "form-divider" }),
      /* @__PURE__ */ jsxs("div", { className: "form-section", children: [
        /* @__PURE__ */ jsx("h3", { className: "section-title", children: "Perfil Pedagógico" }),
        /* @__PURE__ */ jsx("p", { className: "section-desc", children: "Defina o foco e o nível atual do aluno." }),
        /* @__PURE__ */ jsxs("div", { className: "field-grid", children: [
          /* @__PURE__ */ jsxs("div", { className: "field-group", children: [
            /* @__PURE__ */ jsx("label", { className: "field-label", children: "Idioma" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                name: "language",
                value: formData.language,
                onChange: handleChange,
                className: "field-input",
                children: LANGUAGES.map((lang) => /* @__PURE__ */ jsx("option", { value: lang, children: lang }, lang))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "field-group", children: [
            /* @__PURE__ */ jsx("label", { className: "field-label", children: "Nível de Proficiência" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                name: "level",
                value: formData.level,
                onChange: handleChange,
                className: "field-input",
                children: PROFICIENCY_LEVELS.map((lvl) => /* @__PURE__ */ jsx("option", { value: lvl, children: lvl }, lvl))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "field-group", children: [
          /* @__PURE__ */ jsx("label", { className: "field-label", children: "Notas Internas (Opcional)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              name: "notes",
              value: formData.notes,
              onChange: handleChange,
              className: "field-input textarea",
              placeholder: "Ex: Aluno focado em conversação para viagem.",
              rows: 3
            }
          )
        ] })
      ] }),
      error && /* @__PURE__ */ jsxs("div", { className: "form-error", children: [
        /* @__PURE__ */ jsx("span", { className: "error-icon", children: "⚠️" }),
        error
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "form-actions", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => window.history.back(),
            className: "btn-ghost",
            disabled: loading,
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "btn-action",
            disabled: loading,
            children: loading ? "Criando Conta..." : "Cadastrar Aluno"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
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
            ` })
  ] });
}

const $$New = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Novo Aluno — Destrave Hub", "activeNav": "students", "data-astro-cid-u6qoqh5k": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="registration-header" data-astro-cid-u6qoqh5k> <div class="breadcrumb" data-astro-cid-u6qoqh5k> <a href="/dashboard" data-astro-cid-u6qoqh5k>Dashboard</a> <span class="chevron" data-astro-cid-u6qoqh5k>›</span> <span class="current" data-astro-cid-u6qoqh5k>Novo Aluno</span> </div> <h1 class="page-title" data-astro-cid-u6qoqh5k>Cadastrar Novo Aluno</h1> <p class="page-subtitle" data-astro-cid-u6qoqh5k>Configure a conta oficial do seu aluno para começar as missões.</p> </div> ${renderComponent($$result2, "AddStudentForm", AddStudentForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/dashboard/AddStudentForm.tsx", "client:component-export": "default", "data-astro-cid-u6qoqh5k": true })} ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/students/new.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/students/new.astro";
const $$url = "/dashboard/students/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$New,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
