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

async function getFilesRecursively(folderPath = '') {
    const allFiles = [];
    
    async function listFolder(path = '') {
        let offset = 0;
        const limit = 100;
        let hasMore = true;

        while (hasMore) {
            const { data: files, error } = await supabase.storage
                .from('materials')
                .list(path, {
                    limit: limit,
                    offset: offset,
                    sortBy: { column: 'name', order: 'asc' }
                });

            if (error) {
                console.error(`Erro ao listar pasta "${path}":`, error);
                return;
            }

            if (!files || files.length === 0) {
                hasMore = false;
                break;
            }

            for (const file of files) {
                const fullPath = path ? `${path}/${file.name}` : file.name;
                if (file.id === undefined || file.metadata === null) {
                    // É uma pasta/diretório
                    await listFolder(fullPath);
                } else {
                    // É um arquivo
                    allFiles.push(fullPath);
                }
            }

            if (files.length < limit) {
                hasMore = false;
            } else {
                offset += limit;
            }
        }
    }

    await listFolder(folderPath);
    return allFiles;
}

async function run() {
    console.log('--- Iniciando limpeza do bucket "materials" no Supabase Storage ---');
    
    console.log('Buscando todos os arquivos recursivamente...');
    const files = await getFilesRecursively('');
    console.log(`Encontrados ${files.length} arquivos para deletar.`);

    if (files.length === 0) {
        console.log('Nenhum arquivo encontrado. O bucket já está limpo!');
        return;
    }

    // Deletar em lotes de 100
    const batchSize = 100;
    for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        console.log(`Deletando lote de ${batch.length} arquivos (${i + 1} a ${Math.min(i + batchSize, files.length)})...`);
        
        const { data, error } = await supabase.storage
            .from('materials')
            .remove(batch);

        if (error) {
            console.error('Erro ao deletar lote:', error);
        } else {
            console.log(`Lote deletado com sucesso. Deletados: ${data?.length || 0} arquivos.`);
        }
    }

    console.log('--- Limpeza concluída! ---');
}

run().catch(console.error);
