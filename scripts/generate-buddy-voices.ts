import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Modality, HarmCategory, HarmBlockThreshold } from '@google/genai';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
    const envPath = join(__dirname, '..', '.env');
    if (!existsSync(envPath)) {
        throw new Error('.env file not found');
    }
    const envContent = readFileSync(envPath, 'utf-8');
    const match = envContent.match(/GEMINI_API_KEY=(.+)/);
    if (!match) {
        throw new Error('GEMINI_API_KEY not found in .env');
    }
    return match[1].trim();
}

const API_KEY = loadEnv();
const ai = new GoogleGenAI({ apiKey: API_KEY });

const GENERIC_SUCCESS_PHRASES = ['Yatta!', 'Sugoi!', 'Seikou!', 'Seikai!', 'Yoku dekimashita!'];
const GENERIC_ERROR_PHRASES = ['Zannen!', 'Moi ichido!', 'Donmai!', 'Kiai da!'];

const AVATAR_SPECIAL_PHRASES: Record<string, { success: string[]; error: string[] }> = {
    'avatar-tanuki-novato': {
        success: ['Yatta ne!', 'Ganbarou!'],
        error: ['Daijoubu!', 'Tsugi da!']
    },
    'avatar-ashigaru': {
        success: ['Kiseki da! Seikai!'],
        error: ['S-Sumimasen!']
    },
    'avatar-ninja-sapeca': {
        success: ['Hayai de gozaru!'],
        error: ['Kiesaritai de gozaru...']
    },
    'avatar-samurai-zen': {
        success: ['Shizuka ni, seikai.'],
        error: ['Mada renshuu ga tarinai!']
    },
    'avatar-onna-musha': {
        success: ['Utsukushii seikai!'],
        error: ['Tate-naoshimashou!']
    },
    'avatar-ronin': {
        success: ['Yoi ude da.'],
        error: ['Michi wa mada nagai.']
    },
    'avatar-shinobi': {
        success: ['Kanpeki da.'],
        error: ['Shikujitta ka...']
    },
    'avatar-shogun-supremo': {
        success: ['Tenka ippin da!'],
        error: ['Tsugi wa katsu zo!']
    }
};

const VOICE_CONFIG: Record<string, string> = {
    'avatar-tanuki-novato': 'Puck',
    'avatar-ashigaru': 'Zephyr',
    'avatar-ninja-sapeca': 'Zephyr',
    'avatar-samurai-zen': 'Charon',
    'avatar-onna-musha': 'Leda',
    'avatar-ronin': 'Kore',
    'avatar-shinobi': 'Zephyr',
    'avatar-shogun-supremo': 'Orus'
};

const OUTPUT_DIR = join(__dirname, '..', 'public', 'assets', 'buddy-voices');

/**
 * Cria um cabeçalho WAV de 44 bytes para áudio PCM L16 (16-bit, Mono, 24kHz)
 */
function createWavHeader(dataLength: number): Buffer {
    const sampleRate = 24000;
    const header = Buffer.alloc(44);
    
    // RIFF header
    header.write('RIFF', 0);
    header.writeUInt32LE(dataLength + 36, 4);
    header.write('WAVE', 8);
    
    // fmt chunk
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16); // Chunk size
    header.writeUInt16LE(1, 20);  // Format: PCM
    header.writeUInt16LE(1, 22);  // Channels: Mono
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * 2, 28); // Byte Rate
    header.writeUInt16LE(2, 32);  // Block Align
    header.writeUInt16LE(16, 34); // Bits per Sample
    
    // data chunk
    header.write('data', 36);
    header.writeUInt32LE(dataLength, 40);
    
    return header;
}

async function generateAudio(text: string, voiceName: string): Promise<Buffer> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: { parts: [{ text }] },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName },
                },
            },
        },
    });

    const candidate = response.candidates?.[0];
    const audioData = candidate?.content?.parts?.[0]?.inlineData?.data;
    
    if (!audioData) {
        const reason = candidate?.finishReason || 'UNKNOWN';
        const feedback = response.promptFeedback?.blockReason || 'NONE';
        throw new Error(`Gemini rejected the audio. Reason: ${reason}, Blocked: ${feedback}`);
    }

    return Buffer.from(audioData, 'base64');
}

function sanitizeFilename(text: string): string {
    return text.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

async function main() {
    console.log('🎵 Starting Buddy Voice Generation (with WAV Header)...\n');

    mkdirSync(OUTPUT_DIR, { recursive: true });

    const avatars = Object.keys(AVATAR_SPECIAL_PHRASES);
    let totalGenerated = 0;

    for (const avatarId of avatars) {
        console.log(`\n👤 Processing Avatar: ${avatarId}`);
        const voiceName = VOICE_CONFIG[avatarId] || 'Puck';

        const avatarDir = join(OUTPUT_DIR, avatarId);
        mkdirSync(join(avatarDir, 'success'), { recursive: true });
        mkdirSync(join(avatarDir, 'error'), { recursive: true });

        const allPhrases = [
            ...GENERIC_SUCCESS_PHRASES.map(p => ({ text: p, type: 'success' })),
            ...GENERIC_ERROR_PHRASES.map(p => ({ text: p, type: 'error' })),
            ...AVATAR_SPECIAL_PHRASES[avatarId].success.map(p => ({ text: p, type: 'success' })),
            ...AVATAR_SPECIAL_PHRASES[avatarId].error.map(p => ({ text: p, type: 'error' }))
        ];

        for (const phrase of allPhrases) {
            const filename = `${sanitizeFilename(phrase.text)}.wav`;
            const outputPath = join(avatarDir, phrase.type, filename);

            if (existsSync(outputPath)) {
                console.log(`   ⏭️  Skipping existing: ${filename}`);
                totalGenerated++;
                continue;
            }

            console.log(`   📝 Generating: ${phrase.text}`);

            try {
                const rawAudio = await generateAudio(phrase.text, voiceName);
                const header = createWavHeader(rawAudio.length);
                const finalAudio = Buffer.concat([header, rawAudio]);
                
                writeFileSync(outputPath, finalAudio);
                totalGenerated++;
                console.log(`   ✅ Saved: ${filename}`);
                
                // Delay para evitar rate limit da API (6 segundos por áudio)
                await new Promise(r => setTimeout(r, 6000));
            } catch (error) {
                console.error(`   ❌ Failed to generate "${phrase.text}": ${error}`);
            }
        }
    }

    console.log(`\n🎉 Process Complete! Successfully generated ${totalGenerated} audio files.`);
    console.log(`📁 Files are located in: ${OUTPUT_DIR}`);
}

main().catch(console.error);
