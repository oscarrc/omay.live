import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: (code) => {
            const fallbacks = [];
            const langPart = code.split('-')[0];
            if(code === "any") return ['en']
            if (langPart !== code) fallbacks.push(langPart);
            return fallbacks;
        },        
        debug: false,
        interpolation: {
            escapeValue: false
        }
    });


export default i18n;