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

async function listFolder(folderPath = '') {
    console.log(`Buscando arquivos na pasta "${folderPath}" do Supabase Storage...`);
    const { data: files, error } = await supabase.storage
        .from('materials')
        .list(folderPath, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' }
        });

    if (error) {
        console.error(`Erro ao listar pasta "${folderPath}":`, error);
        return;
    }

    console.log(`Encontrados ${files.length} itens.`);
    for (const file of files) {
        const fullPath = folderPath ? `${folderPath}/${file.name}` : file.name;
        if (file.id === undefined || file.metadata === null) {
            // É uma pasta/diretório
            console.log(`[DIR]  ${fullPath}`);
            await listFolder(fullPath);
        } else {
            // É um arquivo
            console.log(`[FILE] ${fullPath} (${file.metadata.size} bytes)`);
        }
    }
}

async function run() {
    await listFolder('');
}

run().catch(console.error);
