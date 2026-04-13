
import { existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VOICE_DIR = join(__dirname, '..', 'public', 'assets', 'buddy-voices');

const GENERIC_SUCCESS = ['Yatta!', 'Sugoi!', 'Seikou!', 'Seikai!', 'Yoku dekimashita!'];
const GENERIC_ERROR = ['Zannen!', 'Moi ichido!', 'Donmai!', 'Kiai da!'];

const AVATARS: Record<string, { success: string[]; error: string[] }> = {
    'avatar-tanuki-novato': { success: ['Yatta ne!', 'Ganbarou!'], error: ['Daijoubu!', 'Tsugi da!'] },
    'avatar-ashigaru': { success: ['Kiseki da! Seikai!'], error: ['S-Sumimasen!'] },
    'avatar-ninja-sapeca': { success: ['Hayai de gozaru!'], error: ['Kiesaritai de gozaru...'] },
    'avatar-samurai-zen': { success: ['Shizuka ni, seikai.'], error: ['Mada renshuu ga tarinai!'] },
    'avatar-onna-musha': { success: ['Utsukushii seikai!'], error: ['Tate-naoshimashou!'] },
    'avatar-ronin': { success: ['Yoi ude da.'], error: ['Michi wa mada nagai.'] },
    'avatar-shinobi': { success: ['Kanpeki da.'], error: ['Shikujitta ka...'] },
    'avatar-shogun-supremo': { success: ['Tenka ippin da!'], error: ['Tsugi wa katsu zo!'] }
};

function sanitize(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

console.log('🔍 Auditoria de Vozes do Buddy...\n');

let missingCount = 0;
let totalCount = 0;

for (const [id, phrases] of Object.entries(AVATARS)) {
    const all = [
        ...GENERIC_SUCCESS.map(p => ({ p, t: 'success' })),
        ...GENERIC_ERROR.map(p => ({ p, t: 'error' })),
        ...phrases.success.map(p => ({ p, t: 'success' })),
        ...phrases.error.map(p => ({ p, t: 'error' }))
    ];

    const missing = [];
    for (const item of all) {
        totalCount++;
        const path = join(VOICE_DIR, id, item.t, `${sanitize(item.p)}.wav`);
        if (!existsSync(path)) {
            missing.push(`[${item.t.toUpperCase()}] ${item.p}`);
            missingCount++;
        }
    }

    if (missing.length > 0) {
        console.log(`❌ ${id}: Faltam ${missing.length} arquivos:`);
        missing.forEach(m => console.log(`   - ${m}`));
    } else {
        console.log(`✅ ${id}: 100% Completo!`);
    }
}

console.log(`\n📊 Resumo: ${totalCount - missingCount}/${totalCount} arquivos presentes. (${missingCount} faltando)`);
