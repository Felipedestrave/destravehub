import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Erro: Variáveis de ambiente PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configuradas.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const OLD_PREFIX = 'https://yluvsxfckordpaparjax.supabase.co/storage/v1/object/public/materials/';
const NEW_PREFIX = 'https://pub-92fa315a78bb4d24b80b4166108114b2.r2.dev/';

async function run() {
    console.log('--- Buscando atividades no Banco de Dados ---');
    const { data: activities, error } = await supabase
        .from('activities')
        .select('id, title, config');

    if (error) {
        console.error('Erro ao buscar atividades:', error);
        process.exit(1);
    }

    console.log(`Encontradas ${activities.length} atividades para analisar.`);
    let updatedCount = 0;

    for (const act of activities) {
        if (!act.config) continue;

        // Converter o objeto config para string para busca e substituição simples
        const configStr = JSON.stringify(act.config);

        if (configStr.includes(OLD_PREFIX)) {
            console.log(`\nAtividade encontrada: "${act.title}" (ID: ${act.id})`);
            
            // Conta quantas ocorrências da URL antiga existem nesta atividade
            const occurrences = (configStr.match(new RegExp(OLD_PREFIX, 'g')) || []).length;
            console.log(`  -> Contém ${occurrences} URL(s) antiga(s) do Supabase.`);

            // Substituir as URLs no JSON stringificado
            const updatedConfigStr = configStr.replaceAll(OLD_PREFIX, NEW_PREFIX);
            const updatedConfig = JSON.parse(updatedConfigStr);

            // Atualizar o banco de dados
            const { error: updateError } = await supabase
                .from('activities')
                .update({ config: updatedConfig })
                .eq('id', act.id);

            if (updateError) {
                console.error(`  -> [ERRO] Falha ao atualizar atividade ID ${act.id}:`, updateError.message);
            } else {
                console.log(`  -> [SUCESSO] Atualizado para usar URLs do Cloudflare R2.`);
                updatedCount++;
            }
        }
    }

    console.log('\n--- Resumo do Processamento ---');
    console.log(`Atividades atualizadas com sucesso: ${updatedCount}`);
    console.log('-------------------------------');
}

run().catch(console.error);
