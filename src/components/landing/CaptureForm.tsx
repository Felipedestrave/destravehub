import React, { useState } from 'react';

const COUNTRIES = [
    { code: '+55', name: 'Brasil 🇧🇷', mask: '(99) 99999-9999' },
    { code: '+81', name: 'Japão 🇯🇵', mask: '99 9999-9999' }
];

const LEVELS = [
    'Iniciante do Zero',
    'Já estudei / Sei o básico',
    'Intermediário / Avançado'
];

interface Props {
    variant: 'A' | 'B' | 'C';
}

export default function CaptureForm({ variant }: Props) {
    const [name, setName] = useState('');
    const [whatsappInput, setWhatsappInput] = useState('');
    const [country, setCountry] = useState(COUNTRIES[0]);
    const [level, setLevel] = useState(LEVELS[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, ''); // Apenas números
        
        // Limita a 11 dígitos para ambos
        if (val.length > 11) {
            val = val.substring(0, 11);
        }
        setWhatsappInput(val);
    };

    const formatDisplayPhone = (val: string) => {
        if (!val) return '';
        if (country.code === '+55') {
            // (99) 99999-9999
            let m = val.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
            if (!m) return val;
            return (!m[2] ? m[1] : `(${m[1]}) ${m[2]}` + (m[3] ? `-${m[3]}` : ''));
        }
        if (country.code === '+81') {
            // 99 9999 9999
            let m = val.match(/^(\d{0,3})(\d{0,4})(\d{0,4})$/);
            if (!m) return val;
            return m[1] + (m[2] ? ` ${m[2]}` : '') + (m[3] ? ` ${m[3]}` : '');
        }
        return val;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('Por favor, informe seu nome completo.');
            return;
        }

        // Validação simples de tamanho de telefone: celulares no Brasil (+55) têm 11 dígitos, no Japão (+81) têm 10 ou 11 dígitos (geralmente 11 para celulares 090/080/070, 10 para fixos).
        if (whatsappInput.length < 10) {
            setError('Por favor, informe um número de WhatsApp válido.');
            return;
        }

        setLoading(true);
        const fullWhatsapp = `${country.code}${whatsappInput}`;

        try {
            const res = await fetch('/api/leads/landing-capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    whatsapp: fullWhatsapp,
                    level,
                    variant
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Erro ao salvar os dados.');
            }

            // Redireciona dinamicamente para o WhatsApp do Felipe Sensei
            const msg = `Olá, Felipe Sensei! Meu nome é ${data.name}, tenho nível "${data.level}" de japonês e acabei de assistir ao vídeo da plataforma. Quero agendar o meu bate-papo de 40 minutos para destravar!`;
            
            // Felipe Sensei's WhatsApp: 5561991623748
            const waUrl = `https://wa.me/5561991623748?text=${encodeURIComponent(msg)}`;
            
            window.location.href = waUrl;

        } catch (err: any) {
            console.error('Submit error:', err);
            setError(err.message || 'Erro inesperado. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-[var(--color-slate-border)] rounded-3xl p-8 max-w-xl mx-auto space-y-6 shadow-xl relative overflow-hidden">
            {/* Efeito decorativo sutil de fundo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand)]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--color-action)]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="text-center mb-6">
                <h3 className="font-outfit font-bold text-2xl text-[var(--color-slate-dark)]">Quero Conversar com o Sensei</h3>
                <p className="text-sm text-[var(--color-slate-mid)] mt-1">Preencha o formulário e fale diretamente no WhatsApp</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-sm font-semibold">
                    ⚠️ {error}
                </div>
            )}

            {/* Input Nome */}
            <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-slate-mid)]">Nome Completo</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-slate-50 border border-[var(--color-slate-border)] focus:border-[var(--color-brand)] focus:bg-white rounded-2xl px-5 py-4 text-[var(--color-slate-dark)] text-base outline-none transition-all placeholder:text-slate-400 font-medium"
                />
            </div>

            {/* Input WhatsApp */}
            <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-slate-mid)]">WhatsApp (Celular)</label>
                <div className="flex gap-2">
                    {/* Seletor DDI */}
                    <div className="relative">
                        <select
                            value={country.code}
                            onChange={(e) => {
                                const c = COUNTRIES.find(x => x.code === e.target.value);
                                if (c) {
                                    setCountry(c);
                                    setWhatsappInput('');
                                }
                            }}
                            className="bg-slate-50 border border-[var(--color-slate-border)] focus:border-[var(--color-brand)] focus:bg-white rounded-2xl px-4 py-4 text-[var(--color-slate-dark)] text-base outline-none appearance-none cursor-pointer pr-8 font-bold"
                        >
                            {COUNTRIES.map((c) => (
                                <option key={c.code} value={c.code} className="bg-white text-[var(--color-slate-dark)]">
                                    {c.code} {c.name.split(' ')[1]}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                            ▼
                        </div>
                    </div>
                    {/* Input do Número */}
                    <input
                        type="tel"
                        required
                        value={formatDisplayPhone(whatsappInput)}
                        onChange={handleWhatsappChange}
                        placeholder={country.mask}
                        className="flex-1 bg-slate-50 border border-[var(--color-slate-border)] focus:border-[var(--color-brand)] focus:bg-white rounded-2xl px-5 py-4 text-[var(--color-slate-dark)] text-base outline-none transition-all placeholder:text-slate-400 font-bold"
                    />
                </div>
            </div>

            {/* Nível de Japonês */}
            <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-slate-mid)]">Seu Nível de Japonês</label>
                <div className="relative">
                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full bg-slate-50 border border-[var(--color-slate-border)] focus:border-[var(--color-brand)] focus:bg-white rounded-2xl px-5 py-4 text-[var(--color-slate-dark)] text-base outline-none appearance-none cursor-pointer pr-10 font-medium"
                    >
                        {LEVELS.map((lvl) => (
                            <option key={lvl} value={lvl} className="bg-white text-[var(--color-slate-dark)]">
                                {lvl}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                        ▼
                    </div>
                </div>
            </div>

            {/* Botão de Enviar */}
            <button
                type="submit"
                disabled={loading}
                className="w-full btn-action !bg-[var(--color-action)] hover:!bg-[var(--color-action-hover)] text-white font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Registrando...
                    </>
                ) : (
                    'Cadastrar & Abrir WhatsApp'
                )}
            </button>

            <p className="text-center text-xs text-[var(--color-slate-mid)] mt-4 leading-relaxed">
                🔒 Seus dados estão protegidos. Contato 100% livre de spam e sem compromisso.
            </p>
        </form>
    );
}
