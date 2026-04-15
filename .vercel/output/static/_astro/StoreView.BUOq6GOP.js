import{j as r}from"./jsx-runtime.u17CrQMm.js";import{r as s}from"./index.DrBtkhmp.js";import{S as T}from"./store.BRx3I6wk.js";import{s as d}from"./materials.astro_astro_type_script_index_0_lang.CbpkQ25P.js";import{C as g}from"./coins.B-8aAmPh.js";import{U as h}from"./user.Bpoa7zot.js";import{c as F}from"./createLucideIcon.BukDFzw_.js";import{T as x}from"./type.wDrmtEns.js";import{L as y}from"./loader-circle.CueQDEKg.js";import{C as P}from"./circle-check.CzS0XoDm.js";const R=[["path",{d:"M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",key:"e79jfc"}],["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"qy21gx"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"fotxhn"}]],v=F("palette",R),Y=()=>{const[c,p]=s.useState(null),[A,w]=s.useState(!0),[f,j]=s.useState("avatar"),[m,l]=s.useState(null),[u,n]=s.useState(null);s.useEffect(()=>{d.auth.getSession().then(({data:{session:e}})=>{e&&d.from("profiles").select("*").eq("id",e.user.id).single().then(({data:a})=>{p(a),w(!1)})})},[]);const k=[{id:"avatar",label:"Avatares",icon:h},{id:"theme",label:"Temas",icon:v},{id:"title",label:"Títulos",icon:x}],N=T.filter(e=>e.category===f),C=c?.inventory||[],b=c?.equipped||{},q=async e=>{l(e.id),n(null);try{const{data:{session:a}}=await d.auth.getSession();if(!a)throw new Error("Não autenticado");const t=await fetch("/api/store/purchase",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a.access_token}`},body:JSON.stringify({itemId:e.id})}),i=await t.json();if(!t.ok)throw new Error(i.error||"Falha na compra");p(o=>({...o,coins:i.newBalance,inventory:[...o.inventory||[],e.id]}))}catch(a){n(a.message)}finally{l(null)}},z=async e=>{l(`equip-${e.id}`),n(null);try{const{data:{session:a}}=await d.auth.getSession();if(!a)throw new Error("Não autenticado");const t={...b,[e.category]:e.id},i=await fetch("/api/store/equip",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a.access_token}`},body:JSON.stringify({equipped:t})}),o=await i.json();if(!i.ok)throw new Error(o.error||"Falha ao equipar");p(I=>({...I,equipped:t}))}catch(a){n(a.message)}finally{l(null)}},S=e=>{switch(e){case"common":return"rarity-common";case"rare":return"rarity-rare";case"epic":return"rarity-epic";case"legendary":return"rarity-legendary";default:return""}},E=e=>{switch(e){case"common":return"Comum";case"rare":return"Raro";case"epic":return"Épico";case"legendary":return"Lendário";default:return e}};return r.jsxs("div",{className:"store-view-container",children:[r.jsxs("div",{className:"store-header",children:[r.jsxs("div",{className:"balance-badge",children:[r.jsx("div",{className:"coin-icon-wrapper",children:r.jsx(g,{size:20,className:"text-amber-500"})}),r.jsxs("div",{className:"balance-info",children:[r.jsx("span",{className:"balance-label uppercase tracking-tighter opacity-70",children:"Saldo Atual"}),r.jsxs("span",{className:"balance-amount font-outfit font-black",children:[c?.coins||0," DC"]})]})]}),u&&r.jsxs("div",{className:"store-error-toast",children:[u,r.jsx("button",{onClick:()=>n(null),children:"×"})]})]}),r.jsx("div",{className:"store-categories",children:k.map(e=>r.jsxs("button",{onClick:()=>j(e.id),className:`cat-btn ${f===e.id?"active":""}`,children:[r.jsx(e.icon,{size:18}),r.jsx("span",{children:e.label})]},e.id))}),r.jsx("div",{className:"store-grid",children:N.map(e=>{const a=C.includes(e.id),t=b[e.category]===e.id,i=(c?.coins||0)>=e.price,o=m===e.id||m===`equip-${e.id}`;return r.jsxs("div",{className:`store-card ${a?"owned":""} ${S(e.rarity)}`,children:[r.jsx("div",{className:"card-rarity-tag",children:E(e.rarity)}),r.jsx("div",{className:"card-preview",children:e.category==="avatar"?r.jsx("div",{className:"preview-avatar-bg",style:{width:"100%",aspectRatio:"1/1",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"},children:e.previewUrl?r.jsx("img",{src:e.previewUrl,alt:e.name,style:{width:"100%",height:"100%",objectFit:"contain"}}):r.jsxs(r.Fragment,{children:[r.jsx(h,{size:48,className:"text-slate-200"}),r.jsx("div",{className:"preview-indicator",children:"PRÉVIA"})]})}):e.category==="theme"?r.jsx("div",{className:"preview-theme-bg",style:{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",background:e.metadata?.class==="theme-midnight"?"#1e1b4b":e.metadata?.class==="theme-sakura"?"#fdf2f8":"#f8fafc"},children:e.previewUrl?r.jsx("img",{src:e.previewUrl,alt:e.name,style:{width:"100%",height:"100%",objectFit:"cover"}}):r.jsx(v,{size:48,className:"opacity-20"})}):r.jsx("div",{className:"preview-title-bg",style:{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",borderRadius:"1.25rem",background:"#f8fafc"},children:e.previewUrl?r.jsx("img",{src:e.previewUrl,alt:e.name,style:{width:"100%",height:"100%",objectFit:"cover"}}):r.jsxs(r.Fragment,{children:[r.jsx(x,{size:48,className:"text-slate-200"}),r.jsx("div",{className:"preview-indicator",children:"PRÉVIA"})]})})}),r.jsxs("div",{className:"card-info",children:[r.jsx("h3",{className:"item-name font-outfit font-black",children:e.name}),r.jsx("p",{className:"item-desc",children:e.description})]}),r.jsx("div",{className:"card-actions",children:a?r.jsx("button",{onClick:()=>z(e),disabled:t||o,className:`btn-equip ${t?"equipped":""}`,children:o?r.jsx(y,{className:"animate-spin",size:16}):t?r.jsxs(r.Fragment,{children:[r.jsx(P,{size:16})," Equipado"]}):"Equipar"}):r.jsx("button",{onClick:()=>q(e),disabled:!i||o,className:"btn-buy",children:o?r.jsx(y,{className:"animate-spin",size:16}):r.jsxs(r.Fragment,{children:[r.jsx(g,{size:16}),r.jsxs("span",{children:[e.price," DC"]})]})})})]},e.id)})}),r.jsx("style",{children:`
                .store-view-container {
                    display: flex; flex-direction: column; gap: 2rem;
                }
                .store-header { display: flex; align-items: center; justify-content: space-between; }
                .balance-badge {
                    background: white; border: 2px solid var(--color-slate-border); padding: 0.75rem 1.25rem;
                    border-radius: 1.25rem; display: flex; align-items: center; gap: 1rem;
                    box-shadow: 0 4px 20px -5px rgba(0,0,0,0.05);
                }
                .coin-icon-wrapper { width: 36px; height: 36px; background: #fffbeb; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; border: 1.5px solid #fef3c7; }
                .balance-info { display: flex; flex-direction: column; }
                .balance-label { font-size: 0.65rem; font-weight: 800; }
                .balance-amount { font-size: 1.25rem; color: #d97706; line-height: 1; }

                .store-categories { display: flex; gap: 0.75rem; }
                .cat-btn {
                    padding: 0.75rem 1.5rem; border-radius: 1rem; border: 2px solid var(--color-slate-border);
                    background: white; font-family: var(--font-outfit); font-weight: 800; color: var(--color-slate-mid);
                    display: flex; align-items: center; gap: 0.6rem; cursor: pointer; transition: all 0.2s;
                }
                .cat-btn.active { border-color: var(--color-brand); color: var(--color-brand); background: var(--color-ice); box-shadow: 0 8px 15px -5px rgba(88,49,126,0.1); }
                .cat-btn:hover:not(.active) { background: #f8fafc; border-color: #cbd5e1; }

                .store-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; }
                
                .store-card {
                    background: white; border: 2.5px solid var(--color-slate-border); border-radius: 2rem;
                    padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;
                    position: relative; overflow: hidden; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .store-card:hover { transform: translateY(-8px); border-color: var(--color-brand); box-shadow: 0 20px 40px -15px rgba(88,49,126,0.15); }
                .store-card.owned { border-color: #e2e8f0; background: #fcfcfd; }
                
                .card-rarity-tag {
                    position: absolute; top: 1rem; right: 1rem; font-size: 0.6rem; font-weight: 900;
                    text-transform: uppercase; padding: 0.2rem 0.6rem; border-radius: 99px; letter-spacing: 0.05em;
                }
                .rarity-common .card-rarity-tag { background: #f1f5f9; color: #475569; }
                .rarity-rare .card-rarity-tag { background: #dcfce7; color: #166534; }
                .rarity-epic .card-rarity-tag { background: #f3e8ff; color: #6b21a8; }
                .rarity-legendary .card-rarity-tag { background: #fff7ed; color: #9a3412; border: 1px solid #ffedd5; }

                .card-preview {
                    aspect-ratio: 1 / 1;
                    width: 100%;
                    border-radius: 1.25rem; 
                    background: #f8fafc;
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    position: relative;
                    margin-top: 1.5rem;
                }
                .preview-indicator { position: absolute; bottom: 0.5rem; font-size: 0.55rem; font-weight: 900; color: #94a3b8; letter-spacing: 0.1em; }
                .preview-title-bg { display: flex; flex-direction: column; align-items: center; }

                .card-info { flex: 1; }
                .item-name { font-size: 1.25rem; color: var(--color-slate-dark); margin: 0 0 0.25rem; }
                .item-desc { font-size: 0.85rem; color: var(--color-slate-mid); line-height: 1.4; margin: 0; }

                .btn-buy, .btn-equip {
                    width: 100%; padding: 0.85rem; border-radius: 1rem; font-family: var(--font-outfit);
                    font-weight: 800; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                }
                .btn-buy { background: var(--color-brand); color: white; border: none; }
                .btn-buy:hover:not(:disabled) { transform: scale(1.03); filter: brightness(1.1); box-shadow: 0 10px 20px -5px rgba(88,49,126,0.3); }
                .btn-buy:disabled { opacity: 0.3; cursor: not-allowed; filter: grayscale(1); }

                .btn-equip { background: white; border: 2px solid var(--color-slate-border); color: var(--color-slate-dark); }
                .btn-equip:hover:not(:disabled) { background: #f8fafc; border-color: var(--color-brand); color: var(--color-brand); }
                .btn-equip.equipped { background: #f0fdf4; border-color: #22c55e; color: #166534; cursor: default; }

                .store-error-toast { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 0.5rem 1rem; border-radius: 0.75rem; font-size: 0.8rem; display: flex; align-items: center; gap: 0.75rem; }
            `})]})};export{Y as StoreView};
