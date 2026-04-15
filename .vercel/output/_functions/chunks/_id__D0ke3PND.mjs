import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_B_DQSMrb.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from './supabase_Cb0dhCq8.mjs';
import { l as lessonLogService } from './lesson-logs_C0KTxbjY.mjs';
import { TrendingUp, Clock, BookOpen, Plus, Calendar, Trash2, Award } from 'lucide-react';

const StudentDetail = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddLog, setShowAddLog] = useState(false);
  const [newTopics, setNewTopics] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    fetchData();
  }, [studentId]);
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: studentData } = await supabase.from("students").select("*, profiles:student_id(avatar_url, xp, coins, attendance_streak)").eq("id", studentId).single();
      setStudent(studentData);
      const logData = await lessonLogService.listForStudent(studentId);
      setLogs(logData);
    } catch (err) {
      console.error("Error fetching student details:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleAddLog = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const topicsArray = newTopics.split(",").map((t) => t.trim()).filter(Boolean);
      await lessonLogService.create({
        student_id: studentId,
        teacher_id: session.user.id,
        topics: topicsArray,
        notes: newNotes,
        date: (/* @__PURE__ */ new Date()).toISOString()
      });
      setNewTopics("");
      setNewNotes("");
      setShowAddLog(false);
      fetchData();
    } catch (err) {
      alert("Erro ao salvar log.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteLog = async (id) => {
    if (!confirm("Deseja excluir este log?")) return;
    try {
      await lessonLogService.delete(id);
      setLogs((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert("Erro ao excluir log.");
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-slate-mid", children: "Carregando mestre..." });
  if (!student) return /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-red-500", children: "Aluno não encontrado." });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border-2 border-slate-border p-6 shadow-xl flex flex-col md:flex-row gap-6 items-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-brand rounded-2xl flex items-center justify-center text-3xl text-white font-black shadow-lg", children: student.name.charAt(0).toUpperCase() }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 text-center md:text-left", children: [
        /* @__PURE__ */ jsx("h1", { className: "font-outfit text-3xl font-black text-slate-dark", children: student.name }),
        /* @__PURE__ */ jsxs("p", { className: "text-slate-mid font-bold flex items-center justify-center md:justify-start gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded bg-slate-100 text-xs border border-slate-200`, children: student.level || "N5" }),
          "• ",
          student.language || "Japonês"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-ice px-4 py-2 rounded-2xl border border-slate-border text-center min-w-[80px]", children: [
          /* @__PURE__ */ jsx(TrendingUp, { size: 16, className: "mx-auto text-brand mb-1" }),
          /* @__PURE__ */ jsx("span", { className: "block text-xs font-bold text-slate-mid uppercase", children: "XP" }),
          /* @__PURE__ */ jsx("span", { className: "block font-outfit font-black text-slate-dark", children: student.profiles?.xp || 0 })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-ice px-4 py-2 rounded-2xl border border-slate-border text-center min-w-[80px]", children: [
          /* @__PURE__ */ jsx(Clock, { size: 16, className: "mx-auto text-blue-500 mb-1" }),
          /* @__PURE__ */ jsx("span", { className: "block text-xs font-bold text-slate-mid uppercase", children: "Aulas" }),
          /* @__PURE__ */ jsx("span", { className: "block font-outfit font-black text-slate-dark", children: student.profiles?.attendance_streak || 0 })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center px-2", children: [
          /* @__PURE__ */ jsxs("h2", { className: "font-outfit text-xl font-black text-slate-dark flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(BookOpen, { size: 20, className: "text-brand" }),
            " Registro do Sensei"
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setShowAddLog(!showAddLog),
              className: "px-4 py-2 bg-brand text-white rounded-xl font-outfit font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsx(Plus, { size: 16 }),
                " Novo Log"
              ]
            }
          )
        ] }),
        showAddLog && /* @__PURE__ */ jsxs("form", { onSubmit: handleAddLog, className: "bg-white border-2 border-brand/20 rounded-2xl p-6 shadow-lg animate-bounce-in space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-mid uppercase mb-1", children: "Tópicos Abordados (separados por vírgula)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: newTopics,
                onChange: (e) => setNewTopics(e.target.value),
                placeholder: "ex: Verbo Taberu, Kanji de Água, Partículas...",
                className: "w-full border-2 border-slate-border rounded-xl p-3 outline-none focus:border-brand font-medium",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-slate-mid uppercase mb-1", children: "Notas Pedagógicas / Próximos Passos" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: newNotes,
                onChange: (e) => setNewNotes(e.target.value),
                className: "w-full border-2 border-slate-border rounded-xl p-3 outline-none focus:border-brand font-medium h-24 resize-none",
                placeholder: "O aluno teve dificuldade com..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3 justify-end", children: [
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShowAddLog(false), className: "px-5 py-2 text-slate-mid font-bold hover:text-slate-dark transition-colors", children: "Cancelar" }),
            /* @__PURE__ */ jsx("button", { type: "submit", disabled: isSubmitting, className: "px-6 py-2 bg-brand text-white rounded-xl font-outfit font-bold hover:opacity-90 transition-opacity", children: isSubmitting ? "Salvando..." : "Salvar Log" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: logs.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-white p-12 text-center rounded-3xl border-2 border-slate-border border-dashed text-slate-mid", children: "Nenhum log de aula registrado ainda. Comece hoje!" }) : logs.map((log) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-border p-5 shadow-sm group hover:shadow-md transition-shadow relative overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-1 h-full bg-brand/30" }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-slate-mid text-xs font-bold", children: [
              /* @__PURE__ */ jsx(Calendar, { size: 14 }),
              new Date(log.date).toLocaleDateString("pt-BR")
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDeleteLog(log.id),
                className: "opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-border hover:text-red-500",
                children: /* @__PURE__ */ jsx(Trash2, { size: 16 })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-3", children: log.topics.map((t, idx) => /* @__PURE__ */ jsx("span", { className: "bg-brand/5 text-brand text-[10px] uppercase font-black px-2 py-0.5 rounded border border-brand/10", children: t }, idx)) }),
          log.notes && /* @__PURE__ */ jsx("p", { className: "text-slate-dark text-sm leading-relaxed bg-ice p-3 rounded-xl border border-slate-border/50", children: log.notes })
        ] }, log.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("h2", { className: "font-outfit text-xl font-black text-slate-dark flex items-center gap-2 px-2", children: [
          /* @__PURE__ */ jsx(Award, { size: 20, className: "text-brand" }),
          " Visão Geral"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border-2 border-slate-border p-6 shadow-sm space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-mid uppercase", children: "Desempenho Geral" }),
            /* @__PURE__ */ jsx("div", { className: "h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-border", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-brand", style: { width: "65%" } }) }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-slate-mid text-right italic", children: "Baseado em XP acumulada" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-mid uppercase", children: "Histórico de Tópicos" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
              Array.from(new Set(logs.flatMap((l) => l.topics))).slice(0, 10).map((t, i) => /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-dark bg-slate-100 py-1 px-2 rounded-lg border border-slate-border", children: t }, i)),
              logs.length === 0 && /* @__PURE__ */ jsx("span", { className: "text-xs italic text-slate-mid", children: "Sem dados ainda" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 bg-ice rounded-2xl border border-slate-border/50", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-brand uppercase mb-1", children: "Dica do Sensei" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-mid leading-relaxed", children: "Este aluno está demonstrando consistência. Considere introduzir novos cards de N4." })
          ] })
        ] })
      ] })
    ] })
  ] });
};

const $$id = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Detalhes do Aluno — Destrave Hub", "activeNav": "students" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8"> ${renderComponent($$result2, "StudentDetail", StudentDetail, { "client:load": true, "studentId": id, "client:component-hydration": "load", "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/dashboard/StudentDetail", "client:component-export": "StudentDetail" })} </div> ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/students/[id].astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/students/[id].astro";
const $$url = "/dashboard/students/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
