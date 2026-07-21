import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const r2AccessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const r2SecretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const r2Endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
const r2BucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;

if (!supabaseUrl || !supabaseServiceRoleKey || !r2AccessKeyId || !r2SecretAccessKey || !r2Endpoint || !r2BucketName) {
    console.error('Erro: Variáveis de ambiente faltando no arquivo .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const r2 = new S3Client({
    region: 'auto',
    endpoint: r2Endpoint,
    credentials: {
        accessKeyId: r2AccessKeyId,
        secretAccessKey: r2SecretAccessKey,
    },
});

async function run() {
    console.log('--- Iniciando Migração da pasta "lesson-images" para o Cloudflare R2 ---');
    
    let offset = 0;
    const limit = 100;
    let allFiles = [];
    
    while (true) {
        console.log(`Buscando arquivos na pasta "lesson-images" (offset: ${offset})...`);
        const { data: files, error } = await supabase.storage
            .from('materials')
            .list('lesson-images', {
                limit: limit,
                offset: offset,
                sortBy: { column: 'name', order: 'asc' }
            });
            
        if (error) {
            console.error('Erro ao listar arquivos:', error);
            process.exit(1);
        }
        
        if (!files || files.length === 0) {
            break;
        }
        
        // Filtrar apenas arquivos (remover subpastas se houver)
        const fileItems = files.filter(f => f.id !== undefined && f.metadata !== null);
        allFiles.push(...fileItems);
        
        if (files.length < limit) {
            break;
        }
        offset += limit;
    }
    
    console.log(`Total de arquivos encontrados para migrar: ${allFiles.length}`);
    
    let success = 0;
    let fail = 0;
    
    for (const file of allFiles) {
        const filePath = `lesson-images/${file.name}`;
        console.log(`Processando: ${filePath} (${file.metadata?.size || 0} bytes)`);
        
        try {
            // 1. Download do Supabase
            const { data, error: dlError } = await supabase.storage
                .from('materials')
                .download(filePath);
                
            if (dlError) {
                throw dlError;
            }
            
            const fileBuffer = Buffer.from(await data.arrayBuffer());
            const contentType = data.type || 'image/png';
            
            // 2. Upload para o R2
            const command = new PutObjectCommand({
                Bucket: r2BucketName,
                Key: filePath,
                Body: fileBuffer,
                ContentType: contentType
            });
            
            await r2.send(command);
            console.log(`  -> [SUCESSO] Upload finalizado.`);
            success++;
        } catch (err) {
            console.error(`  -> [ERRO] Falha ao migrar arquivo:`, err.message || err);
            fail++;
        }
    }
    
    console.log('\n--- Resumo da Migração "lesson-images" ---');
    console.log(`Sucesso: ${success}`);
    console.log(`Falha: ${fail}`);
    console.log('------------------------------------------');
}

run().catch(console.error);
