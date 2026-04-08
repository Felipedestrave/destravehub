import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Modality } from '@google/genai';

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

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) {
        throw new Error('No audio data returned');
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
    console.log('🎵 Starting Buddy Voice Generation...\n');

    mkdirSync(OUTPUT_DIR, { recursive: true });

    const avatars = Object.keys(AVATAR_SPECIAL_PHRASES);
    let totalGenerated = 0;

    for (const avatarId of avatars) {
        console.log(`\n👤 Processing: ${avatarId}`);
        const voiceName = VOICE_CONFIG[avatarId] || 'Puck';
        console.log(`   🎤 Voice: ${voiceName}`);

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
            const filename = `${sanitizeFilename(phrase.text)}.mp3`;
            const outputPath = join(avatarDir, phrase.type, filename);

            // Skip if already exists
            if (existsSync(outputPath)) {
                console.log(`   ⏭️  Skipping (exists): ${filename}`);
                totalGenerated++;
                continue;
            }

            console.log(`   📝 Generating: ${phrase.text} (${phrase.type})`);

            try {
                const audioData = await generateAudio(phrase.text, voiceName);
                writeFileSync(outputPath, audioData);
                totalGenerated++;
                console.log(`   ✅ Saved: ${filename}`);
                // Delay to avoid rate limit
                await new Promise(r => setTimeout(r, 6000));
            } catch (error) {
                console.error(`   ❌ Failed: ${error}`);
            }
        }
    }

    console.log(`\n🎉 Done! Generated ${totalGenerated} audio files.`);
    console.log(`📁 Output directory: ${OUTPUT_DIR}`);
}

main().catch(console.error);
