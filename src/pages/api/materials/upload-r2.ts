import type { APIRoute } from 'astro';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2, R2_BUCKET_NAME } from '../../../lib/r2';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const POST: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Token inválido.' }), { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const studentId = formData.get('student_id') as string | null;
        const folderId = formData.get('folder_id') as string | null;
        const customType = formData.get('type') as string | null;

        if (!file) {
            return new Response(JSON.stringify({ error: 'Nenhum arquivo enviado.' }), { status: 400 });
        }

        const fileExt = file.name.split('.').pop() || '';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // 1. Upload do Arquivo para o Cloudflare R2
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const uploadCommand = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: filePath,
            Body: fileBuffer,
            ContentType: file.type || 'application/octet-stream',
        });

        await r2.send(uploadCommand);

        // 2. Registro no Banco de Dados (Supabase)
        const typeValue = customType || (fileExt.toLowerCase() === 'pdf' ? 'pdf' : 'image');
        
        const { data: newMat, error: dbError } = await supabaseAdmin
            .from('materials')
            .insert({
                name: file.name,
                file_path: filePath,
                teacher_id: user.id,
                student_id: (studentId === 'private' || !studentId) ? null : studentId,
                folder_id: folderId || null,
                type: typeValue
            })
            .select()
            .single();

        if (dbError) {
            throw dbError;
        }

        return new Response(JSON.stringify(newMat), { status: 200 });

    } catch (err: any) {
        console.error('[API Upload R2 Error]:', err);
        return new Response(JSON.stringify({ error: err.message || 'Falha interna no upload.' }), { status: 500 });
    }
};
