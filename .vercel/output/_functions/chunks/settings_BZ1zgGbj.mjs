import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { r as renderScript } from './script_DB7th2uj.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_B_DQSMrb.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from './supabase_Cb0dhCq8.mjs';
import { User, Camera, BookOpen, FileText, Phone } from 'lucide-react';

const SettingsPanel = () => {
  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setOffset({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart]);
  const handleConfirmCrop = async () => {
    setShowCropper(false);
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const canvas = document.createElement("canvas");
      const size = 400;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx || !cropImage) return;
      const img = new Image();
      img.src = cropImage;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      const previewSize = 256;
      const scaleFactor = img.naturalWidth / previewSize;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, size, size);
      const drawSize = size * zoom;
      const dx = size / 2 + offset.x * (size / previewSize) - drawSize / 2;
      const dy = size / 2 + offset.y * (size / previewSize) - drawSize / 2;
      ctx.drawImage(img, dx, dy, drawSize, drawSize);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
      if (!blob) throw new Error("Falha ao gerar imagem recortada");
      const fileName = `${session.user.id}-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, blob);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(fileName);
      setAvatarUrl(publicUrl);
      setNotification({ type: "success", message: "Foto recortada e enviada! Salve para finalizar." });
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    } catch (err) {
      console.error("Crop/Upload error:", err);
      setNotification({ type: "error", message: "Erro ao processar imagem." });
    } finally {
      setSaving(false);
    }
  };
  useEffect(() => {
    loadProfile();
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));
  }, []);
  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      let { data, error } = await supabase.from("profiles").select("full_name, display_name, specialty, bio, whatsapp, avatar_url").eq("id", session.user.id).single();
      if (error) {
        console.warn("Busca completa falhou, tentando fallback básico...");
        const basicRes = await supabase.from("profiles").select("full_name, whatsapp, avatar_url").eq("id", session.user.id).single();
        if (basicRes.error) throw basicRes.error;
        data = basicRes.data;
      }
      if (data) {
        setFullName(data.full_name || "");
        setDisplayName(data.display_name || "");
        setSpecialty(data.specialty || "");
        setBio(data.bio || "");
        setWhatsapp(data.whatsapp || "");
        setAvatarUrl(data.avatar_url || "");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };
  const formatWhatsAppDisplay = (digits) => {
    if (!digits) return "";
    if (digits.startsWith("81")) {
      let formatted = "+81 ";
      const rest = digits.slice(2);
      if (rest.length > 0) {
        formatted += rest.slice(0, 2);
        if (rest.length > 2) {
          formatted += "-" + rest.slice(2, 6);
          if (rest.length > 6) {
            formatted += "-" + rest.slice(6, 13);
          }
        }
      }
      return formatted.trim();
    }
    if (digits.startsWith("55")) {
      let formatted = "+55 ";
      const rest = digits.slice(2);
      if (rest.length > 0) {
        formatted += "(" + rest.slice(0, 2) + ") ";
        if (rest.length > 2) {
          formatted += rest.slice(2, 7);
          if (rest.length > 7) {
            formatted += "-" + rest.slice(7, 13);
          }
        }
      }
      return formatted.trim();
    }
    return digits ? `+${digits}` : "";
  };
  const handleWhatsAppChange = (e) => {
    const val = e.target.value;
    const digits = val.replace(/\D/g, "");
    if (digits.length <= 15) setWhatsapp(digits);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Não autenticado");
      const { error } = await supabase.from("profiles").update({
        full_name: fullName,
        display_name: displayName,
        specialty,
        bio,
        whatsapp,
        avatar_url: avatarUrl,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", session.user.id);
      if (error) throw error;
      setNotification({ type: "success", message: "Perfil sintonizado com sucesso! ✨" });
      window.dispatchEvent(new Event("profile-updated"));
    } catch (error) {
      console.error("Error saving profile:", error);
      setNotification({ type: "error", message: "Erro ao salvar. Verifique se rodou o SQL sugerido pelo Sensei." });
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsx("div", { className: "w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin shadow-lg" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto animation-fade-in pb-20", children: [
    notification && /* @__PURE__ */ jsxs("div", { className: `mb-8 p-4 rounded-2xl border-2 font-inter font-bold shadow-sm flex items-center gap-3 ${notification.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`, children: [
      notification.type === "success" ? "✅" : "❌",
      notification.message
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border border-slate-border p-8 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-brand/10 p-2 rounded-xl text-brand", children: /* @__PURE__ */ jsx(User, { size: 24 }) }),
          /* @__PURE__ */ jsx("h2", { className: "font-outfit text-xl font-bold text-slate-dark uppercase tracking-tight", children: "Identidade do Sensei" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-black text-slate-mid uppercase tracking-widest mb-2 font-outfit", children: "Sua Foto de Perfil" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => document.getElementById("avatar-upload")?.click(),
                    className: "btn-white px-4 py-2 text-sm font-bold rounded-xl flex items-center gap-2 border-2 hover:border-brand transition-all",
                    children: [
                      /* @__PURE__ */ jsx(Camera, { size: 16 }),
                      " Alterar Foto"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "file",
                    id: "avatar-upload",
                    accept: "image/*",
                    className: "hidden",
                    onChange: (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setCropImage(reader.result);
                          setShowCropper(true);
                        };
                        reader.readAsDataURL(file);
                      }
                    }
                  }
                ),
                avatarUrl && /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setAvatarUrl(""),
                    className: "text-xs font-bold text-red-500 hover:underline",
                    children: "Remover"
                  }
                )
              ] })
            ] }),
            showCropper && cropImage && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animation-fade-in", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-outfit text-xl font-bold text-slate-dark", children: "Ajuste seu Avatar" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-mid", children: "Arraste e use o zoom para centralizar sua foto." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-brand bg-slate-100 shadow-inner", children: [
                /* @__PURE__ */ jsx("div", { id: "crop-container", className: "absolute inset-0 cursor-move", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    id: "crop-preview-img",
                    src: cropImage,
                    alt: "Crop",
                    draggable: "false",
                    onDragStart: (e) => e.preventDefault(),
                    style: {
                      transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                      transition: "none",
                      maxWidth: "none",
                      position: "absolute",
                      top: "0",
                      left: "0",
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      cursor: isDragging ? "grabbing" : "grab",
                      userSelect: "none"
                    },
                    onMouseDown: (e) => {
                      setIsDragging(true);
                      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
                    }
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none border-[40px] border-black/20" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-mid", children: "ZOOM" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "range",
                      min: "1",
                      max: "3",
                      step: "0.1",
                      value: zoom,
                      onChange: (e) => setZoom(parseFloat(e.target.value)),
                      className: "flex-1 accent-brand h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-4", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowCropper(false),
                      className: "flex-1 py-3 rounded-xl border-2 border-slate-border font-outfit font-bold text-slate-mid hover:bg-slate-50 transition-colors",
                      children: "Cancelar"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: handleConfirmCrop,
                      className: "flex-1 py-3 rounded-xl bg-brand text-white font-outfit font-bold hover:scale-105 transition-all shadow-lg shadow-brand/20",
                      children: "Confirmar"
                    }
                  )
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-black text-slate-mid uppercase tracking-widest mb-2 font-outfit", children: "Ou use uma URL Externa" }),
              /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-mid group-focus-within:text-brand transition-colors", children: /* @__PURE__ */ jsx(Camera, { size: 18 }) }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "url",
                    value: avatarUrl,
                    onChange: (e) => setAvatarUrl(e.target.value),
                    placeholder: "https://suafoto.com/imagem.png",
                    className: "w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-border bg-ice focus:bg-white focus:border-brand outline-none transition-all font-inter font-medium"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-black text-slate-mid uppercase tracking-widest mb-2 font-outfit", children: "Nome Completo" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: fullName,
                  onChange: (e) => setFullName(e.target.value),
                  placeholder: "Digite seu nome completo",
                  className: "w-full px-4 py-3 rounded-xl border-2 border-slate-border bg-ice focus:bg-white focus:border-brand outline-none transition-all font-inter font-medium"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-black text-slate-mid uppercase tracking-widest mb-2 font-outfit", children: "Nome de Exibição (Como os alunos te veem)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: displayName,
                  onChange: (e) => setDisplayName(e.target.value),
                  placeholder: "Ex: Sensei Felipe",
                  className: "w-full px-4 py-3 rounded-xl border-2 border-slate-border bg-ice focus:bg-white focus:border-brand outline-none transition-all font-inter font-medium"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-border group hover:border-brand transition-colors", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-32 h-32 rounded-full border-4 border-white shadow-xl mx-auto overflow-hidden bg-white mb-4 relative", children: avatarUrl ? /* @__PURE__ */ jsx("img", { src: avatarUrl, alt: "Preview", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-slate-200", children: /* @__PURE__ */ jsx(User, { size: 64 }) }) }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-mid", children: "Prévia do Avatar" })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border border-slate-border p-8 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-brand/10 p-2 rounded-xl text-brand", children: /* @__PURE__ */ jsx(BookOpen, { size: 24 }) }),
          /* @__PURE__ */ jsx("h2", { className: "font-outfit text-xl font-bold text-slate-dark uppercase tracking-tight", children: "Experiência Profissional" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-black text-slate-mid uppercase tracking-widest mb-2 font-outfit", children: "Matéria / Especialidade" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: specialty,
                onChange: (e) => setSpecialty(e.target.value),
                placeholder: "Ex: Língua Japonesa e Cultura",
                className: "w-full px-4 py-3 rounded-xl border-2 border-slate-border bg-ice focus:bg-white focus:border-brand outline-none transition-all font-inter font-medium"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-xs font-black text-slate-mid uppercase tracking-widest mb-2 font-outfit flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(FileText, { size: 14 }),
              " Bio Curta para Alunos"
            ] }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: bio,
                onChange: (e) => setBio(e.target.value),
                placeholder: "Uma breve apresentação sobre seu método ou trajetória...",
                rows: 3,
                className: "w-full px-4 py-3 rounded-xl border-2 border-slate-border bg-ice focus:bg-white focus:border-brand outline-none transition-all font-inter font-medium resize-none"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border border-slate-border p-8 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-brand/10 p-2 rounded-xl text-brand", children: /* @__PURE__ */ jsx(Phone, { size: 24 }) }),
          /* @__PURE__ */ jsx("h2", { className: "font-outfit text-xl font-bold text-slate-dark uppercase tracking-tight", children: "Configurações de Contato" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-xs font-black text-slate-mid uppercase tracking-widest mb-2 font-outfit flex items-center justify-between", children: [
            "WhatsApp do Sensei",
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-brand font-bold", children: "RECOMENDADO" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative max-w-sm", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-mid", children: /* @__PURE__ */ jsx(Phone, { size: 18 }) }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: formatWhatsAppDisplay(whatsapp),
                onChange: handleWhatsAppChange,
                placeholder: "81 90-XXXX-XXXX",
                className: "w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-border bg-ice focus:bg-white focus:border-brand outline-none transition-all font-inter font-medium"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-slate-mid font-medium italic", children: "💡 Use código do país (81 Japão, 55 Brasil). Os alunos usarão este contato ao concluir missões." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl shadow-slate-200/50", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-white/40 font-mono text-[10px] hidden sm:block", children: [
          "ID DO SENSEI: ",
          userId
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: saving,
            className: "w-full sm:w-auto bg-brand text-white px-10 py-4 rounded-2xl font-outfit font-black text-base shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50",
            children: saving ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" }),
              " Sintonizando..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              "SALVAR PERFIL ",
              /* @__PURE__ */ jsx("span", { className: "opacity-0 group-hover:opacity-100 transition-opacity", children: "🚀" })
            ] })
          }
        )
      ] })
    ] })
  ] });
};

const $$Settings = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderScript($$result, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/settings.astro?astro&type=script&index=0&lang.ts")} ${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Configurações | Destrave Hub", "activeNav": "settings" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="teacher-view" class="hidden"> <div class="px-8 py-10 max-w-7xl mx-auto"> <header class="mb-8"> <h1 class="font-outfit text-3xl font-extrabold text-slate-dark mb-2">Configurações Gerais ⚙️</h1> <p class="text-slate-mid font-medium mb-8 font-inter">Gerencie as informações do seu perfil e configurações de contato.</p> </header> ${renderComponent($$result2, "SettingsPanel", SettingsPanel, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/dashboard/SettingsPanel", "client:component-export": "SettingsPanel" })} </div> </div> ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/settings.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/settings.astro";
const $$url = "/dashboard/settings";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Settings,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
