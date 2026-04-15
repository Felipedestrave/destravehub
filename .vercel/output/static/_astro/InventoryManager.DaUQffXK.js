import{j as e}from"./jsx-runtime.u17CrQMm.js";import{r as a}from"./index.DrBtkhmp.js";import{s}from"./materials.astro_astro_type_script_index_0_lang.CbpkQ25P.js";import{S as j}from"./store.BRx3I6wk.js";import{L as h}from"./loader-circle.CueQDEKg.js";import{c as f}from"./createLucideIcon.BukDFzw_.js";import{S as w}from"./sparkles.C81tWaGI.js";import{L as k}from"./layers.E8oGsr1D.js";import{A as N}from"./arrow-left.Cf3uhIgY.js";import{C as q}from"./check.BsLwQkS7.js";const S=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],z=f("image",S);const E=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]],C=f("shield",E),B=()=>{const[u,v]=a.useState([]),[c,d]=a.useState({avatar:null,theme:null,title:null}),[g,l]=a.useState(!0),[y,m]=a.useState(null),[i,o]=a.useState("avatar"),b=async()=>{l(!0);try{const{data:{session:r}}=await s.auth.getSession();if(!r)return;const{data:t}=await s.from("profiles").select("inventory, equipped").eq("id",r.user.id).single();t&&(v(t.inventory||[]),d(t.equipped||{avatar:null,theme:null,title:null}))}catch(r){console.error("[Inventory] Error fetching:",r)}finally{l(!1)}};a.useEffect(()=>{b()},[]);const x=async r=>{m(r.id);try{const{data:{session:t}}=await s.auth.getSession();if(!t)return;const n={...c};n[r.category]=r.id,(await fetch("/api/store/equip",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.access_token}`},body:JSON.stringify({equipped:n})})).ok&&(d(n),r.category==="theme"&&window.dispatchEvent(new CustomEvent("theme-changed",{detail:r.id})))}catch(t){console.error("[Inventory] Error equipping:",t)}finally{m(null)}},p=j.filter(r=>u.includes(r.id)).filter(r=>r.category===i);return g?e.jsx("div",{className:"flex items-center justify-center p-20",children:e.jsx(h,{className:"animate-spin text-brand",size:40})}):e.jsxs("div",{className:"inventory-view",children:[e.jsx("div",{className:"inventory-header",children:e.jsxs("div",{className:"header-tabs",children:[e.jsxs("button",{onClick:()=>o("avatar"),className:`tab-btn ${i==="avatar"?"active":""}`,children:[e.jsx(C,{size:18})," Avatares"]}),e.jsxs("button",{onClick:()=>o("theme"),className:`tab-btn ${i==="theme"?"active":""}`,children:[e.jsx(z,{size:18})," Cenários"]}),e.jsxs("button",{onClick:()=>o("title"),className:`tab-btn ${i==="title"?"active":""}`,children:[e.jsx(w,{size:18})," Títulos"]})]})}),e.jsx("div",{className:"inventory-grid",children:p.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsx("div",{className:"empty-icon text-slate-300",children:e.jsx(k,{size:64,strokeWidth:1})}),e.jsx("h3",{children:"Nada por aqui ainda!"}),e.jsx("p",{children:"Visite a loja para desbloquear itens lendários com seus pontos."}),e.jsxs("a",{href:"/dashboard/store",className:"mt-4 inline-flex items-center gap-2 text-brand font-bold hover:underline",children:["Ir para a Loja ",e.jsx(N,{className:"rotate-180",size:16})]})]}):p.map(r=>{const t=c[r.category]===r.id;return e.jsxs("div",{className:`inventory-card ${t?"equipped":""}`,onClick:()=>!t&&x(r),children:[e.jsxs("div",{className:"card-preview",children:[e.jsx("img",{src:r.previewUrl,alt:r.name}),t&&e.jsxs("div",{className:"equipped-badge",children:[e.jsx(q,{size:12})," EQUIPADO"]})]}),e.jsxs("div",{className:"card-info",children:[e.jsx("h4",{children:r.name}),e.jsx("span",{className:"card-rarity",children:r.rarity.toUpperCase()})]}),y===r.id&&e.jsx("div",{className:"saving-overlay",children:e.jsx(h,{className:"animate-spin",size:24})})]},r.id)})}),e.jsx("style",{children:`
                .inventory-view { padding: 1rem 0; }
                .inventory-header { margin-bottom: 2rem; }
                .header-tabs {
                    display: flex;
                    gap: 0.5rem;
                    background: var(--color-ice);
                    padding: 0.4rem;
                    border-radius: 1rem;
                    width: fit-content;
                }
                .tab-btn {
                    padding: 0.6rem 1.25rem;
                    border: none;
                    background: none;
                    border-radius: 0.75rem;
                    font-family: var(--font-outfit);
                    font-weight: 700;
                    color: var(--color-slate-mid);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .tab-btn:hover { color: var(--color-slate-dark); }
                .tab-btn.active {
                    background: white;
                    color: var(--color-brand);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }

                .inventory-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 1.5rem;
                }

                .inventory-card {
                    background: white;
                    border: 1px solid var(--color-slate-border);
                    border-radius: 1.25rem;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                }
                .inventory-card:not(.equipped):hover {
                    transform: translateY(-5px);
                    border-color: var(--color-brand);
                    box-shadow: 0 10px 25px rgba(88,49,126,0.1);
                }
                .inventory-card.equipped {
                    border-color: var(--color-brand);
                    background: rgba(88,49,126,0.02);
                }

                .card-preview {
                    height: 180px;
                    background: #f8fafc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    position: relative;
                }
                .card-preview img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
                .equipped-badge {
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
                    background: var(--color-brand);
                    color: white;
                    font-size: 0.6rem;
                    font-weight: 800;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    gap: 0.2rem;
                }

                .card-info { padding: 1rem; text-align: center; }
                .card-info h4 {
                    font-family: var(--font-outfit);
                    font-weight: 700;
                    font-size: 0.95rem;
                    margin: 0 0 0.25rem;
                    color: var(--color-slate-dark);
                }
                .card-rarity {
                    font-size: 0.65rem;
                    font-weight: 800;
                    color: var(--color-slate-mid);
                    letter-spacing: 0.05em;
                }

                .saving-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(255,255,255,0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--color-brand);
                }

                .empty-state {
                    grid-column: 1 / -1;
                    padding: 4rem;
                    text-align: center;
                    background: white;
                    border-radius: 1.5rem;
                    border: 2px dashed var(--color-slate-border);
                }
                .empty-icon { margin-bottom: 1rem; display: flex; justify-content: center; opacity: 0.3; }
                .empty-state h3 { font-family: var(--font-outfit); font-weight: 800; margin: 0 0 0.5rem; }
                .empty-state p { font-size: 0.9rem; color: var(--color-slate-mid); }
            `})]})};export{B as InventoryManager};
