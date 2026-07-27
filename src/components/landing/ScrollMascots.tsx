import React from 'react';
import { motion } from 'framer-motion';

interface MascotProps {
    className?: string;
}

export function TanukiMascot({ className = '' }: MascotProps) {
    return (
        <div className={`pointer-events-none z-10 ${className}`}>
            <motion.div
                initial={{ opacity: 0, x: -100, y: 50, rotate: -25 }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotate: -10 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                className="relative group cursor-pointer pointer-events-auto"
            >
                <img src="/assets/avatars/tanuki-novato.png" alt="Tanuki Novato" className="drop-shadow-2xl" />
                
                {/* Balão de Fala Japonês Interativo */}
                <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-10 -right-10 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-700 shadow-md whitespace-nowrap"
                >
                    <span className="block group-hover:hidden">ええと…</span>
                    <span className="hidden group-hover:block text-amber-400 font-semibold">Eeto... (Hum...)</span>
                    <div className="absolute bottom-[-5px] left-4 w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-700 rotate-45"></div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export function AshigaruMascot({ className = '' }: MascotProps) {
    return (
        <div className={`pointer-events-none z-10 ${className}`}>
            <motion.div
                initial={{ opacity: 0, x: 100, y: 50, rotate: 25 }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotate: 10 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                className="relative group cursor-pointer pointer-events-auto"
            >
                <img src="/assets/avatars/ashigaru.png" alt="Ashigaru" className="drop-shadow-2xl" />
                
                {/* Balão de Fala Japonês Interativo */}
                <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-10 -left-12 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-700 shadow-md whitespace-nowrap"
                >
                    <span className="block group-hover:hidden">了解！</span>
                    <span className="hidden group-hover:block text-emerald-400 font-semibold">Ryokai! (Entendido!)</span>
                    <div className="absolute bottom-[-5px] right-4 w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-700 rotate-45"></div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export function ShinobiMascot({ className = '' }: MascotProps) {
    return (
        <div className={`pointer-events-none z-10 ${className}`}>
            <motion.div
                initial={{ opacity: 0, x: -100, y: 50, rotate: -20 }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotate: -5 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                className="relative group cursor-pointer pointer-events-auto"
            >
                <img src="/assets/avatars/shinobi.png" alt="Shinobi" className="drop-shadow-2xl" />
                
                {/* Balão de Fala Japonês Interativo */}
                <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-10 -right-8 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-700 shadow-md whitespace-nowrap"
                >
                    <span className="block group-hover:hidden">秘密…</span>
                    <span className="hidden group-hover:block text-purple-400 font-semibold">Himitsu... (Segredo...)</span>
                    <div className="absolute bottom-[-5px] left-4 w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-700 rotate-45"></div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export function SamuraiZenMascot({ className = '' }: MascotProps) {
    return (
        <div className={`pointer-events-none z-10 ${className}`}>
            <motion.div
                initial={{ opacity: 0, x: 100, y: 50, rotate: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotate: 5 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                className="relative group cursor-pointer pointer-events-auto"
            >
                <img src="/assets/avatars/samurai-zen.png" alt="Samurai Zen" className="drop-shadow-2xl" />
                
                {/* Balão de Fala Japonês Interativo */}
                <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-10 -left-16 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-700 shadow-md whitespace-nowrap"
                >
                    <span className="block group-hover:hidden">落ち着いて</span>
                    <span className="hidden group-hover:block text-cyan-400 font-semibold">Ochitsuite (Calma)</span>
                    <div className="absolute bottom-[-5px] right-6 w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-700 rotate-45"></div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export function RoninMascot({ className = '' }: MascotProps) {
    return (
        <div className={`pointer-events-none z-10 ${className}`}>
            <motion.div
                initial={{ opacity: 0, x: -100, y: 30, rotate: -15 }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotate: -5 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                className="relative group cursor-pointer pointer-events-auto"
            >
                <img src="/assets/avatars/ronin.png" alt="Ronin" className="drop-shadow-2xl" />
                
                {/* Balão de Fala Japonês Interativo */}
                <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-10 -right-8 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-700 shadow-md whitespace-nowrap"
                >
                    <span className="block group-hover:hidden">やった！</span>
                    <span className="hidden group-hover:block text-orange-400 font-semibold">Yatta! (Consegui!)</span>
                    <div className="absolute bottom-[-5px] left-4 w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-700 rotate-45"></div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export function OnnaMushaMascot({ className = '' }: MascotProps) {
    return (
        <div className={`pointer-events-none z-10 ${className}`}>
            <motion.div
                initial={{ opacity: 0, x: 100, y: 30, rotate: 15 }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotate: 5 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                className="relative group cursor-pointer pointer-events-auto"
            >
                <img src="/assets/avatars/onna-musha.png" alt="Onna-musha" className="drop-shadow-2xl" />
                
                {/* Balão de Fala Japonês Interativo */}
                <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-10 -left-20 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-700 shadow-md whitespace-nowrap"
                >
                    <span className="block group-hover:hidden">どれにしよう…</span>
                    <span className="hidden group-hover:block text-rose-400 font-semibold">Dore ni shiyo... (Qual eu escolho?)</span>
                    <div className="absolute bottom-[-5px] right-6 w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-700 rotate-45"></div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export function NinjaSapecaMascot({ className = '' }: MascotProps) {
    return (
        <div className={`pointer-events-none z-10 ${className}`}>
            <motion.div
                initial={{ opacity: 0, x: -100, y: 40, rotate: -20 }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotate: -10 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                className="relative group cursor-pointer pointer-events-auto"
            >
                <img src="/assets/avatars/ninja-sapeca.png" alt="Ninja Sapeca" className="drop-shadow-2xl" />
                
                {/* Balão de Fala Japonês Interativo */}
                <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-10 -right-8 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-700 shadow-md whitespace-nowrap"
                >
                    <span className="block group-hover:hidden">マジで？</span>
                    <span className="hidden group-hover:block text-red-400 font-semibold">Maji de? (Sério?)</span>
                    <div className="absolute bottom-[-5px] left-4 w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-700 rotate-45"></div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export function ShogunMascot({ className = '' }: MascotProps) {
    return (
        <div className={`pointer-events-none z-10 ${className}`}>
            <motion.div
                initial={{ opacity: 0, x: 100, y: 40, rotate: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotate: 10 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                className="relative group cursor-pointer pointer-events-auto"
            >
                <img src="/assets/avatars/shogun.png" alt="Shogun" className="drop-shadow-2xl" />
                
                {/* Balão de Fala Japonês Interativo */}
                <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-10 -left-16 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-700 shadow-md whitespace-nowrap"
                >
                    <span className="block group-hover:hidden">任せなさい</span>
                    <span className="hidden group-hover:block text-yellow-400 font-semibold">Makase nasai (Deixe comigo)</span>
                    <div className="absolute bottom-[-5px] right-6 w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-700 rotate-45"></div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export function SenseiMascot({ className = '' }: MascotProps) {
    return (
        <div className={`pointer-events-none z-10 ${className}`}>
            <motion.div
                initial={{ opacity: 0, x: -100, rotate: -30 }}
                whileInView={{ opacity: 1, x: 0, rotate: -5 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ type: "spring", stiffness: 50, damping: 12 }}
                className="relative group cursor-pointer pointer-events-auto"
            >
                <img src="/avatars/sensei.png" alt="Felipe Sensei" className="drop-shadow-2xl" />
                
                {/* Balão de Fala Japonês Interativo */}
                <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="absolute -top-10 -right-24 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-700 shadow-md whitespace-nowrap"
                >
                    <span className="block group-hover:hidden">日本語で話そう！</span>
                    <span className="hidden group-hover:block text-yellow-400 font-semibold">Nihongo de hanaso! (Vamos falar japonês!)</span>
                    <div className="absolute bottom-[-5px] left-6 w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-700 rotate-45"></div>
                </motion.div>
            </motion.div>
        </div>
    );
}
