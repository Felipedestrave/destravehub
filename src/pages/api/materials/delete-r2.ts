import type { APIRoute } from 'astro';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
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
        const { filePath } = await request.json();
        if (!filePath) {
            return new Response(JSON.stringify({ error: 'filePath é obrigatório.' }), { status: 400 });
        }

        const deleteCommand = new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: filePath,
        });

        await r2.send(deleteCommand);

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (err: any) {
        console.error('[API Delete R2 Error]:', err);
        return new Response(JSON.stringify({ error: err.message || 'Falha ao deletar do R2.' }), { status: 500 });
    }
};
