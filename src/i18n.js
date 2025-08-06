// 📁 File: src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi) // <-- সমাধান: প্লাগইন যোগ করা হয়েছে
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'bn'], // সমর্থিত ভাষা
    fallbackLng: "en",
    detection: {
      order: ['cookie', 'localStorage', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // ভাষার ফাইল কোথায় আছে
    },
  });
export default i18n;