import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { zhTw, enUs, deDe, frFr, esEs, jaJp, koKr, zhCn } from './locales';
import { DEFAULT_LANGUAGE, FALLBACK_LANGUAGE, LANGUAGES, normalizeLanguage } from './languages';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            'zh-TW': { translation: zhTw },
            'en-US': { translation: enUs },
            'de-DE': { translation: deDe },
            'fr-FR': { translation: frFr },
            'es-ES': { translation: esEs },
            'ja-JP': { translation: jaJp },
            'ko-KR': { translation: koKr },
            'zh-CN': { translation: zhCn },
        },
        supportedLngs: LANGUAGES.map((l) => l.code),
        // Chinese readers fall back to the other Chinese script; everyone else to English.
        fallbackLng: {
            'zh-CN': [DEFAULT_LANGUAGE, FALLBACK_LANGUAGE],
            'zh-TW': [FALLBACK_LANGUAGE],
            default: [FALLBACK_LANGUAGE],
        },
        load: 'currentOnly',
        interpolation: {
            escapeValue: false, // React already escapes rendered strings
        },
        detection: {
            order: ['querystring', 'localStorage', 'navigator'],
            caches: ['localStorage'],
            convertDetectedLanguage: normalizeLanguage,
        },
    });

// Keep <html lang> in sync for screen readers and correct font selection.
const syncHtmlLang = (lng: string) => {
    document.documentElement.lang = lng;
};
syncHtmlLang(i18n.resolvedLanguage ?? DEFAULT_LANGUAGE);
i18n.on('languageChanged', syncHtmlLang);

export default i18n;
