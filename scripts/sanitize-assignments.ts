import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

function stripAudio(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) {
        return obj.map(stripAudio);
    }
    const clean: any = {};
    for (const [k, v] of Object.entries(obj)) {
        if (k === 'audioBase64') {
            continue;
        }
        clean[k] = stripAudio(v);
    }
    return clean;
}

async function sanitizeAssignments() {
    console.log('--- Buscando assignments com result_data pesado ---');
    const { data: assignments, error } = await supabase
        .from('assignments')
        .select('id, result_data')
        .not('result_data', 'is', null);

    if (error) {
        console.error('Erro ao buscar assignments:', error);
        return;
    }

    console.log(`Total de assignments com result_data: ${assignments?.length || 0}`);
    let updatedCount = 0;
    let totalBytesSaved = 0;

    for (const item of (assignments || [])) {
        const rawJson = JSON.stringify(item.result_data);
        if (rawJson.includes('audioBase64')) {
            const originalLength = rawJson.length;
            const cleaned = stripAudio(item.result_data);
            const cleanedJson = JSON.stringify(cleaned);
            const saved = originalLength - cleanedJson.length;

            console.log(`Limpando assignment ${item.id}: ${(originalLength / 1024 / 1024).toFixed(2)} MB -> ${(cleanedJson.length / 1024).toFixed(2)} KB (Economia: ${(saved / 1024 / 1024).toFixed(2)} MB)`);

            const { error: updateError } = await supabase
                .from('assignments')
                .update({ result_data: cleaned })
                .eq('id', item.id);

            if (updateError) {
                console.error(`Erro ao atualizar ${item.id}:`, updateError);
            } else {
                updatedCount++;
                totalBytesSaved += saved;
            }
        }
    }

    console.log(`\n=== CONCLUÍDO ===`);
    console.log(`Assignments atualizados: ${updatedCount}`);
    console.log(`Espaço total economizado: ${(totalBytesSaved / 1024 / 1024).toFixed(2)} MB`);
}

sanitizeAssignments();
