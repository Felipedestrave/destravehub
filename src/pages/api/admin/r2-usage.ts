import type { APIRoute } from 'astro';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { r2, R2_BUCKET_NAME } from '../../../lib/r2';
import { supabaseAdmin } from '../../../lib/supabase-admin';

export const GET: APIRoute = async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token || token === 'undefined') {
        return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Token inválido.' }), { status: 401 });
    }

    // Apenas professores (administradores) podem consultar o uso do R2
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'teacher') {
        return new Response(JSON.stringify({ error: 'Acesso negado.' }), { status: 403 });
    }

    try {
        console.log('[API R2 Usage] Calculando tamanho total do bucket R2...');
        
        let totalSize = 0;
        let isTruncated = true;
        let continuationToken: string | undefined = undefined;

        while (isTruncated) {
            const listCommand = new ListObjectsV2Command({
                Bucket: R2_BUCKET_NAME,
                ContinuationToken: continuationToken,
            });

            const listResponse: any = await r2.send(listCommand);
            
            if (listResponse.Contents) {
                for (const object of listResponse.Contents) {
                    totalSize += object.Size || 0;
                }
            }

            isTruncated = listResponse.IsTruncated || false;
            continuationToken = listResponse.NextContinuationToken;
        }

        console.log(`[API R2 Usage] Uso total calculado: ${totalSize} bytes`);

        return new Response(JSON.stringify({ totalSizeBytes: totalSize }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err: any) {
        console.error('[API R2 Usage Error]:', err);
        return new Response(JSON.stringify({ error: err.message || 'Falha ao calcular armazenamento.' }), { status: 500 });
    }
};
