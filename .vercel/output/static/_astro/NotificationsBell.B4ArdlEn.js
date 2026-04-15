import{j as o}from"./jsx-runtime.u17CrQMm.js";import{r as c}from"./index.DrBtkhmp.js";import{s as l}from"./materials.astro_astro_type_script_index_0_lang.CbpkQ25P.js";import{m as x}from"./proxy.BLcRGA29.js";import{c as b}from"./createLucideIcon.BukDFzw_.js";const v=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]],w=b("bell",v),u={async getUnreadCount(i){const{count:e,error:a}=await l.from("notifications").select("*",{count:"exact",head:!0}).eq("user_id",i).eq("read",!1);return a?(console.error("Error fetching notification count:",a),0):e||0},async listNotifications(i,e=10){const{data:a,error:r}=await l.from("notifications").select("*").eq("user_id",i).order("created_at",{ascending:!1}).limit(e);return r?(console.error("Error listing notifications:",r),[]):a},async markAsRead(i){const{error:e}=await l.from("notifications").update({read:!0}).eq("id",i);e&&console.error("Error marking as read:",e)},async markAllAsRead(i){const{error:e}=await l.from("notifications").update({read:!0}).eq("user_id",i).eq("read",!1);e&&console.error("Error marking all as read:",e)},async sendNotification(i,e,a,r,d){const{error:n}=await l.from("notifications").insert({user_id:i,title:e,message:a,type:r,link:d});n&&console.error("Error sending notification:",n)}},y=({userId:i,isOpen:e,onClose:a})=>{const[r,d]=c.useState([]),[n,m]=c.useState(!0);c.useEffect(()=>{e&&i&&f()},[e,i]);const f=async()=>{if(i)try{m(!0);const t=await u.listNotifications(i);d(t)}catch(t){console.error("Erro ao carregar notificações:",t)}finally{m(!1)}},p=async t=>{await u.markAsRead(t),d(h=>h.map(g=>g.id===t?{...g,read:!0}:g))},s=async()=>{await u.markAllAsRead(i),d(t=>t.map(h=>({...h,read:!0})))};return e?o.jsxs("div",{className:"notifications-dropdown-container",children:[o.jsx("div",{className:"notifications-overlay",onClick:a}),o.jsxs(x.div,{initial:{opacity:0,y:-10,scale:.95},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:-10,scale:.95},className:"notifications-dropdown",children:[o.jsxs("div",{className:"dropdown-header",children:[o.jsx("h3",{className:"dropdown-title",children:"Notificações"}),r.some(t=>!t.read)&&o.jsx("button",{onClick:s,className:"mark-all-btn",children:"Ler tudo"})]}),o.jsx("div",{className:"dropdown-body",children:n?o.jsx("div",{className:"dropdown-state",children:"Carregando..."}):r.length===0?o.jsx("div",{className:"dropdown-state",children:"Nenhuma notificação por enquanto."}):o.jsx("div",{className:"notifications-list",children:r.map(t=>o.jsxs("div",{className:`notification-item ${t.read?"read":"unread"}`,onClick:()=>p(t.id),children:[o.jsx("div",{className:"notification-icon",children:t.type==="assignment"?"🎯":t.type==="completion"?"✅":"📢"}),o.jsxs("div",{className:"notification-content",children:[o.jsx("p",{className:"notification-title",children:t.title}),o.jsx("p",{className:"notification-msg",children:t.message}),o.jsx("span",{className:"notification-time",children:new Date(t.created_at).toLocaleDateString("pt-BR")})]}),!t.read&&o.jsx("div",{className:"unread-dot"})]},t.id))})})]}),o.jsx("style",{jsx:!0,children:`
        .notifications-dropdown-container {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 2000;
        }
        .notifications-overlay {
          position: fixed;
          inset: 0;
          z-index: -1;
        }
        .notifications-dropdown {
          width: 320px;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
          border: 1px solid var(--color-slate-border);
          margin-top: 0.5rem;
          overflow: hidden;
        }
        .dropdown-header {
          padding: 1rem;
          border-bottom: 1px solid var(--color-slate-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--color-white);
        }
        .dropdown-title {
          font-family: var(--font-outfit);
          font-weight: 700;
          font-size: 1rem;
          margin: 0;
          color: var(--color-slate-dark);
        }
        .mark-all-btn {
          background: none;
          border: none;
          color: var(--color-action);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }
        .dropdown-body {
          max-height: 400px;
          overflow-y: auto;
        }
        .dropdown-state {
          padding: 3rem 1rem;
          text-align: center;
          color: var(--color-slate-mid);
          font-size: 0.9rem;
        }
        .notification-item {
          padding: 1rem;
          display: flex;
          gap: 1rem;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid var(--color-slate-border);
          position: relative;
        }
        .notification-item:last-child {
          border-bottom: none;
        }
        .notification-item:hover {
          background: var(--color-ice);
        }
        .notification-item.unread {
          background: #f0f7ff;
        }
        .notification-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }
        .notification-content {
          flex: 1;
        }
        .notification-title {
          font-weight: 700;
          font-size: 0.875rem;
          margin: 0;
          color: var(--color-slate-dark);
        }
        .notification-msg {
          font-size: 0.8rem;
          color: var(--color-slate-mid);
          margin: 0.2rem 0;
          line-height: 1.4;
        }
        .notification-time {
          font-size: 0.7rem;
          color: var(--color-slate-mid);
          font-weight: 500;
        }
        .unread-dot {
          width: 8px;
          height: 8px;
          background: var(--color-action);
          border-radius: 50%;
          position: absolute;
          top: 1.25rem;
          right: 0.75rem;
        }
      `})]}):null},E=({userId:i})=>{const[e,a]=c.useState(!1),[r,d]=c.useState(0),[n,m]=c.useState(i||null);c.useEffect(()=>{n||l.auth.getSession().then(({data:{session:s}})=>{s?.user?.id&&m(s.user.id)})},[i]),c.useEffect(()=>{if(n){f();const s=setInterval(f,6e4);return()=>clearInterval(s)}},[n]);const f=async()=>{if(!n)return;const s=await u.getUnreadCount(n);d(s)},p=()=>{a(!e),e||f()};return o.jsxs("div",{className:"relative inline-block",children:[o.jsxs("button",{onClick:p,className:"notifications-btn","aria-label":"Notificações",children:[o.jsx(w,{size:20}),r>0&&o.jsx("span",{className:"notifications-badge",children:r>9?"9+":r})]}),o.jsx(y,{userId:n,isOpen:e,onClose:()=>a(!1)}),o.jsx("style",{jsx:!0,children:`
        .notifications-btn {
          position: relative;
          background: none;
          border: none;
          color: var(--color-slate-mid);
          cursor: pointer;
          padding: 0.6rem;
          border-radius: 50%;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .notifications-btn:hover {
          background-color: var(--color-ice);
          color: var(--color-action);
        }
        .notifications-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          min-width: 16px;
          height: 16px;
          padding: 0 4px;
          background-color: #ff4d4d;
          border: 2px solid white;
          border-radius: 8px;
          font-size: 0.65rem;
          font-weight: 800;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `})]})};export{E as NotificationsBell};
