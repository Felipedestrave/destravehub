import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { s as supabase } from './supabase_Cb0dhCq8.mjs';

function AuthForm({ mode }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            full_name: fullName,
            role: "teacher"
          });
        }
        if (data.session) {
          window.location.href = "/dashboard";
        } else {
          setMessage({
            type: "success",
            text: "📧 Cadastro realizado! Verifique sua caixa de entrada (e o spam) para confirmar seu e-mail."
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.toLowerCase().includes("email not confirmed")) {
            setMessage({
              type: "error",
              text: "📧 Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada (e o spam)."
            });
            return;
          }
          throw error;
        }
        window.location.href = "/dashboard";
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Ocorreu um erro.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "card w-full max-w-md mx-auto", children: [
    /* @__PURE__ */ jsx("h2", { className: "font-outfit font-bold text-2xl text-[var(--color-slate-dark)] mb-6 text-center", children: mode === "login" ? "Entrar no Destrave Hub" : "Criar sua conta de Professor" }),
    message && /* @__PURE__ */ jsx(
      "div",
      {
        className: `mb-6 p-4 rounded-xl text-sm font-semibold ${message.type === "success" ? "bg-[var(--color-brand)]/10 text-[var(--color-brand)]" : "bg-[var(--color-action)]/10 text-[var(--color-action-hover)]"}`,
        children: message.text
      }
    ),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      mode === "register" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-[var(--color-slate-dark)] mb-1.5", children: "Nome Completo" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: fullName,
            onChange: (e) => setFullName(e.target.value),
            required: true,
            className: "w-full px-4 py-3 rounded-xl border border-[var(--color-slate-border)] bg-[var(--color-ice)] text-[var(--color-slate-dark)] text-sm focus:outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10 transition-all",
            placeholder: "Seu nome, ex: Ana Oliveira"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-[var(--color-slate-dark)] mb-1.5", children: "E-mail" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
            className: "w-full px-4 py-3 rounded-xl border border-[var(--color-slate-border)] bg-[var(--color-ice)] text-[var(--color-slate-dark)] text-sm focus:outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10 transition-all",
            placeholder: "seu@email.com"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-semibold text-[var(--color-slate-dark)] mb-1.5", children: "Senha" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
            minLength: 6,
            className: "w-full px-4 py-3 rounded-xl border border-[var(--color-slate-border)] bg-[var(--color-ice)] text-[var(--color-slate-dark)] text-sm focus:outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10 transition-all",
            placeholder: "••••••••"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "btn-primary w-full justify-center disabled:opacity-50",
          children: loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar agora"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 text-center border-t border-[var(--color-slate-border)] pt-6", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-[var(--color-slate-mid)]", children: [
      mode === "login" ? "Ainda não tem conta?" : "Já tem uma conta?",
      /* @__PURE__ */ jsx(
        "a",
        {
          href: mode === "login" ? "/auth/register" : "/auth/login",
          className: "ml-1.5 font-bold text-[var(--color-brand)] hover:underline",
          children: mode === "login" ? "Crie sua conta" : "Faça login"
        }
      )
    ] }) })
  ] });
}

export { AuthForm as A };
