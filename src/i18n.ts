import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      he: {
        translation: {
          signup: {
            title: 'הרשמה',
            email: 'דוא"ל',
            password: 'סיסמה',
            submit: 'הירשם'
          }
        }
      },
      en: {
        translation: {
          signup: {
            title: 'Signup',
            email: 'Email',
            password: 'Password',
            submit: 'Signup'
          }
        }
      }
    },
    fallbackLng: 'he',
    detection: { order: ['navigator', 'htmlTag', 'path', 'subdomain'] },
    interpolation: { escapeValue: false }
  });

export default i18n;