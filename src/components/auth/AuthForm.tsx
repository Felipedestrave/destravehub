import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface AuthFormProps {
    mode: 'login' | 'register';
}

export default function AuthForm({ mode }: AuthFormProps) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (mode === 'register') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                        data: { full_name: fullName },
                    },
                });

                if (error) throw error;

                // Salva o nome no profiles independente de confirmação
                if (data.user) {
                    await supabase.from('profiles').upsert({
                        id: data.user.id,
                        full_name: fullName,
                        role: 'teacher',
                    });
                }

                if (data.session) {
                    // Auto-confirm ativado: redireciona direto para o dashboard
                    window.location.href = '/dashboard';
                } else {
                    // Email de confirmação enviado: avisa o usuário
                    setMessage({
                        type: 'success',
                        text: '📧 Cadastro realizado! Verifique sua caixa de entrada (e o spam) para confirmar seu e-mail.',
                    });
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });

                if (error) {
                    // Mensagem amigável para email não confirmado
                    if (error.message.toLowerCase().includes('email not confirmed')) {
                        setMessage({
                            type: 'error',
                            text: '📧 Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada (e o spam).',
                        });
                        return;
                    }
                    throw error;
                }

                window.location.href = '/dashboard';
            }
        } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : 'Ocorreu um erro.';
            setMessage({ type: 'error', text: errMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card w-full max-w-md mx-auto">
            <h2 className="font-outfit font-bold text-2xl text-[var(--color-slate-dark)] mb-6 text-center">
                {mode === 'login' ? 'Entrar no Destrave Hub' : 'Criar sua conta de Professor'}
            </h2>

            {message && (
                <div
                    className={`mb-6 p-4 rounded-xl text-sm font-semibold ${message.type === 'success'
                        ? 'bg-[var(--color-brand)]/10 text-[var(--color-brand)]'
                        : 'bg-[var(--color-action)]/10 text-[var(--color-action-hover)]'
                        }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                    <div>
                        <label className="block text-sm font-semibold text-[var(--color-slate-dark)] mb-1.5">
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-[var(--color-slate-border)] bg-[var(--color-ice)] text-[var(--color-slate-dark)] text-sm focus:outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10 transition-all"
                            placeholder="Seu nome, ex: Ana Oliveira"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-[var(--color-slate-dark)] mb-1.5">
                        E-mail
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[var(--color-slate-border)] bg-[var(--color-ice)] text-[var(--color-slate-dark)] text-sm focus:outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10 transition-all"
                        placeholder="seu@email.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-[var(--color-slate-dark)] mb-1.5">
                        Senha
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--color-slate-border)] bg-[var(--color-ice)] text-[var(--color-slate-dark)] text-sm focus:outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/10 transition-all"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center disabled:opacity-50"
                >
                    {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Cadastrar agora'}
                </button>
            </form>

            <div className="mt-8 text-center border-t border-[var(--color-slate-border)] pt-6">
                <p className="text-sm text-[var(--color-slate-mid)]">
                    {mode === 'login' ? 'Ainda não tem conta?' : 'Já tem uma conta?'}
                    <a
                        href={mode === 'login' ? '/auth/register' : '/auth/login'}
                        className="ml-1.5 font-bold text-[var(--color-brand)] hover:underline"
                    >
                        {mode === 'login' ? 'Crie sua conta' : 'Faça login'}
                    </a>
                </p>
            </div>
        </div>
    );
}
