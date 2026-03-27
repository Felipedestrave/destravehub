import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, ShieldAlert, ArrowLeft } from 'lucide-react';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRole: 'teacher' | 'student';
    bypassIfAssignmentId?: string | null;
    publicAccess?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRole, bypassIfAssignmentId, publicAccess }) => {
    if (publicAccess || bypassIfAssignmentId) {
        return <>{children}</>;
    }

    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const checkRole = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setLoading(false);
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .maybeSingle();

            setRole(profile?.role || 'teacher');
            setLoading(false);
        };

        checkRole();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 size={32} className="text-brand animate-spin" />
                <p className="text-slate-mid font-outfit font-bold">Verificando permissões...</p>
            </div>
        );
    }

    // Se houver um assignmentId, permitimos que qualquer um (aluno ou professor) acesse a missão específica
    if (bypassIfAssignmentId) {
        return <>{children}</>;
    }

    if (role !== allowedRole) {
        return (
            <div className="max-w-md mx-auto py-20 px-6 text-center">
                <div className="bg-white rounded-3xl border-2 border-slate-border p-8 shadow-xl">
                    <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-600">
                        <ShieldAlert size={32} />
                    </div>
                    <h2 className="font-outfit text-2xl font-extrabold text-slate-dark mb-2">Acesso Restrito</h2>
                    <p className="text-slate-mid mb-8 text-sm">Esta área é exclusiva para professores gerarem conteúdos. Alunos podem acessar apenas missões atribuídas.</p>
                    <a href="/dashboard" className="btn-primary w-full justify-center">
                        <ArrowLeft size={18} />
                        Voltar ao Dashboard
                    </a>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
