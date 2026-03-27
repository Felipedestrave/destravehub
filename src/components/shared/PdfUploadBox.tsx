import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';

interface PdfUploadBoxProps {
    onFileSelected: (base64: string | null, fileName: string | null) => void;
    currentFileName: string | null;
    title?: string;
    description?: string;
}

export const PdfUploadBox: React.FC<PdfUploadBoxProps> = ({ 
    onFileSelected, 
    currentFileName,
    title = "Arraste o PDF ou clique para selecionar",
    description = "Suporta PDF com conteúdo de japonês (JLPT N5–N3)"
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const processFile = (file: File) => {
        if (file.type !== 'application/pdf') {
            alert('Por favor, selecione um arquivo PDF.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            const base64 = result.split(',')[1];
            onFileSelected(base64, file.name);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    return (
        <div
            className={`card cursor-pointer border-2 border-dashed transition-all duration-200 mb-6 ${
                dragOver
                    ? 'border-brand bg-brand/5 scale-[1.01]'
                    : currentFileName
                        ? 'border-action bg-action/5 border-solid shadow-sm'
                        : 'border-slate-border hover:border-brand/40 hover:bg-brand/3'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
        >
            <div className="flex flex-col items-center gap-3 py-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${currentFileName ? 'bg-action/10' : 'bg-brand/10'}`}>
                    <UploadCloud size={28} className={currentFileName ? 'text-action' : 'text-brand'} />
                </div>
                {currentFileName ? (
                    <div className="text-center">
                        <p className="font-outfit font-bold text-slate-dark">{currentFileName}</p>
                        <div className="flex items-center justify-center gap-1.5 mt-1 text-action">
                            <CheckCircle size={14} />
                            <span className="text-[0.65rem] font-bold uppercase tracking-wider">PDF Pronto para IA</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="font-outfit font-semibold text-slate-dark">{title}</p>
                        <p className="text-sm text-slate-mid">{description}</p>
                    </div>
                )}
            </div>
            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
        </div>
    );
};
