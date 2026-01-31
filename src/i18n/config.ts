import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { zhTw, enUs, deDe, frFr, esEs, jaJp, koKr, zhCn } from './locales';

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
        fallbackLng: 'zh-TW', // Default language
        interpolation: {
            escapeValue: false, // React already safes from xss
        },
        detection: {
            order: ['queryString', 'cookie', 'localStorage', 'navigator'],
            caches: ['localStorage'],
        }
    });

export default i18n;
