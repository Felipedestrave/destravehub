import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { r as renderScript } from './script_DB7th2uj.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_B_DQSMrb.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect, useCallback } from 'react';
import { s as supabase } from './supabase_Cb0dhCq8.mjs';
import { MoreVertical, TrendingUp, Edit2, Link, Trash2, X, CheckCircle2, PlayCircle, Clock, Trophy, Target, User } from 'lucide-react';
import { S as STORE_ITEMS } from './store_BEgSzlvS.mjs';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [teacherId, setTeacherId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLanguage, setEditLanguage] = useState("");
  const [editLevel, setEditLevel] = useState("");
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const fetchStudents = useCallback(async (tid) => {
    const { data } = await supabase.from("students").select("*").eq("teacher_id", tid).order("created_at", { ascending: false });
    setStudents(data ?? []);
  }, []);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = "/auth/login";
        return;
      }
      setTeacherId(session.user.id);
      fetchStudents(session.user.id).finally(() => setLoading(false));
    });
  }, [fetchStudents]);
  const openEditModal = (student) => {
    setStudentToEdit(student);
    setEditName(student.name);
    setEditLanguage(student.language ?? "Japonês");
    setEditLevel(student.level ?? "Iniciante");
    setActiveDropdown(null);
  };
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    if (!studentToEdit) return;
    const { data, error } = await supabase.from("students").update({ name: editName, language: editLanguage, level: editLevel }).eq("id", studentToEdit.id).select().single();
    if (error) {
      console.error("Erro ao atualizar aluno:", error);
      alert("Não foi possível atualizar o aluno.");
      return;
    }
    setStudents((prev) => prev.map((s) => s.id === data.id ? data : s));
    setStudentToEdit(null);
  };
  const openDeleteModal = (student) => {
    setStudentToDelete(student);
    setActiveDropdown(null);
  };
  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    const { error } = await supabase.from("students").delete().eq("id", studentToDelete.id);
    if (error) {
      console.error("Erro ao excluir aluno:", error);
      alert("Não foi possível excluir. O aluno pode estar vinculado a atividades.");
      return;
    }
    setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
    setStudentToDelete(null);
  };
  const copyLink = (uuid) => {
    if (!uuid) return;
    const url = `${window.location.origin}/play/experimental/${uuid}`;
    navigator.clipboard.writeText(url);
    alert("Link copiado para a área de transferência!");
    setActiveDropdown(null);
  };
  const levelColor = {
    // Old JLPT
    N5: "#64748B",
    N4: "#22C55E",
    N3: "#3B82F6",
    N2: "#F59E0B",
    N1: "#EF4444",
    // Generic (New)
    "Iniciante": "#64748B",
    "Básico": "#22C55E",
    "Intermediário": "#3B82F6",
    "Avançado": "#EF4444"
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "students-loading", children: [
      /* @__PURE__ */ jsx("div", { className: "students-spinner" }),
      /* @__PURE__ */ jsx("p", { children: "Carregando alunos…" })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "students-header", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "students-title", children: "Seus Alunos" }),
        /* @__PURE__ */ jsx("p", { className: "students-subtitle", children: students.length === 0 ? "Nenhum aluno cadastrado ainda." : `${students.length} aluno${students.length > 1 ? "s" : ""} cadastrado${students.length > 1 ? "s" : ""}.` })
      ] }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/dashboard/students/new",
          id: "add-student-btn",
          className: "btn-action",
          style: { textDecoration: "none" },
          children: "+ Novo Aluno"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "stats-row", children: [
      /* @__PURE__ */ jsxs("div", { className: "stat-card", children: [
        /* @__PURE__ */ jsx("p", { className: "stat-label", children: "Total de Alunos" }),
        /* @__PURE__ */ jsx("p", { className: "stat-value", style: { color: "var(--color-brand)" }, children: students.length })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "stat-card", children: [
        /* @__PURE__ */ jsx("p", { className: "stat-label", children: "Contas Ativas" }),
        /* @__PURE__ */ jsx("p", { className: "stat-value", style: { color: "var(--color-brand)" }, children: students.filter((s) => s.student_id).length })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "stat-card", children: [
        /* @__PURE__ */ jsx("p", { className: "stat-label", children: "Experimentais" }),
        /* @__PURE__ */ jsx("p", { className: "stat-value", style: { color: "var(--color-slate-mid)" }, children: students.filter((s) => s.experimental_uuid).length })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "stat-card", children: [
        /* @__PURE__ */ jsx("p", { className: "stat-label", children: "Foco Atual" }),
        /* @__PURE__ */ jsx("p", { className: "stat-value", style: { color: "#22C55E", fontSize: "1.25rem", display: "flex", alignItems: "center" }, children: students.length > 0 ? students[0]?.language ?? "Japonês" : "—" })
      ] })
    ] }),
    students.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "students-empty", children: [
      /* @__PURE__ */ jsx("div", { className: "empty-icon", children: "👥" }),
      /* @__PURE__ */ jsx("h3", { className: "empty-title", children: "Nenhum aluno cadastrado" }),
      /* @__PURE__ */ jsx("p", { className: "empty-desc", children: "Registre seus primeiros alunos para começar a enviar missões interativas." }),
      /* @__PURE__ */ jsx("a", { href: "/dashboard/students/new", className: "btn-action", style: { textDecoration: "none" }, children: "Registrar Primeiro Aluno" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "students-grid", ref: dropdownRef, children: students.map((student) => /* @__PURE__ */ jsxs("div", { className: "student-card", children: [
      /* @__PURE__ */ jsx("div", { className: "student-avatar", children: student.name.charAt(0).toUpperCase() }),
      /* @__PURE__ */ jsxs("div", { className: "student-info", children: [
        /* @__PURE__ */ jsx("p", { className: "student-name", children: student.name }),
        /* @__PURE__ */ jsxs("p", { className: "student-meta flex items-center gap-1", children: [
          student.student_id ? "✅ Conta oficial" : "🔗 Link único",
          student.language && ` • 🗣️ ${student.language}`
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "span",
        {
          className: "student-level hidden sm:inline-flex",
          style: { borderColor: levelColor[student.level ?? "Iniciante"] ?? "#64748B", color: levelColor[student.level ?? "Iniciante"] ?? "#64748B" },
          children: student.level ?? "Iniciante"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "action-menu-container", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "kebab-btn",
            onClick: () => setActiveDropdown(activeDropdown === student.id ? null : student.id),
            children: /* @__PURE__ */ jsx(MoreVertical, { size: 20, className: "text-slate-400 hover:text-brand" })
          }
        ),
        activeDropdown === student.id && /* @__PURE__ */ jsxs("div", { className: "dropdown-panel animation-fade-in shadow-xl", children: [
          /* @__PURE__ */ jsxs("a", { href: `/dashboard/students/${student.id}`, className: "dropdown-item", children: [
            /* @__PURE__ */ jsx(TrendingUp, { size: 16 }),
            " Ver Perfil"
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => openEditModal(student), className: "dropdown-item", children: [
            /* @__PURE__ */ jsx(Edit2, { size: 16 }),
            " Editar Aluno"
          ] }),
          !student.student_id && student.experimental_uuid && /* @__PURE__ */ jsxs("button", { onClick: () => copyLink(student.experimental_uuid), className: "dropdown-item", children: [
            /* @__PURE__ */ jsx(Link, { size: 16 }),
            " Copiar Link"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "dropdown-divider" }),
          /* @__PURE__ */ jsxs("button", { onClick: () => openDeleteModal(student), className: "dropdown-item danger", children: [
            /* @__PURE__ */ jsx(Trash2, { size: 16 }),
            " Excluir"
          ] })
        ] })
      ] })
    ] }, student.id)) }),
    studentToEdit && /* @__PURE__ */ jsx("div", { className: "modal-overlay", children: /* @__PURE__ */ jsxs("div", { className: "modal-content animation-bounce-in max-w-md w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-outfit text-2xl font-black text-slate-dark", children: "Editar Aluno" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setStudentToEdit(null), className: "text-slate-400 hover:text-slate-dark", children: /* @__PURE__ */ jsx(X, { size: 24 }) })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleUpdateStudent, className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-mid uppercase mb-2", children: "Nome do Aluno" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: editName,
              onChange: (e) => setEditName(e.target.value),
              className: "w-full border-2 border-slate-200 rounded-xl p-3 font-outfit font-bold outline-none focus:border-brand",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-mid uppercase mb-2", children: "Foco/Idioma" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: editLanguage,
                onChange: (e) => setEditLanguage(e.target.value),
                className: "w-full border-2 border-slate-200 rounded-xl p-3 font-outfit font-bold outline-none focus:border-brand",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "Japonês", children: "Japonês" }),
                  /* @__PURE__ */ jsx("option", { value: "Inglês", children: "Inglês" }),
                  /* @__PURE__ */ jsx("option", { value: "Espanhol", children: "Espanhol" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-mid uppercase mb-2", children: "Nível" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: editLevel,
                onChange: (e) => setEditLevel(e.target.value),
                className: "w-full border-2 border-slate-200 rounded-xl p-3 font-outfit font-bold outline-none focus:border-brand",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "Iniciante", children: "Iniciante" }),
                  /* @__PURE__ */ jsx("option", { value: "Básico", children: "Básico" }),
                  /* @__PURE__ */ jsx("option", { value: "Intermediário", children: "Intermediário" }),
                  /* @__PURE__ */ jsx("option", { value: "Avançado", children: "Avançado" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "submit", className: "mt-4 w-full bg-brand text-white font-outfit font-black py-4 rounded-xl flex justify-center items-center gap-2 hover:opacity-90 transition-all", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { size: 20 }),
          " Salvar Alterações"
        ] })
      ] })
    ] }) }),
    studentToDelete && /* @__PURE__ */ jsx("div", { className: "modal-overlay", children: /* @__PURE__ */ jsxs("div", { className: "modal-content animation-bounce-in max-w-sm w-full text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(Trash2, { size: 32, className: "text-red-500" }) }),
      /* @__PURE__ */ jsx("h2", { className: "font-outfit text-2xl font-black text-slate-dark mb-2", children: "Excluir Aluno?" }),
      /* @__PURE__ */ jsxs("p", { className: "text-slate-mid text-sm mb-6", children: [
        "Você tem certeza que deseja excluir ",
        /* @__PURE__ */ jsx("b", { children: studentToDelete.name }),
        "? O histórico de missões deste aluno não poderá ser recuperado."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setStudentToDelete(null),
            className: "flex-1 border-2 border-slate-200 text-slate-dark font-outfit font-bold py-3 rounded-xl hover:bg-slate-50 transition-all",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleDeleteStudent,
            className: "flex-1 bg-red-500 text-white font-outfit font-bold py-3 rounded-xl hover:bg-red-600 transition-all",
            children: "Sim, Excluir"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
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
            ` })
  ] });
}

function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchActivities() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const response = await fetch("/api/teacher/recent-activity", {
          headers: {
            "Authorization": `Bearer ${session.access_token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setActivities(data.activities || []);
        }
      } catch (err) {
        console.error("[RecentActivity] Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
    const interval = setInterval(fetchActivities, 6e4);
    return () => clearInterval(interval);
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-white/60 backdrop-blur-md rounded-3xl border border-slate-border p-6 animate-pulse", children: [
      /* @__PURE__ */ jsx("div", { className: "h-4 w-32 bg-slate-100 rounded mb-4" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 bg-slate-100 rounded-2xl" }),
        /* @__PURE__ */ jsx("div", { className: "h-12 bg-slate-100 rounded-2xl" })
      ] })
    ] });
  }
  if (activities.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "mb-8 bg-white/60 backdrop-blur-md rounded-3xl border border-slate-border p-6 shadow-sm overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(PlayCircle, { size: 18, className: "text-brand" }) }),
        /* @__PURE__ */ jsx("h2", { className: "font-outfit font-bold text-slate-dark text-lg", children: "Atividades Recentes" })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-brand bg-brand/5 px-3 py-1 rounded-full border border-brand/10", children: "Tempo Real" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: activities.map((item) => {
      const studentName = item.students?.name || "Desconhecido";
      const activityTitle = item.activities?.title || "Atividade";
      const score = item.result_data?.score || 0;
      const isReplay = item.result_data?.is_practice || false;
      const date = item.completed_at ? new Date(item.completed_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "";
      const fullDate = item.completed_at ? new Date(item.completed_at).toLocaleDateString("pt-BR") : "";
      return /* @__PURE__ */ jsxs("div", { className: "group relative flex items-center gap-4 bg-white border border-slate-border p-4 rounded-2xl hover:border-brand/40 hover:shadow-md transition-all duration-300", children: [
        /* @__PURE__ */ jsx("div", { className: `w-12 h-12 ${isReplay ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`, children: isReplay ? /* @__PURE__ */ jsx(Clock, { size: 24 }) : /* @__PURE__ */ jsx(Trophy, { size: 24 }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-dark truncate", children: studentName }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-mid truncate", children: [
            "Concluiu: ",
            activityTitle
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400", children: [
              fullDate,
              " às ",
              date
            ] }),
            isReplay && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 rounded", children: "PRÁTICA" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxs("p", { className: `text-lg font-black font-outfit ${score >= 70 ? "text-green-600" : "text-orange-600"}`, children: [
          score,
          "%"
        ] }) })
      ] }, item.id);
    }) })
  ] });
}

function MissionList() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        setProfile(profileData);
        const response = await fetch("/api/student/missions", {
          headers: {
            "Authorization": `Bearer ${session.access_token}`
          }
        });
        if (!response.ok) {
          throw new Error("Falha ao carregar missões");
        }
        const data = await response.json();
        setMissions(data.missions || []);
      } catch (err) {
        console.error("[MissionList] Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return /* @__PURE__ */ jsx("span", { className: "status-badge completed", children: "Concluída" });
      case "in_progress":
        return /* @__PURE__ */ jsx("span", { className: "status-badge in-progress", children: "Em andamento" });
      default:
        return /* @__PURE__ */ jsx("span", { className: "status-badge pending", children: "Pendente" });
    }
  };
  const getTypeIcon = (type) => {
    switch (type) {
      case "escuta":
        return "🎧";
      case "mrp":
        return "🎭";
      case "flashcards":
        return "🃏";
      default:
        return "📄";
    }
  };
  const handleStartMission = (mission) => {
    if (!mission.activities) {
      alert("Esta atividade ainda não teve as permissões de acesso liberadas pelo seu professor.");
      return;
    }
    const type = mission.activities.type;
    if (type === "escuta") window.location.href = `/dashboard/missions/escuta?assignment=${mission.id}`;
    if (type === "mrp") window.location.href = `/dashboard/missions/mrp?assignment=${mission.id}`;
    if (type === "flashcards") window.location.href = `/dashboard/missions/flashcards?assignment=${mission.id}`;
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "loading-container", children: /* @__PURE__ */ jsx("div", { className: "spinner" }) });
  }
  if (profile?.role === "teacher") {
    return /* @__PURE__ */ jsxs("div", { className: "message-card", children: [
      /* @__PURE__ */ jsx("h3", { children: "Visão de Professor" }),
      /* @__PURE__ */ jsx("p", { children: 'Como professor, você deve gerenciar seus alunos na aba "Alunos" para ver o progresso deles.' }),
      /* @__PURE__ */ jsx("a", { href: "/dashboard", className: "btn-action", children: "Ver Alunos" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "missions-container", children: [
    /* @__PURE__ */ jsxs("div", { className: "header-section", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2 mb-1", children: [
        /* @__PURE__ */ jsx("h1", { className: "title", style: { margin: 0 }, children: "Minhas Missões" }),
        profile?.equipped?.title && /* @__PURE__ */ jsx("span", { className: "equipped-title-tag", children: STORE_ITEMS.find((i) => i.id === profile.equipped.title)?.name || "" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "subtitle", children: [
        "Olá, ",
        /* @__PURE__ */ jsx("strong", { children: profile?.full_name?.split(" ")[0] || "Aluno" }),
        "! Mergulhe no japonês com as tarefas preparadas pelo seu professor."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "stats-row", children: [
      /* @__PURE__ */ jsxs("div", { className: "stat-card balance-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: "1rem" }, children: "🪙" }),
          /* @__PURE__ */ jsx("p", { className: "stat-label", style: { margin: 0 }, children: "Meus Coins" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "stat-value", style: { color: "#d97706" }, children: [
          profile?.coins || 0,
          " ",
          /* @__PURE__ */ jsx("span", { className: "dc-label", children: "DC" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "stat-card balance-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: "1rem" }, children: "⚡" }),
          /* @__PURE__ */ jsx("p", { className: "stat-label", style: { margin: 0 }, children: "Nível XP" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "stat-value", style: { color: "#4f46e5" }, children: [
          profile?.xp || 0,
          " ",
          /* @__PURE__ */ jsx("span", { className: "dc-label", children: "XP" })
        ] })
      ] })
    ] }),
    missions.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "empty-state", children: [
      /* @__PURE__ */ jsx("div", { className: "empty-icon", children: "📂" }),
      /* @__PURE__ */ jsx("h2", { className: "empty-title", children: "Nenhuma missão encontrada" }),
      /* @__PURE__ */ jsxs("p", { className: "empty-desc", children: [
        "Seu professor ainda não enviou tarefas para sua conta: ",
        /* @__PURE__ */ jsx("strong", { children: profile?.full_name || "Usuário" })
      ] })
    ] }) : /* @__PURE__ */ jsx("div", { className: "mission-grid", children: missions.map((mission) => {
      const config = mission.activities?.config || {};
      const language = config.language || "Japonês";
      const level = config.level || "Iniciante";
      const dateStr = mission.assigned_at ? new Date(mission.assigned_at).toLocaleDateString("pt-BR") : "—";
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: `mission-card ${mission.status === "completed" ? "completed-card" : ""}`,
          onClick: () => handleStartMission(mission),
          children: [
            /* @__PURE__ */ jsx("div", { className: "mission-type-icon", children: getTypeIcon(mission.activities?.type || "escuta") }),
            /* @__PURE__ */ jsxs("div", { className: "mission-content", children: [
              /* @__PURE__ */ jsxs("div", { className: "mission-header", children: [
                /* @__PURE__ */ jsx("h3", { className: "mission-title", children: mission.activities?.title || "Missão Sem Título" }),
                getStatusBadge(mission.status)
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mission-footer", children: [
                /* @__PURE__ */ jsxs("span", { className: "mission-meta", children: [
                  "🗣️ ",
                  language
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "mission-meta", children: [
                  "📊 ",
                  level
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "mission-meta", children: [
                  "📅 ",
                  dateStr
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mission-arrow", children: /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "m9 18 6-6-6-6" }) }) })
          ]
        },
        mission.id
      );
    }) }),
    /* @__PURE__ */ jsx("style", { children: `
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
      ` })
  ] });
}

const AgendaView = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAgenda = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const { data: student } = await supabase.from("students").select("id").eq("student_id", session.user.id).single();
        if (!student) return;
        const { data: appointments } = await supabase.from("appointments").select("*").eq("student_id", student.id).gte("start_time", (/* @__PURE__ */ new Date()).toISOString()).order("start_time", { ascending: true });
        const { data: missions } = await supabase.from("assignments").select("*, activities(title, type)").eq("student_id", student.id).eq("status", "pending").order("assigned_at", { ascending: false }).limit(5);
        const agendaItems = [];
        appointments?.forEach((app) => {
          agendaItems.push({
            id: app.id,
            type: "class",
            title: app.title,
            date: new Date(app.start_time),
            time: new Date(app.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            meta: app.description || void 0
          });
        });
        missions?.forEach((miss) => {
          agendaItems.push({
            id: miss.id,
            type: "mission",
            title: miss.activities?.title || "Missão Sem Título",
            date: new Date(miss.assigned_at || Date.now()),
            status: miss.status || void 0,
            meta: miss.activities?.type || void 0
          });
        });
        agendaItems.sort((a, b) => a.date.getTime() - b.date.getTime());
        setItems(agendaItems);
      } catch (err) {
        console.error("[AgendaView] Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgenda();
  }, []);
  if (loading) return /* @__PURE__ */ jsx("div", { className: "agenda-loading", children: "Sincronizando agenda..." });
  if (items.length === 0) return /* @__PURE__ */ jsxs("div", { className: "agenda-empty", children: [
    /* @__PURE__ */ jsx("div", { className: "empty-glow", children: "✨" }),
    /* @__PURE__ */ jsx("h3", { children: "Sua agenda está livre!" }),
    /* @__PURE__ */ jsx("p", { children: "Aproveite para revisar seus itens na loja ou praticar no modo livre." })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "agenda-container", children: [
    /* @__PURE__ */ jsx("h2", { className: "agenda-title", children: "Programação Próxima" }),
    /* @__PURE__ */ jsx("div", { className: "timeline", children: items.map((item, idx) => {
      const isToday = item.date.toDateString() === (/* @__PURE__ */ new Date()).toDateString();
      return /* @__PURE__ */ jsxs("div", { className: `timeline-item ${item.type}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "timeline-left", children: [
          /* @__PURE__ */ jsxs("div", { className: "time-box", children: [
            isToday ? /* @__PURE__ */ jsx("span", { className: "today-badge", children: "HOJE" }) : /* @__PURE__ */ jsx("span", { className: "date-label", children: item.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) }),
            /* @__PURE__ */ jsx("span", { className: "hour-label", children: item.time || "—" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "line-node" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "timeline-content", children: /* @__PURE__ */ jsxs("div", { className: "content-card", children: [
          /* @__PURE__ */ jsx("div", { className: "card-icon", children: item.type === "class" ? /* @__PURE__ */ jsx(Clock, { size: 16 }) : /* @__PURE__ */ jsx(Target, { size: 16 }) }),
          /* @__PURE__ */ jsxs("div", { className: "card-info", children: [
            /* @__PURE__ */ jsx("div", { className: "card-type-label", children: item.type === "class" ? "AULA AGENDADA" : "MISSÃO PENDENTE" }),
            /* @__PURE__ */ jsx("h4", { className: "card-title", children: item.title }),
            item.meta && item.type === "class" && /* @__PURE__ */ jsx("p", { className: "card-meta", children: item.meta })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "card-action-hint", children: /* @__PURE__ */ jsx(ChevronRight, { size: 18 }) })
        ] }) })
      ] }, item.id);
    }) }),
    /* @__PURE__ */ jsx("style", { children: `
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
            ` })
  ] });
};
const ChevronRight = ({ size }) => /* @__PURE__ */ jsx("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "m9 18 6-6-6-6" }) });

const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderScript($$result, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard.astro?astro&type=script&index=0&lang.ts")} ${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Dashboard — Destrave Hub", "activeNav": "students" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="teacher-view" class="hidden"> <div class="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8"> <header class="mb-8"> <h1 class="font-outfit text-3xl font-black text-slate-dark tracking-tight">Painel do Professor 🍎</h1> <p class="text-slate-mid mt-1 font-medium leading-relaxed">Gerencie seus alunos e acompanhe o progresso das missões em tempo real.</p> </header> ${renderComponent($$result2, "RecentActivity", RecentActivity, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/dashboard/RecentActivity", "client:component-export": "default" })} <div class="flex items-center gap-3 mb-6"> <div class="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/20"> ${renderComponent($$result2, "User", User, { "className": "text-white", "size": 20 })} </div> <div> <h2 class="font-outfit font-bold text-slate-dark text-xl leading-none">Meus Alunos</h2> <p class="text-slate-mid text-xs font-bold uppercase tracking-wider mt-1">Lista Completa</p> </div> </div> ${renderComponent($$result2, "StudentList", StudentList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/dashboard/StudentList", "client:component-export": "default" })} </div> </div> <div id="student-view" class="hidden"> <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"> <div class="grid grid-cols-1 lg:grid-cols-4 gap-8"> <div class="lg:col-span-3"> ${renderComponent($$result2, "MissionList", MissionList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/student/MissionList", "client:component-export": "default" })} </div> <div class="lg:col-span-1"> ${renderComponent($$result2, "AgendaView", AgendaView, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/student/AgendaView", "client:component-export": "AgendaView" })} </div> </div> </div> </div> ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Dashboard,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
