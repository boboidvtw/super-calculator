// Supported UI languages and mapping of browser language tags onto them.

export const LANGUAGES = [
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'en-US', label: 'English' },
    { code: 'de-DE', label: 'Deutsch' },
    { code: 'fr-FR', label: 'Français' },
    { code: 'es-ES', label: 'Español' },
    { code: 'ja-JP', label: '日本語' },
    { code: 'ko-KR', label: '한국어' },
    { code: 'zh-CN', label: '简体中文' },
] as const;

export type LanguageCode = typeof LANGUAGES[number]['code'];

export const DEFAULT_LANGUAGE: LanguageCode = 'zh-TW';
export const FALLBACK_LANGUAGE: LanguageCode = 'en-US';

const SUPPORTED = new Set<string>(LANGUAGES.map((l) => l.code));

const PRIMARY_TO_SUPPORTED: Record<string, LanguageCode> = {
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
    ja: 'ja-JP',
    ko: 'ko-KR',
};

// Traditional-script Chinese regions; everything else zh-* is Simplified.
const TRADITIONAL_CHINESE = /^zh-(hant|tw|hk|mo)/i;

/**
 * Maps any BCP 47 tag (e.g. "en", "en-GB", "zh-Hant-HK", "zh-SG") to a
 * supported language, or returns the input unchanged so i18next can fall back.
 */
export function normalizeLanguage(tag: string): string {
    if (!tag) return tag;
    const exact = LANGUAGES.find((l) => l.code.toLowerCase() === tag.toLowerCase());
    if (exact) return exact.code;

    const primary = tag.split('-')[0].toLowerCase();
    if (primary === 'zh') {
        return TRADITIONAL_CHINESE.test(tag) ? 'zh-TW' : 'zh-CN';
    }
    return PRIMARY_TO_SUPPORTED[primary] ?? tag;
}

export function isSupportedLanguage(code: string): code is LanguageCode {
    return SUPPORTED.has(code);
}
