import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    defaultNS: 'translation',
    lng: 'en',
    fallbackLng: ['en'],
    interpolation: {
        escapeValue: false
    },
    // debug: process.env.NODE_ENV === 'development',
    resources: {}
});

export default i18n;
