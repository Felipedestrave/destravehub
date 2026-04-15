import{j as e}from"./jsx-runtime.u17CrQMm.js";import{r as c}from"./index.DrBtkhmp.js";import{S as g}from"./store.BRx3I6wk.js";import{A as b}from"./index.DOtcC6DD.js";import{m as d}from"./proxy.BLcRGA29.js";import{M as x}from"./map-pin.D530awWz.js";import{c as m}from"./createLucideIcon.BukDFzw_.js";import{C as u}from"./chevron-right.B5VOUX-2.js";import{S as f}from"./sparkles.C81tWaGI.js";const v=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],w=m("chevron-left",v);const y=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"m21 3-7 7",key:"1l2asr"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M9 21H3v-6",key:"wtvkvv"}]],l=m("maximize-2",y),M=()=>{const t=g.filter(i=>i.category==="theme"),[o,n]=c.useState(0),[a,s]=c.useState(!0),r=t[o],h=()=>n(i=>(i+1)%t.length),p=()=>n(i=>(i-1+t.length)%t.length);return e.jsxs("div",{className:"theme-viewer-host",children:[e.jsx(b,{mode:"wait",children:e.jsxs(d.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.8},className:"theme-background-full",style:{backgroundImage:`url(${r.previewUrl})`},children:[e.jsx("div",{className:"theme-overlay"}),e.jsx("div",{className:"theme-content-preview",children:e.jsxs(d.div,{initial:{y:20,opacity:0},animate:{y:0,opacity:1},transition:{delay:.5},className:"preview-card-mockup",children:[e.jsx("span",{className:"preview-badge",children:"MODO ESTUDO"}),e.jsx("h1",{children:"Onde você quer estudar hoje?"}),e.jsx("p",{children:"O ambiente de estudo muda conforme o seu progresso e conquistas no Mercado Destrave."}),e.jsxs("div",{className:"preview-stats-row",children:[e.jsx("div",{className:"stat-pill",children:"50 XP HOJE"}),e.jsx("div",{className:"stat-pill",children:"NÍVEL 12"})]})]})})]},r.id)}),e.jsxs("div",{className:`theme-controls-floating ${a?"visible":"hidden"}`,children:[e.jsxs("div",{className:"theme-info-box",children:[e.jsxs("div",{className:"theme-id-tag",children:[e.jsx(x,{size:14}),e.jsxs("span",{children:["SESSÃO: ",r.name]})]}),e.jsx("h2",{children:r.name}),e.jsx("p",{children:r.description}),e.jsx("div",{className:"rarity-indicator","data-rarity":r.rarity,children:r.rarity.toUpperCase()})]}),e.jsxs("div",{className:"theme-nav-buttons",children:[e.jsx("button",{onClick:p,className:"nav-btn",children:e.jsx(w,{size:24})}),e.jsxs("div",{className:"nav-indicator",children:[o+1," / ",t.length]}),e.jsx("button",{onClick:h,className:"nav-btn",children:e.jsx(u,{size:24})})]}),e.jsxs("div",{className:"extra-actions",children:[e.jsxs("button",{onClick:()=>s(!a),className:"action-btn-toggle",children:[e.jsx(l,{size:18}),a?"Ocultar Interface":"Mostrar Interface"]}),e.jsxs("a",{href:"/dashboard/store",className:"action-btn-go-store",children:[e.jsx(f,{size:18}),"Ir para Loja"]})]})]}),!a&&e.jsx("button",{onClick:()=>s(!0),className:"show-ui-corner",children:e.jsx(l,{size:24})}),e.jsx("style",{children:`
                .theme-viewer-host {
                    width: 100vw;
                    height: 100vh;
                    background: black;
                    overflow: hidden;
                    position: fixed;
                    top: 0; left: 0;
                    z-index: 1000;
                    color: white;
                    font-family: 'Outfit', sans-serif;
                }
                .theme-background-full {
                    width: 100%;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                .theme-overlay {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%);
                    background-color: rgba(0,0,0,0.2);
                }
                .theme-content-preview {
                    position: relative;
                    z-index: 2;
                    text-align: center;
                    max-width: 600px;
                    padding: 2rem;
                }
                .preview-card-mockup {
                    background: rgba(255,255,255,0.1);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.2);
                    padding: 3rem 2rem;
                    border-radius: 2rem;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                }
                .preview-badge {
                    background: var(--color-brand, #58317E);
                    color: white;
                    padding: 0.4rem 1rem;
                    border-radius: 1rem;
                    font-size: 0.75rem;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                }
                .preview-card-mockup h1 {
                    font-size: 2.5rem;
                    margin: 1.5rem 0 1rem;
                    font-weight: 800;
                }
                .preview-card-mockup p {
                    font-size: 1.1rem;
                    opacity: 0.8;
                    line-height: 1.6;
                }
                .preview-stats-row {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-top: 2rem;
                }
                .stat-pill {
                    background: rgba(255,255,255,0.1);
                    padding: 0.6rem 1.2rem;
                    border-radius: 999px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .theme-controls-floating {
                    position: absolute;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                    width: 100%;
                    max-width: 450px;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .theme-controls-floating.hidden {
                    bottom: -300px;
                    opacity: 0;
                }

                .theme-info-box {
                    background: rgba(15, 23, 42, 0.85);
                    backdrop-filter: blur(12px);
                    border: 1.5px solid rgba(255,255,255,0.15);
                    padding: 1.5rem;
                    border-radius: 1.5rem;
                    text-align: center;
                    width: 100%;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.6);
                }
                .theme-id-tag {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    color: #94A3B8;
                    font-size: 0.7rem;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    margin-bottom: 0.75rem;
                }
                .theme-info-box h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 800;
                }
                .theme-info-box p {
                    font-size: 0.9rem;
                    color: #CBD5E1;
                    margin: 0.5rem 0 1rem;
                }
                .rarity-indicator {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 0.5rem;
                    font-size: 0.65rem;
                    font-weight: 900;
                    letter-spacing: 0.05em;
                }
                .rarity-indicator[data-rarity="common"] { background: #64748b; }
                .rarity-indicator[data-rarity="rare"] { background: #3b82f6; }
                .rarity-indicator[data-rarity="epic"] { background: #a855f7; }
                .rarity-indicator[data-rarity="legendary"] { background: #eab308; color: black; }

                .theme-nav-buttons {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }
                .nav-btn {
                    width: 50px;
                    height: 50px;
                    border-radius: 1rem;
                    background: white;
                    color: black;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .nav-btn:hover {
                    transform: scale(1.1);
                    background: var(--color-brand, #58317E);
                    color: white;
                }
                .nav-indicator {
                    font-weight: 800;
                    font-size: 1.1rem;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
                }

                .extra-actions {
                    display: flex;
                    gap: 1rem;
                }
                .action-btn-toggle, .action-btn-go-store {
                    padding: 0.75rem 1.25rem;
                    border-radius: 1rem;
                    border: none;
                    font-weight: 700;
                    font-size: 0.85rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }
                .action-btn-toggle {
                    background: rgba(255,255,255,0.1);
                    color: white;
                }
                .action-btn-toggle:hover {
                    background: rgba(255,255,255,0.2);
                }
                .action-btn-go-store {
                    background: #22c55e;
                    color: white;
                    text-decoration: none;
                }
                .action-btn-go-store:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(34,197,94,0.4);
                }

                .show-ui-corner {
                    position: absolute;
                    bottom: 2rem;
                    right: 2rem;
                    z-index: 100;
                    background: white;
                    color: black;
                    width: 60px;
                    height: 60px;
                    border-radius: 1.5rem;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
            `})]})};export{M as ThemesTestPage};
