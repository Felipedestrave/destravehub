import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_B_DQSMrb.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useRef, useEffect, useState } from 'react';
import { useAnimation, AnimatePresence, motion } from 'framer-motion';
import { Sparkles, XCircle, Play, UserCircle2 } from 'lucide-react';

function getAudioPath(avatarId, message, type) {
  if (!message) return null;
  const avatar = avatarId || "avatar-tanuki-novato";
  const sanitizedMsg = message.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `/assets/buddy-voices/${avatar}/${type}/${sanitizedMsg}.wav`;
}
const BuddyView = ({
  avatarUrl = "/assets/avatars/tanuki-novato.png",
  avatarId = null,
  state = "idle",
  message = null
}) => {
  const controls = useAnimation();
  const prevState = useRef("idle");
  const audioRef = useRef(null);
  useEffect(() => {
    if (!message) return;
    const type = state === "error" ? "error" : "success";
    const audioPath = getAudioPath(avatarId, message, type);
    if (audioPath) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio(audioPath);
      audio.volume = 0.7;
      audio.play().catch((err) => {
        console.warn(`[Buddy - Áudio Ausente] Gerar o arquivo mp3: ${audioPath}`, err);
      });
      audioRef.current = audio;
    }
  }, [message, avatarId, state]);
  useEffect(() => {
    const run = async () => {
      if (state === "idle") {
        controls.start({
          y: [0, -12, 0],
          scale: [1, 1.03, 1],
          rotate: [0, 1.5, 0, -1.5, 0],
          transition: {
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        });
      } else if (state === "success") {
        await controls.stop();
        await controls.start({
          y: [0, -70, -20, 0],
          scale: [1, 1.2, 0.88, 1],
          rotate: [0, 12, -8, 0],
          filter: [
            "drop-shadow(0 10px 15px rgba(0,0,0,0.1))",
            "drop-shadow(0 0 25px rgba(34,197,94,0.7))",
            "drop-shadow(0 0 10px rgba(34,197,94,0.3))",
            "drop-shadow(0 10px 15px rgba(0,0,0,0.1))"
          ],
          transition: {
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1]
            // Spring-like easing
          }
        });
        controls.start({
          y: [0, -12, 0],
          scale: [1, 1.03, 1],
          rotate: [0, 1.5, 0, -1.5, 0],
          transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
        });
      } else if (state === "error") {
        await controls.stop();
        await controls.start({
          x: [0, -12, 12, -12, 12, -6, 6, 0],
          scale: [1, 0.92, 0.92, 1],
          filter: [
            "drop-shadow(0 10px 15px rgba(0,0,0,0.1))",
            "drop-shadow(0 0 20px rgba(239,68,68,0.6))",
            "drop-shadow(0 0 10px rgba(239,68,68,0.3))",
            "drop-shadow(0 10px 15px rgba(0,0,0,0.1))"
          ],
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        });
        controls.start({
          y: [0, -12, 0],
          scale: [1, 1.03, 1],
          rotate: [0, 1.5, 0, -1.5, 0],
          transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
        });
      } else if (state === "hidden") {
        controls.start({ y: 300, opacity: 0, transition: { duration: 0.5 } });
      }
      prevState.current = state;
    };
    run();
  }, [state, controls]);
  useEffect(() => {
    controls.start({
      y: [0, -12, 0],
      scale: [1, 1.03, 1],
      rotate: [0, 1.5, 0, -1.5, 0],
      transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
    });
  }, [controls]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "buddy-host",
      style: {
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 1e3,
        pointerEvents: "none",
        width: "180px",
        height: "240px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center"
      },
      children: [
        /* @__PURE__ */ jsx(AnimatePresence, { children: message && /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.8, y: 10, x: -10 },
            animate: { opacity: 1, scale: 1, y: 0, x: 0 },
            exit: { opacity: 0, scale: 0.8, y: 5 },
            className: "buddy-speech-bubble",
            style: {
              position: "absolute",
              bottom: "100%",
              right: "20%",
              marginBottom: "10px",
              background: "white",
              padding: "0.75rem 1rem",
              borderRadius: "1.25rem 1.25rem 0.25rem 1.25rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              minWidth: "120px",
              maxWidth: "220px",
              border: "2px solid var(--color-brand)",
              zIndex: 1001,
              pointerEvents: "auto"
            },
            children: [
              /* @__PURE__ */ jsx("p", { style: {
                margin: 0,
                fontFamily: "var(--font-outfit)",
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "var(--color-brand)",
                lineHeight: 1.4,
                textAlign: "center"
              }, children: message }),
              /* @__PURE__ */ jsx("div", { style: {
                position: "absolute",
                bottom: "-10px",
                right: "4px",
                width: "0",
                height: "0",
                borderLeft: "10px solid transparent",
                borderTop: "10px solid var(--color-brand)"
              } })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            animate: controls,
            style: {
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center"
            },
            children: /* @__PURE__ */ jsx(
              "img",
              {
                src: avatarUrl,
                alt: "Destrave Buddy",
                style: {
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))"
                }
              }
            )
          }
        ),
        /* @__PURE__ */ jsx("style", { children: `
                @keyframes float-bubble {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .buddy-speech-bubble {
                    animation: float-bubble 3s ease-in-out infinite;
                }
            ` })
      ]
    }
  );
};

const BuddyTestPage = () => {
  const [state, setState] = useState("idle");
  const [avatarUrl, setAvatarUrl] = useState("/assets/avatars/ashigaru.png");
  const triggerState = (newState) => {
    setState(newState);
    if (newState === "success" || newState === "error") {
      setTimeout(() => setState("idle"), 1500);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-8 max-w-4xl mx-auto space-y-12", children: [
    /* @__PURE__ */ jsxs("header", { className: "border-b border-slate-200 pb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-outfit font-black text-slate-800", children: "Cenário de Teste: Buddy Hub 🏯" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-500 mt-2", children: 'Clique nos botões abaixo para ver os "novos humores" do seu avatar no canto da tela.' })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white border-2 border-slate-100 p-8 rounded-3xl shadow-sm space-y-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm uppercase tracking-widest font-black text-brand", children: "Controle de Reações" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => triggerState("success"),
              className: "w-full flex items-center justify-between p-4 bg-emerald-50 text-emerald-700 rounded-2xl border-2 border-emerald-100 hover:bg-emerald-100 transition-all font-outfit font-bold",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "bg-emerald-500 text-white p-2 rounded-xl", children: /* @__PURE__ */ jsx(Sparkles, { size: 20 }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { children: "Simular Acerto (Success)" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs opacity-60 font-normal", children: "Pulo alto + Brilho Verde" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "opacity-40", children: [
                  "Trigger ",
                  "->"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => triggerState("error"),
              className: "w-full flex items-center justify-between p-4 bg-rose-50 text-rose-700 rounded-2xl border-2 border-rose-100 hover:bg-rose-100 transition-all font-outfit font-bold",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "bg-rose-500 text-white p-2 rounded-xl", children: /* @__PURE__ */ jsx(XCircle, { size: 20 }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { children: "Simular Erro (Error)" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs opacity-60 font-normal", children: "Tremor lateral + Brilho Vermelho" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "opacity-40", children: [
                  "Trigger ",
                  "->"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setState("idle"),
              className: "w-full flex items-center justify-between p-4 bg-slate-50 text-slate-700 rounded-2xl border-2 border-slate-100 hover:bg-slate-100 transition-all font-outfit font-bold",
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("span", { className: "bg-slate-400 text-white p-2 rounded-xl", children: /* @__PURE__ */ jsx(Play, { size: 20 }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { children: "Resetar para Respiração (Idle)" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs opacity-60 font-normal", children: "Movimento contínuo" })
                ] })
              ] })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-8 rounded-3xl space-y-4", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-sm uppercase tracking-widest font-black text-slate-400 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(UserCircle2, { size: 16 }),
          " Trocar Personagem"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: ["ashigaru", "ninja-sapeca", "samurai-zen", "shogun"].map((name) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setAvatarUrl(`/assets/avatars/${name}.png`),
            className: `p-3 rounded-xl border font-bold capitalize transition-all ${avatarUrl.includes(name) ? "bg-brand text-white border-brand" : "bg-white border-slate-200 text-slate-600 hover:border-brand"}`,
            children: name.replace("-", " ")
          },
          name
        )) }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 mt-4 leading-relaxed", children: "*Lembre-se: O personagem é exibido no canto inferior direito da sua tela, exatamente como ficará durante as missões." })
      ] })
    ] }),
    /* @__PURE__ */ jsx(BuddyView, { avatarUrl, state })
  ] });
};

const $$BuddyTest = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Teste de Animações - Buddy" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="h-full bg-slate-50/50"> ${renderComponent($$result2, "BuddyTestPage", BuddyTestPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/buddy/BuddyTestPage", "client:component-export": "BuddyTestPage" })} </div> ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/buddy-test.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/buddy-test.astro";
const $$url = "/dashboard/buddy-test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$BuddyTest,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
