import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_B_DQSMrb.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from './supabase_Cb0dhCq8.mjs';
import { l as lessonLogService } from './lesson-logs_C0KTxbjY.mjs';
import { Rocket, Clock, Target, BookOpen, Calendar } from 'lucide-react';

const StudentHistory = () => {
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      setProfile(profileData);
      const { data: studentRecord } = await supabase.from("students").select("id").eq("student_id", session.user.id).single();
      if (studentRecord) {
        const logData = await lessonLogService.listForStudent(studentRecord.id);
        setLogs(logData);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-slate-mid", children: "Recuperando memórias..." });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border-2 border-slate-border p-6 shadow-sm border-b-4 border-b-brand", children: [
        /* @__PURE__ */ jsx(Rocket, { className: "text-brand mb-2", size: 24 }),
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-mid uppercase", children: "XP Total" }),
        /* @__PURE__ */ jsx("p", { className: "font-outfit text-3xl font-black text-slate-dark", children: profile?.xp || 0 })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border-2 border-slate-border p-6 shadow-sm border-b-4 border-b-blue-500", children: [
        /* @__PURE__ */ jsx(Clock, { className: "text-blue-500 mb-2", size: 24 }),
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-mid uppercase", children: "Aulas Concluídas" }),
        /* @__PURE__ */ jsx("p", { className: "font-outfit text-3xl font-black text-slate-dark", children: profile?.attendance_streak || 0 })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border-2 border-slate-border p-6 shadow-sm border-b-4 border-b-green-500", children: [
        /* @__PURE__ */ jsx(Target, { className: "text-green-500 mb-2", size: 24 }),
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-slate-mid uppercase", children: "Nível Atual" }),
        /* @__PURE__ */ jsx("p", { className: "font-outfit text-3xl font-black text-slate-dark", children: profile?.role === "student" ? "Gakusei" : "Sensei" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("h2", { className: "font-outfit text-2xl font-black text-slate-dark flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(BookOpen, { size: 24, className: "text-brand" }),
        " Registro do Sensei"
      ] }),
      logs.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-white p-12 text-center rounded-3xl border-2 border-slate-border border-dashed text-slate-mid", children: "Seu professor ainda não registrou notas de aula. Continue praticando!" }) : /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute left-8 top-0 bottom-0 w-0.5 bg-slate-100 hidden sm:block" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-8", children: logs.map((log) => /* @__PURE__ */ jsxs("div", { className: "relative sm:pl-20", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute left-[29px] top-2 w-3 h-3 rounded-full bg-brand border-4 border-white shadow-sm z-10 hidden sm:block" }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border-2 border-slate-border p-6 shadow-sm hover:shadow-md transition-shadow", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-slate-mid text-xs font-bold mb-4", children: [
              /* @__PURE__ */ jsx(Calendar, { size: 14 }),
              new Date(log.date).toLocaleDateString("pt-BR")
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: log.topics.map((t, idx) => /* @__PURE__ */ jsx("span", { className: "bg-brand/5 text-brand text-[10px] uppercase font-black px-2 py-1 rounded border border-brand/10", children: t }, idx)) }),
            log.notes && /* @__PURE__ */ jsx("div", { className: "p-4 bg-ice rounded-xl border border-slate-border/50", children: /* @__PURE__ */ jsx("p", { className: "text-slate-dark text-sm leading-relaxed", children: log.notes }) })
          ] })
        ] }, log.id)) })
      ] })
    ] })
  ] });
};

const $$History = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Meu Histórico — Destrave Hub", "activeNav": "history" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8"> <header class="mb-8"> <h1 class="font-outfit text-3xl font-black text-slate-dark tracking-tight">Meu Histórico 📜</h1> <p class="text-slate-mid mt-1 font-medium leading-relaxed">Acompanhe seu progresso e os feedbacks do Sensei.</p> </header> ${renderComponent($$result2, "StudentHistory", StudentHistory, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/student/StudentHistory", "client:component-export": "StudentHistory" })} </div> ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/history.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/history.astro";
const $$url = "/dashboard/history";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$History,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
