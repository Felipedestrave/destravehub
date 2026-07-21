import { S3Client } from '@aws-sdk/client-s3';

const accessKeyId = import.meta.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const endpoint = import.meta.env.CLOUDFLARE_R2_ENDPOINT;

if (!accessKeyId || !secretAccessKey || !endpoint) {
  console.warn('Cloudflare R2 credentials are not set in environment variables.');
}

export const r2 = new S3Client({
  region: 'auto',
  endpoint: endpoint,
  credentials: {
    accessKeyId: accessKeyId || '',
    secretAccessKey: secretAccessKey || '',
  },
});

export const R2_BUCKET_NAME = import.meta.env.CLOUDFLARE_R2_BUCKET_NAME || '';
