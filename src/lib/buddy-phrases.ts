/**
 * Buddy Speech Bubbles Configuration
 * Centralized mapping of generic and characteristic phrases for each avatar.
 */

export type BuddyPhraseType = 'success' | 'error';

export const GENERIC_SUCCESS_PHRASES = ['Yatta!', 'Sugoi!', 'Seikou!', 'Seikai!', 'Yoku dekimashita!'];
export const GENERIC_ERROR_PHRASES = ['Zannen!', 'Moi ichido!', 'Donmai!', 'Kiai da!'];

export interface AvatarSpecialPhrases {
    success: string[];
    error: string[];
}

export const AVATAR_SPECIAL_PHRASES: Record<string, AvatarSpecialPhrases> = {
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

/**
 * Returns a random phrase based on the avatar and the type of event.
 * If the avatar has special phrases, they are mixed with the generic ones.
 */
export function getBuddyPhrase(avatarId: string | null, type: BuddyPhraseType): string {
    const generic = type === 'success' ? GENERIC_SUCCESS_PHRASES : GENERIC_ERROR_PHRASES;
    if (!avatarId) return generic[Math.floor(Math.random() * generic.length)];

    const special = AVATAR_SPECIAL_PHRASES[avatarId];
    if (!special) return generic[Math.floor(Math.random() * generic.length)];

    // Mix special and generic phrases
    const pool = [...generic, ...special[type]];
    return pool[Math.floor(Math.random() * pool.length)];
}
