import { c as createComponent } from './astro-component_TxnqfewT.mjs';
import 'piccolore';
import { p as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_6sju6Ftj.mjs';
import { $ as $$DashboardLayout } from './DashboardLayout_B_DQSMrb.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { s as supabase } from './supabase_Cb0dhCq8.mjs';
import { S as STORE_ITEMS } from './store_BEgSzlvS.mjs';
import { Loader2, Shield, Image, Sparkles, Layers, ArrowLeft, Check, Backpack } from 'lucide-react';

const InventoryManager = () => {
  const [inventory, setInventory] = useState([]);
  const [equipped, setEquipped] = useState({ avatar: null, theme: null, title: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [activeTab, setActiveTab] = useState("avatar");
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: profile } = await supabase.from("profiles").select("inventory, equipped").eq("id", session.user.id).single();
      if (profile) {
        setInventory(profile.inventory || []);
        setEquipped(profile.equipped || { avatar: null, theme: null, title: null });
      }
    } catch (err) {
      console.error("[Inventory] Error fetching:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchInventory();
  }, []);
  const handleEquip = async (item) => {
    setSaving(item.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const newEquipped = { ...equipped };
      newEquipped[item.category] = item.id;
      const res = await fetch("/api/store/equip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ equipped: newEquipped })
      });
      if (res.ok) {
        setEquipped(newEquipped);
        if (item.category === "theme") {
          window.dispatchEvent(new CustomEvent("theme-changed", { detail: item.id }));
        }
      }
    } catch (err) {
      console.error("[Inventory] Error equipping:", err);
    } finally {
      setSaving(null);
    }
  };
  const myItems = STORE_ITEMS.filter((item) => inventory.includes(item.id));
  const filteredItems = myItems.filter((item) => item.category === activeTab);
  if (loading) return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-20", children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin text-brand", size: 40 }) });
  return /* @__PURE__ */ jsxs("div", { className: "inventory-view", children: [
    /* @__PURE__ */ jsx("div", { className: "inventory-header", children: /* @__PURE__ */ jsxs("div", { className: "header-tabs", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("avatar"),
          className: `tab-btn ${activeTab === "avatar" ? "active" : ""}`,
          children: [
            /* @__PURE__ */ jsx(Shield, { size: 18 }),
            " Avatares"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("theme"),
          className: `tab-btn ${activeTab === "theme" ? "active" : ""}`,
          children: [
            /* @__PURE__ */ jsx(Image, { size: 18 }),
            " Cenários"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("title"),
          className: `tab-btn ${activeTab === "title" ? "active" : ""}`,
          children: [
            /* @__PURE__ */ jsx(Sparkles, { size: 18 }),
            " Títulos"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "inventory-grid", children: filteredItems.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "empty-state", children: [
      /* @__PURE__ */ jsx("div", { className: "empty-icon text-slate-300", children: /* @__PURE__ */ jsx(Layers, { size: 64, strokeWidth: 1 }) }),
      /* @__PURE__ */ jsx("h3", { children: "Nada por aqui ainda!" }),
      /* @__PURE__ */ jsx("p", { children: "Visite a loja para desbloquear itens lendários com seus pontos." }),
      /* @__PURE__ */ jsxs("a", { href: "/dashboard/store", className: "mt-4 inline-flex items-center gap-2 text-brand font-bold hover:underline", children: [
        "Ir para a Loja ",
        /* @__PURE__ */ jsx(ArrowLeft, { className: "rotate-180", size: 16 })
      ] })
    ] }) : filteredItems.map((item) => {
      const isEquipped = equipped[item.category] === item.id;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: `inventory-card ${isEquipped ? "equipped" : ""}`,
          onClick: () => !isEquipped && handleEquip(item),
          children: [
            /* @__PURE__ */ jsxs("div", { className: "card-preview", children: [
              /* @__PURE__ */ jsx("img", { src: item.previewUrl, alt: item.name }),
              isEquipped && /* @__PURE__ */ jsxs("div", { className: "equipped-badge", children: [
                /* @__PURE__ */ jsx(Check, { size: 12 }),
                " EQUIPADO"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "card-info", children: [
              /* @__PURE__ */ jsx("h4", { children: item.name }),
              /* @__PURE__ */ jsx("span", { className: "card-rarity", children: item.rarity.toUpperCase() })
            ] }),
            saving === item.id && /* @__PURE__ */ jsx("div", { className: "saving-overlay", children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin", size: 24 }) })
          ]
        },
        item.id
      );
    }) }),
    /* @__PURE__ */ jsx("style", { children: `
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
            ` })
  ] });
};

const $$Inventory = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Meu Inventário | Mercado Destrave", "data-astro-cid-b7a4kx7m": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="inventory-page container mx-auto px-4 py-8" data-astro-cid-b7a4kx7m> <div class="flex items-center gap-4 mb-8" data-astro-cid-b7a4kx7m> <div class="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center text-brand" data-astro-cid-b7a4kx7m> ${renderComponent($$result2, "Backpack", Backpack, { "size": 32, "data-astro-cid-b7a4kx7m": true })} </div> <div data-astro-cid-b7a4kx7m> <h1 class="text-3xl font-black text-slate-800 font-outfit" data-astro-cid-b7a4kx7m>Seu Acervo</h1> <p class="text-slate-500 font-bold" data-astro-cid-b7a4kx7m>Gerencie seus itens equipados e personalize sua experiência.</p> </div> </div> ${renderComponent($$result2, "InventoryManager", InventoryManager, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Felipe Kawakami/Aplicativos/src/components/inventory/InventoryManager", "client:component-export": "InventoryManager", "data-astro-cid-b7a4kx7m": true })} </div> ` })}`;
}, "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/inventory.astro", void 0);

const $$file = "C:/Users/Felipe Kawakami/Aplicativos/src/pages/dashboard/inventory.astro";
const $$url = "/dashboard/inventory";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Inventory,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
