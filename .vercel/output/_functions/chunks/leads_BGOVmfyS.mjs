import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { r as renderScript } from './script_DB7th2uj.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_B_DQSMrb.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useCallback, useEffect } from 'react';
import { s as supabase } from './supabase_Cb0dhCq8.mjs';
import { UserPlus, Activity, Phone, Link, Trash2 } from 'lucide-react';

function LeadsList() {
  const [leads, setLeads] = useState([]);
  const [teacherId, setTeacherId] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchLeads = useCallback(async (tid) => {
    const { data } = await supabase.from("students").select("*").eq("teacher_id", tid).contains("metadata", { is_lead: true }).order("created_at", { ascending: false });
    setLeads(data ?? []);
  }, []);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = "/auth/login";
        return;
      }
      setTeacherId(session.user.id);
      fetchLeads(session.user.id).finally(() => setLoading(false));
    });
  }, [fetchLeads]);
  const copyLink = (uuid) => {
    if (!uuid) return;
    const url = `${window.location.origin}/share/${uuid}`;
    navigator.clipboard.writeText(url);
    alert("Link copiado para a área de transferência!");
  };
  const handleDeleteLead = async (id, name) => {
    if (!confirm(`Tem certeza que deseja excluir o lead ${name}? O histórico será perdido.`)) return;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) {
      console.error("Erro ao excluir lead:", error);
      alert("Não foi possível excluir.");
      return;
    }
    setLeads((prev) => prev.filter((s) => s.id !== id));
  };
  const openWhatsApp = (phone) => {
    if (!phone) return;
    const numbersOnly = phone.replace(/\D/g, "");
    window.open(`https://wa.me/55${numbersOnly}`, "_blank");
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-4 min-h-[300px] text-slate-400", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 border-4 border-slate-200 border-t-brand rounded-full animate-spin" }),
      /* @__PURE__ */ jsx("p", { children: "Carregando leads…" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-row items-center justify-between pb-4 border-b border-slate-200", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "font-outfit font-black text-2xl text-slate-dark", children: "Base de Leads" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-500 font-medium", children: [
        "Usuários capturados via link experimental (",
        leads.length,
        ")"
      ] })
    ] }) }),
    leads.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsx(UserPlus, { className: "text-slate-300 mx-auto", size: 48 }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-outfit font-bold text-xl text-slate-dark mb-2", children: "Nenhum lead capturado ainda" }),
        /* @__PURE__ */ jsx("p", { className: "text-slate-500 max-w-sm mx-auto", children: "Compartilhe suas atividades experimentais em redes sociais ou anúncios para atrair estudantes!" })
      ] })
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: leads.map((lead) => {
      const meta = lead.metadata || {};
      const whatsapp = meta.whatsapp || "";
      return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-2 h-full bg-brand" }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-outfit font-bold text-lg text-slate-dark leading-tight", children: lead.name }),
            meta.email && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 font-medium truncate mt-1", children: meta.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-xs font-bold items-center gap-1", children: [
            /* @__PURE__ */ jsx(Activity, { size: 12 }),
            " Expirará"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 mt-4", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => openWhatsApp(whatsapp),
              className: "w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50",
              disabled: !whatsapp,
              children: [
                /* @__PURE__ */ jsx(Phone, { size: 16 }),
                " Chamar no WhatsApp"
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => copyLink(lead.experimental_uuid),
                className: "bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors border border-slate-200",
                children: [
                  /* @__PURE__ */ jsx(Link, { size: 14 }),
                  " Link"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => handleDeleteLead(lead.id, lead.name),
                className: "bg-red-50 hover:bg-red-100 text-red-500 font-semibold py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors border border-red-100",
                children: [
                  /* @__PURE__ */ jsx(Trash2, { size: 14 }),
                  " Excluir"
                ]
              }
            )
          ] })
        ] })
      ] }, lead.id);
    }) })
  ] });
}

const $$Leads = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderScript($$result, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/leads.astro?astro&type=script&index=0&lang.ts")} ${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Leads Capturados — Destrave Hub", "activeNav": "leads" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="teacher-view" class="hidden"> <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"> <header class="mb-8"> <h1 class="font-outfit text-3xl font-black text-slate-dark tracking-tight">Leads Capturados 🎯</h1> <p class="text-slate-mid mt-1 font-medium leading-relaxed">Gerencie contatos capturados através das atividades experimentais (Links Públicos).</p> </header> ${renderComponent($$result2, "LeadsList", LeadsList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/dashboard/LeadsList", "client:component-export": "default" })} </div> </div> ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/leads.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/leads.astro";
const $$url = "/dashboard/leads";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Leads,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
