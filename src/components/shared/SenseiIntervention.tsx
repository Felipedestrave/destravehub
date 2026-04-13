import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, AlertTriangle } from 'lucide-react';

interface SenseiInterventionProps {
  isVisible: boolean;
  onClose: () => void;
  teacherName: string;
  teacherAvatar: string;
  message?: string;
  whatsapp?: string | null;
}

export const SenseiIntervention: React.FC<SenseiInterventionProps> = ({
  isVisible,
  onClose,
  teacherName,
  teacherAvatar,
  message = "Humm... notei que esta parte está um pouco desafiadora. Quer dar uma olhadinha no material de apoio ou me chamar para tirar uma dúvida?",
  whatsapp
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-[2000] max-w-sm w-full"
        >
          <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-2 border-brand/10 overflow-hidden relative">
            {/* Cabeçalho com Gradient */}
            <div className="bg-gradient-to-r from-brand to-brand-light p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={teacherAvatar} 
                    alt={teacherName} 
                    className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1 border-2 border-white shadow-sm">
                    <AlertTriangle size={10} className="text-brand" fill="currentColor" />
                  </div>
                </div>
                <div>
                  <h4 className="font-outfit font-bold text-white text-sm leading-tight">Intervenção do Sensei</h4>
                  <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">{teacherName}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              <div className="relative">
                <div className="absolute -top-2 -left-2 text-brand/10 select-none">
                   <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H5.01703C3.91246 16 3.01703 16.8954 3.01703 18V21M17.017 10C17.017 12.2091 15.2261 14 13.017 14C10.8079 14 9.01703 12.2091 9.01703 10C9.01703 7.79086 10.8079 6 13.017 6C15.2261 6 17.017 7.79086 17.017 10Z"/></svg>
                </div>
                <p className="font-inter text-slate-700 text-sm leading-relaxed relative z-10">
                  {message}
                </p>
              </div>

              {/* Ações */}
              <div className="mt-6 flex flex-col gap-2">
                {whatsapp && (
                  <a 
                    href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-outfit font-bold shadow-lg shadow-green-200 transition-all active:scale-95"
                  >
                    <MessageCircle size={18} />
                    Chamar no WhatsApp
                  </a>
                )}
                <button 
                  onClick={onClose}
                  className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl font-outfit font-bold transition-all text-xs"
                >
                  Continuar Tentando
                </button>
              </div>
            </div>

            {/* Detalhe Decorativo de Mangá */}
            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-brand/5 rounded-full blur-2xl -z-10"></div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
