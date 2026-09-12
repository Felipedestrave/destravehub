import { PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { r2, R2_BUCKET_NAME } from './r2';
import crypto from 'crypto';

const r2PublicUrl = import.meta.env?.PUBLIC_CLOUDFLARE_R2_PUBLIC_URL || process.env.PUBLIC_CLOUDFLARE_R2_PUBLIC_URL || '';

/**
 * Converte PCM cru (24000Hz, mono, 16-bit linear) do Gemini TTS em arquivo WAV padronizado
 */
export function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const wavHeader = Buffer.alloc(44);

    wavHeader.write('RIFF', 0);
    wavHeader.writeUInt32LE(36 + pcmBuffer.length, 4);
    wavHeader.write('WAVE', 8);
    wavHeader.write('fmt ', 12);
    wavHeader.writeUInt32LE(16, 16); // SubChunk1Size (16 para PCM)
    wavHeader.writeUInt16LE(1, 20); // AudioFormat (1 para PCM)
    wavHeader.writeUInt16LE(numChannels, 22);
    wavHeader.writeUInt32LE(sampleRate, 24);
    wavHeader.writeUInt32LE(byteRate, 28);
    wavHeader.writeUInt16LE(blockAlign, 32);
    wavHeader.writeUInt16LE(bitsPerSample, 34);
    wavHeader.write('data', 36);
    wavHeader.writeUInt32LE(pcmBuffer.length, 40);

    return Buffer.concat([wavHeader, pcmBuffer]);
}

/**
 * Salva o áudio do Gemini TTS diretamente no Cloudflare R2 e retorna a URL pública leve
 * @param base64Pcm Áudio retornado pelo Gemini (Base64)
 * @param identifier Texto ou identificador para gerar hash único
 */
export async function uploadTtsAudioToR2(base64Pcm: string, identifier: string): Promise<string> {
    if (!R2_BUCKET_NAME || !r2PublicUrl) {
        console.warn('[uploadTtsAudioToR2] R2 bucket ou URL pública não configurados, mantendo base64.');
        return base64Pcm;
    }

    try {
        const hash = crypto.createHash('sha256').update(identifier).digest('hex').substring(0, 20);
        const fileName = `audios/tts_${hash}.wav`;

        // Verifica se já existe no R2 (evita re-upload redundante)
        try {
            await r2.send(new HeadObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: fileName,
            }));
            // Se não deu erro, já existe no R2!
            const publicUrl = `${r2PublicUrl.replace(/\/$/, '')}/${fileName}`;
            return publicUrl;
        } catch {
            // Arquivo não existe ainda, prossegue com upload
        }

        const rawPcm = Buffer.from(base64Pcm, 'base64');
        const wavBuffer = pcmToWav(rawPcm, 24000, 1, 16);

        await r2.send(new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: fileName,
            Body: wavBuffer,
            ContentType: 'audio/wav',
            CacheControl: 'public, max-age=31536000, immutable',
        }));

        const publicUrl = `${r2PublicUrl.replace(/\/$/, '')}/${fileName}`;
        console.log('[uploadTtsAudioToR2] Áudio salvo com sucesso no R2:', publicUrl);
        return publicUrl;
    } catch (err) {
        console.error('[uploadTtsAudioToR2] Falha no upload para R2, fallback seguro:', err);
        return base64Pcm;
    }
}
