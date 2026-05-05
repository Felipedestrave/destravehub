import React, { useState } from 'react';
import { CheckCircle2, Loader2, Trophy, ArrowRight, AlertCircle, RefreshCcw } from 'lucide-react';

interface FinalizeMissionButtonProps {
    onFinalize: () => Promise<void>;
    onSuccessRedirect?: string;
    isFinalizing?: boolean;
    isFinalized?: boolean;
}

export const FinalizeMissionButton: React.FC<FinalizeMissionButtonProps> = ({ 
    onFinalize, 
    onSuccessRedirect = '/dashboard',
    isFinalizing: externalLoading,
    isFinalized: externalFinalized
}) => {
    const [internalLoading, setInternalLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [finalized, setFinalized] = useState(false);

    const isLoading = externalLoading || internalLoading;
    const isDone = externalFinalized || finalized;

    const handleAction = async () => {
        if (isDone) {
            window.location.href = onSuccessRedirect;
            return;
        }

        setError(null);
        setInternalLoading(true);
        try {
            await onFinalize();
            setFinalized(true);
        } catch (err: any) {
            console.error('[FinalizeButton] Error:', err);
            setError(err.message || 'Erro ao processar recompensas. Verifique sua conexão.');
        } finally {
            setInternalLoading(false);
        }
    };

    return (
        <div className="finalize-container">
            {!isDone ? (
                <div className="finalize-box">
                    {error && (
                        <div className="finalize-error">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <button 
                        onClick={handleAction} 
                        disabled={isLoading}
                        className={`finalize-btn ${isLoading ? 'loading' : ''} ${error ? 'has-error' : ''}`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={24} className="animate-spin" />
                                <span>Garantindo sua transação...</span>
                            </>
                        ) : (
                            <>
                                {error ? <RefreshCcw size={24} /> : <Trophy size={24} />}
                                <span>{error ? 'Tentar Novamente' : 'Finalizar Missão e Coletar Recompensas'}</span>
                                {!error && <ArrowRight size={20} className="finalize-arrow" />}
                            </>
                        )}
                    </button>
                    
                    <p className="finalize-hint">
                        {isLoading 
                            ? 'Aguarde o sinal verde do banco de dados para garantir suas moedas.' 
                            : 'Clique para registrar seu esforço e atualizar seu saldo imediatamente.'}
                    </p>
                </div>
            ) : (
                <div className="finalize-success-box animate-fade-up">
                    <div className="finalize-success-icon">
                        <CheckCircle2 size={48} />
                    </div>
                    <div className="finalize-success-text">
                        <h3>Missão Concluída com Sucesso!</h3>
                        <p>Suas recompensas foram depositadas. O saldo do seu Dashboard foi atualizado.</p>
                    </div>
                    <button 
                        onClick={() => window.location.href = onSuccessRedirect}
                        className="finalize-go-back"
                    >
                        <span>Ir para o Dashboard</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            )}

            <style>{`
                .finalize-container {
                    width: 100%;
                    margin-top: 2rem;
                    display: flex;
                    justify-content: center;
                }
                .finalize-box {
                    width: 100%;
                    max-width: 500px;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    text-align: center;
                }
                .finalize-error {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 1rem;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 1rem;
                    color: #dc2626;
                    font-family: var(--font-inter);
                    font-size: 0.875rem;
                    font-weight: 600;
                    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                }
                .finalize-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 1.25rem 2rem;
                    background: #22c55e;
                    color: white;
                    border: none;
                    border-radius: 1.25rem;
                    font-family: var(--font-outfit);
                    font-size: 1.15rem;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 10px 25px -5px rgba(34, 197, 94, 0.4);
                    position: relative;
                    overflow: hidden;
                }
                .finalize-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px -5px rgba(34, 197, 94, 0.5);
                    background: #16a34a;
                }
                .finalize-btn:active:not(:disabled) {
                    transform: translateY(1px);
                }
                .finalize-btn.loading {
                    background: #64748b;
                    box-shadow: none;
                    cursor: wait;
                }
                .finalize-btn.has-error {
                    background: #dc2626;
                    box-shadow: 0 10px 25px -5px rgba(220, 38, 38, 0.4);
                }
                .finalize-btn.has-error:hover {
                    background: #b91c1c;
                }
                .finalize-arrow {
                    transition: transform 200ms;
                }
                .finalize-btn:hover .finalize-arrow {
                    transform: translateX(4px);
                }
                .finalize-hint {
                    font-family: var(--font-inter);
                    font-size: 0.8rem;
                    color: #64748b;
                    margin: 0;
                    font-weight: 500;
                }
                
                .finalize-success-box {
                    width: 100%;
                    max-width: 500px;
                    background: #f0fdf4;
                    border: 2px solid #bbf7d0;
                    border-radius: 2rem;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 1.5rem;
                }
                .finalize-success-icon {
                    width: 80px;
                    height: 80px;
                    background: #22c55e;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3);
                }
                .finalize-success-text h3 {
                    font-family: var(--font-outfit);
                    font-size: 1.5rem;
                    font-weight: 900;
                    color: #166534;
                    margin: 0 0 0.5rem 0;
                }
                .finalize-success-text p {
                    font-family: var(--font-inter);
                    font-size: 0.95rem;
                    color: #15803d;
                    margin: 0;
                    line-height: 1.5;
                }
                .finalize-go-back {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 2rem;
                    background: #166534;
                    color: white;
                    border: none;
                    border-radius: 1rem;
                    font-family: var(--font-outfit);
                    font-weight: 800;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 150ms;
                }
                .finalize-go-back:hover {
                    transform: scale(1.05);
                    background: #14532d;
                }

                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
                @keyframes fade-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};
