import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './data/en.json';
import pt from './data/pt.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pt: { translation: en }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    returnObjects: true,
  });

export default i18n;
