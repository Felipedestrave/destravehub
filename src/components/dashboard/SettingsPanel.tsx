import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User, Phone, BookOpen, FileText, Camera } from 'lucide-react';

export const SettingsPanel = () => {
    const [fullName, setFullName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [bio, setBio] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Estados para o Cropper
    const [showCropper, setShowCropper] = useState(false);
    const [cropImage, setCropImage] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setOffset({
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart]);

    const handleConfirmCrop = async () => {
        setShowCropper(false);
        setSaving(true);
        
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            // Criar canvas para o recorte
            const canvas = document.createElement('canvas');
            const size = 400; // Tamanho padrão do avatar recortado
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            if (!ctx || !cropImage) return;

            const img = new Image();
            img.src = cropImage;
            
            await new Promise((resolve) => { img.onload = resolve; });

            // Calcular o recorte baseado no zoom e offset
            // O contêiner de preview tem 256px (w-64)
            const previewSize = 256;
            const scaleFactor = img.naturalWidth / previewSize;
            
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, size, size);
            
            // Desenhar a imagem com as transformações (simplificado para o enquadramento do preview)
            // ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
            // Ajuste matemático para casar o preview visual com o recorte do canvas
            const drawSize = size * zoom;
            const dx = (size / 2) + (offset.x * (size / previewSize)) - (drawSize / 2);
            const dy = (size / 2) + (offset.y * (size / previewSize)) - (drawSize / 2);
            
            ctx.drawImage(img, dx, dy, drawSize, drawSize);

            // Converter canvas para Blob
            const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
            if (!blob) throw new Error('Falha ao gerar imagem recortada');

            // Upload para o Supabase
            const fileName = `${session.user.id}-${Date.now()}.jpg`;
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, blob);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            setAvatarUrl(publicUrl);
            setNotification({ type: 'success', message: 'Foto recortada e enviada! Salve para finalizar.' });
            
            // Resetar estados do cropper
            setZoom(1);
            setOffset({ x: 0, y: 0 });
        } catch (err: any) {
            console.error('Crop/Upload error:', err);
            setNotification({ type: 'error', message: 'Erro ao processar imagem.' });
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        loadProfile();
        supabase.auth.getUser().then(({data}) => setUserId(data.user?.id || null));
    }, []);

    const loadProfile = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            // Tentativa 1: Busca completa (assume que o SQL foi rodado)
            let { data, error } = await supabase
                .from('profiles')
                .select('full_name, display_name, specialty, bio, whatsapp, avatar_url')
                .eq('id', session.user.id)
                .single();

            // Tentativa 2: Fallback resiliente (Busca apenas o que é garantido existir)
            if (error) {
                console.warn('Busca completa falhou, tentando fallback básico...');
                const basicRes = await supabase
                    .from('profiles')
                    .select('full_name, whatsapp, avatar_url')
                    .eq('id', session.user.id)
                    .single();
                
                if (basicRes.error) throw basicRes.error;
                data = basicRes.data as any;
            }

            if (data) {
                setFullName(data.full_name || '');
                setDisplayName((data as any).display_name || '');
                setSpecialty((data as any).specialty || '');
                setBio((data as any).bio || '');
                setWhatsapp(data.whatsapp || '');
                setAvatarUrl(data.avatar_url || '');
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatWhatsAppDisplay = (digits: string) => {
        if (!digits) return '';
        if (digits.startsWith('81')) {
            let formatted = '+81 ';
            const rest = digits.slice(2);
            if (rest.length > 0) {
                formatted += rest.slice(0, 2);
                if (rest.length > 2) {
                    formatted += '-' + rest.slice(2, 6);
                    if (rest.length > 6) {
                        formatted += '-' + rest.slice(6, 13);
                    }
                }
            }
            return formatted.trim();
        }
        if (digits.startsWith('55')) {
            let formatted = '+55 ';
            const rest = digits.slice(2);
            if (rest.length > 0) {
                formatted += '(' + rest.slice(0, 2) + ') ';
                if (rest.length > 2) {
                    formatted += rest.slice(2, 7);
                    if (rest.length > 7) {
                        formatted += '-' + rest.slice(7, 13);
                    }
                }
            }
            return formatted.trim();
        }
        return digits ? `+${digits}` : '';
    };

    const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const digits = val.replace(/\D/g, '');
        if (digits.length <= 15) setWhatsapp(digits);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setNotification(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Não autenticado');

            const { error } = await supabase
                .from('profiles')
                .update({ 
                    full_name: fullName,
                    display_name: displayName,
                    specialty: specialty,
                    bio: bio,
                    whatsapp: whatsapp,
                    avatar_url: avatarUrl,
                    updated_at: new Date().toISOString()
                })
                .eq('id', session.user.id);

            if (error) throw error;

            setNotification({ type: 'success', message: 'Perfil sintonizado com sucesso! ✨' });
            // Forçar reload do cabeçalho se necessário enviando um evento customizado
            window.dispatchEvent(new Event('profile-updated'));
        } catch (error: any) {
            console.error('Error saving profile:', error);
            setNotification({ type: 'error', message: 'Erro ao salvar. Verifique se rodou o SQL sugerido pelo Sensei.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin shadow-lg"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animation-fade-in pb-20">
            {notification && (
                <div className={`mb-8 p-4 rounded-2xl border-2 font-inter font-bold shadow-sm flex items-center gap-3 ${
                    notification.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                    {notification.type === 'success' ? '✅' : '❌'}
                    {notification.message}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8">
                {/* Seção 1: Identidade Visual */}
                <div className="bg-white rounded-3xl border border-slate-border p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-brand/10 p-2 rounded-xl text-brand">
                            <User size={24} />
                        </div>
                        <h2 className="font-outfit text-xl font-bold text-slate-dark uppercase tracking-tight">Identidade do Sensei</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-mid uppercase tracking-widest mb-2 font-outfit">Sua Foto de Perfil</label>
                                <div className="flex items-center gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => document.getElementById('avatar-upload')?.click()}
                                        className="btn-white px-4 py-2 text-sm font-bold rounded-xl flex items-center gap-2 border-2 hover:border-brand transition-all"
                                    >
                                        <Camera size={16} /> Alterar Foto
                                    </button>
                                    <input 
                                        type="file" 
                                        id="avatar-upload"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    setCropImage(reader.result as string);
                                                    setShowCropper(true);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    {avatarUrl && (
                                        <button 
                                            type="button"
                                            onClick={() => setAvatarUrl('')}
                                            className="text-xs font-bold text-red-500 hover:underline"
                                        >
                                            Remover
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {/* Modal do Editor de Recorte */}
                            {showCropper && cropImage && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animation-fade-in">
                                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
                                        <div className="text-center mb-6">
                                            <h3 className="font-outfit text-xl font-bold text-slate-dark">Ajuste seu Avatar</h3>
                                            <p className="text-sm text-slate-mid">Arraste e use o zoom para centralizar sua foto.</p>
                                        </div>

                                        <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-brand bg-slate-100 shadow-inner">
                                            <div id="crop-container" className="absolute inset-0 cursor-move">
                                                <img 
                                                    id="crop-preview-img"
                                                    src={cropImage} 
                                                    alt="Crop" 
                                                    draggable="false"
                                                    onDragStart={(e) => e.preventDefault()}
                                                    style={{
                                                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                                                        transition: 'none',
                                                        maxWidth: 'none',
                                                        position: 'absolute',
                                                        top: '0',
                                                        left: '0',
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain',
                                                        cursor: isDragging ? 'grabbing' : 'grab',
                                                        userSelect: 'none'
                                                    }}
                                                    onMouseDown={(e) => {
                                                        setIsDragging(true);
                                                        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
                                                    }}
                                                />
                                            </div>
                                            {/* Overlay de Máscara */}
                                            <div className="absolute inset-0 pointer-events-none border-[40px] border-black/20"></div>
                                        </div>

                                        <div className="mt-8 space-y-4">
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs font-bold text-slate-mid">ZOOM</span>
                                                <input 
                                                    type="range" 
                                                    min="1" max="3" step="0.1" 
                                                    value={zoom}
                                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                                    className="flex-1 accent-brand h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                                                />
                                            </div>

                                            <div className="flex gap-3 pt-4">
                                                <button 
                                                    type="button"
                                                    onClick={() => setShowCropper(false)}
                                                    className="flex-1 py-3 rounded-xl border-2 border-slate-border font-outfit font-bold text-slate-mid hover:bg-slate-50 transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={handleConfirmCrop}
                                                    className="flex-1 py-3 rounded-xl bg-brand text-white font-outfit font-bold hover:scale-105 transition-all shadow-lg shadow-brand/20"
                                                >
                                                    Confirmar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-black text-slate-mid uppercase tracking-widest mb-2 font-outfit">Ou use uma URL Externa</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-mid group-focus-within:text-brand transition-colors">
                                        <Camera size={18} />
                                    </div>
                                    <input 
                                        type="url" 
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                        placeholder="https://suafoto.com/imagem.png"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-border bg-ice focus:bg-white focus:border-brand outline-none transition-all font-inter font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-mid uppercase tracking-widest mb-2 font-outfit">Nome Completo</label>
                                <input 
                                    type="text" 
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Digite seu nome completo"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-border bg-ice focus:bg-white focus:border-brand outline-none transition-all font-inter font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-mid uppercase tracking-widest mb-2 font-outfit">Nome de Exibição (Como os alunos te veem)</label>
                                <input 
                                    type="text" 
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Ex: Sensei Felipe"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-border bg-ice focus:bg-white focus:border-brand outline-none transition-all font-inter font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-center p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-border group hover:border-brand transition-colors">
                            <div className="text-center">
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl mx-auto overflow-hidden bg-white mb-4 relative">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                                            <User size={64} />
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm font-bold text-slate-mid">Prévia do Avatar</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seção 2: Profissional */}
                <div className="bg-white rounded-3xl border border-slate-border p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-brand/10 p-2 rounded-xl text-brand">
                            <BookOpen size={24} />
                        </div>
                        <h2 className="font-outfit text-xl font-bold text-slate-dark uppercase tracking-tight">Experiência Profissional</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-slate-mid uppercase tracking-widest mb-2 font-outfit">Matéria / Especialidade</label>
                            <input 
                                type="text" 
                                value={specialty}
                                onChange={(e) => setSpecialty(e.target.value)}
                                placeholder="Ex: Língua Japonesa e Cultura"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-border bg-ice focus:bg-white focus:border-brand outline-none transition-all font-inter font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-mid uppercase tracking-widest mb-2 font-outfit flex items-center gap-2">
                                <FileText size={14} /> Bio Curta para Alunos
                            </label>
                            <textarea 
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Uma breve apresentação sobre seu método ou trajetória..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-border bg-ice focus:bg-white focus:border-brand outline-none transition-all font-inter font-medium resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Seção 3: Contato */}
                <div className="bg-white rounded-3xl border border-slate-border p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-brand/10 p-2 rounded-xl text-brand">
                            <Phone size={24} />
                        </div>
                        <h2 className="font-outfit text-xl font-bold text-slate-dark uppercase tracking-tight">Configurações de Contato</h2>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-mid uppercase tracking-widest mb-2 font-outfit flex items-center justify-between">
                            WhatsApp do Sensei
                            <span className="text-[10px] text-brand font-bold">RECOMENDADO</span>
                        </label>
                        <div className="relative max-w-sm">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-mid">
                                <Phone size={18} />
                            </div>
                            <input 
                                type="text" 
                                value={formatWhatsAppDisplay(whatsapp)} 
                                onChange={handleWhatsAppChange}
                                placeholder="81 90-XXXX-XXXX" 
                                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-border bg-ice focus:bg-white focus:border-brand outline-none transition-all font-inter font-medium"
                            />
                        </div>
                        <p className="mt-3 text-xs text-slate-mid font-medium italic">
                            💡 Use código do país (81 Japão, 55 Brasil). Os alunos usarão este contato ao concluir missões.
                        </p>
                    </div>
                </div>

                {/* Footer de Ações */}
                <div className="bg-slate-900 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl shadow-slate-200/50">
                    <div className="text-white/40 font-mono text-[10px] hidden sm:block">
                        ID DO SENSEI: {userId}
                    </div>
                    <button 
                        type="submit" 
                        disabled={saving} 
                        className="w-full sm:w-auto bg-brand text-white px-10 py-4 rounded-2xl font-outfit font-black text-base shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {saving ? (
                            <><div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> Sintonizando...</>
                        ) : (
                            <>SALVAR PERFIL <span className="opacity-0 group-hover:opacity-100 transition-opacity">🚀</span></>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
