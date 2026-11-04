import { describe, it, expect } from 'vitest';
import * as locales from './locales';
import { LANGUAGES, isSupportedLanguage, normalizeLanguage } from './languages';

type Tree = { [key: string]: string | Tree };

function leafKeys(tree: Tree, prefix = ''): string[] {
    return Object.entries(tree).flatMap(([key, value]) =>
        typeof value === 'string' ? [`${prefix}${key}`] : leafKeys(value, `${prefix}${key}.`),
    );
}

function leafValues(tree: Tree): string[] {
    return Object.values(tree).flatMap((v) => (typeof v === 'string' ? [v] : leafValues(v)));
}

const ALL = {
    'zh-TW': locales.zhTw,
    'en-US': locales.enUs,
    'zh-CN': locales.zhCn,
    'ja-JP': locales.jaJp,
    'ko-KR': locales.koKr,
    'de-DE': locales.deDe,
    'fr-FR': locales.frFr,
    'es-ES': locales.esEs,
};

describe('locales', () => {
    const reference = leafKeys(locales.zhTw).sort();

    it('covers every language offered in the menu', () => {
        expect(Object.keys(ALL).sort()).toEqual(LANGUAGES.map((l) => l.code).sort());
    });

    it.each(Object.entries(ALL))('%s has exactly the same keys as zh-TW', (_code, locale) => {
        expect(leafKeys(locale).sort()).toEqual(reference);
    });

    it.each(Object.entries(ALL))('%s has no empty strings', (_code, locale) => {
        expect(leafValues(locale).every((v) => v.trim().length > 0)).toBe(true);
    });

    it.each(Object.entries(ALL))('%s keeps the {{date}} placeholder', (_code, locale) => {
        expect(locale.currency.lastUpdated).toContain('{{date}}');
    });
});

describe('normalizeLanguage', () => {
    it.each([
        ['en', 'en-US'],
        ['en-GB', 'en-US'],
        ['EN-us', 'en-US'],
        ['ja', 'ja-JP'],
        ['ko-KR', 'ko-KR'],
        ['de-AT', 'de-DE'],
        ['fr-CA', 'fr-FR'],
        ['es-MX', 'es-ES'],
        ['zh-TW', 'zh-TW'],
        ['zh-HK', 'zh-TW'],
        ['zh-Hant', 'zh-TW'],
        ['zh-Hant-MO', 'zh-TW'],
        ['zh', 'zh-CN'],
        ['zh-Hans', 'zh-CN'],
        ['zh-SG', 'zh-CN'],
        ['pt-BR', 'pt-BR'],
        ['', ''],
    ])('%s -> %s', (input, expected) => {
        expect(normalizeLanguage(input)).toBe(expected);
    });
});

describe('isSupportedLanguage', () => {
    it('accepts only offered languages', () => {
        expect(isSupportedLanguage('ja-JP')).toBe(true);
        expect(isSupportedLanguage('ja')).toBe(false);
    });
});
