import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  he: { translation: { "Pantry": "מזווה", "Recipes": "מתכונים" } },
  en: { translation: { "Pantry": "Pantry", "Recipes": "Recipes" } }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "he",
  fallbackLng: "he",
  interpolation: { escapeValue: false }
});

export default i18n;
