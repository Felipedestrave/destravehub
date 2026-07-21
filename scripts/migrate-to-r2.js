import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

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

// Caminhos das pastas locais informadas pelo usuário
const localDirs = [
    `C:\\Users\\Felipe Kawakami\\OneDrive\\Área de Trabalho\\Aula de japonês\\Imagens para as aulas`,
    `C:\\Users\\Felipe Kawakami\\OneDrive\\Área de Trabalho\\Aula de japonês\\Material das aulas`
];

// Função para escanear recursivamente os arquivos locais
function getFilesRecursively(dir, fileMap = new Map()) {
    if (!fs.existsSync(dir)) {
        console.warn(`Diretório não existe: ${dir}`);
        return fileMap;
    }
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            getFilesRecursively(fullPath, fileMap);
        } else {
            // Mapeia usando o nome do arquivo em minúsculo para busca insensível a maiúsculas
            fileMap.set(item.toLowerCase(), fullPath);
        }
    }
    return fileMap;
}

async function run() {
    console.log('--- Iniciando Migração para o Cloudflare R2 ---');

    // 1. Escanear arquivos locais
    console.log('Escaneando pastas locais...');
    const localFileMap = new Map();
    for (const dir of localDirs) {
        getFilesRecursively(dir, localFileMap);
    }
    console.log(`Encontrados ${localFileMap.size} arquivos locais mapeados.`);

    // 2. Buscar registros do banco
    console.log('Buscando registros da tabela "materials"...');
    const { data: databaseMaterials, error: dbError } = await supabase
        .from('materials')
        .select('*');

    if (dbError) {
        console.error('Erro ao buscar materiais do banco:', dbError);
        process.exit(1);
    }

    console.log(`Total de registros no banco: ${databaseMaterials.length}`);

    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;

    for (const mat of databaseMaterials) {
        const filePath = mat.file_path;
        if (!filePath) {
            console.log(`[PULAR] Material ID ${mat.id} não possui file_path.`);
            skipCount++;
            continue;
        }

        if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
            console.log(`[PULAR] Material ID ${mat.id} é um link externo: ${filePath}`);
            skipCount++;
            continue;
        }

        console.log(`\nProcessando: "${mat.name}" (Caminho no storage: ${filePath})`);

        let fileBuffer = null;
        let contentType = 'application/octet-stream';

        // Tenta encontrar localmente pelo nome do arquivo
        const fileNameLower = mat.name.toLowerCase();
        const localPath = localFileMap.get(fileNameLower);

        if (localPath && fs.existsSync(localPath)) {
            console.log(`  -> Encontrado localmente em: ${localPath}`);
            fileBuffer = fs.readFileSync(localPath);
            if (localPath.endsWith('.pdf')) contentType = 'application/pdf';
            else if (localPath.endsWith('.png')) contentType = 'image/png';
            else if (localPath.endsWith('.jpg') || localPath.endsWith('.jpeg')) contentType = 'image/jpeg';
            else if (localPath.endsWith('.gif')) contentType = 'image/gif';
        } else {
            console.log(`  -> NÃO encontrado localmente pelo nome "${mat.name}". Tentando baixar do Supabase Storage...`);
            try {
                const { data, error } = await supabase.storage
                    .from('materials')
                    .download(filePath);

                if (error) {
                    throw error;
                }
                fileBuffer = Buffer.from(await data.arrayBuffer());
                contentType = data.type || 'application/octet-stream';
                console.log(`  -> Download concluído do Supabase Storage.`);
            } catch (err) {
                console.error(`  -> [ERRO] Falha ao obter o arquivo do Supabase Storage:`, err.message || err);
                failCount++;
                continue;
            }
        }

        // Subir para o Cloudflare R2
        try {
            console.log(`  -> Fazendo upload para o Cloudflare R2 (${r2BucketName})...`);
            const command = new PutObjectCommand({
                Bucket: r2BucketName,
                Key: filePath,
                Body: fileBuffer,
                ContentType: contentType,
            });
            await r2.send(command);
            console.log(`  -> [SUCESSO] Upload finalizado.`);
            successCount++;
        } catch (err) {
            console.error(`  -> [ERRO] Falha no upload para o R2:`, err.message || err);
            failCount++;
        }
    }

    console.log('\n--- Resumo da Migração ---');
    console.log(`Sucessos: ${successCount}`);
    console.log(`Falhas: ${failCount}`);
    console.log(`Pulos (links externos): ${skipCount}`);
    console.log('--------------------------');
}

run().catch(console.error);
