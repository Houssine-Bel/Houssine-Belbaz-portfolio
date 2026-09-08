import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./locales/fr.json";
import en from "./locales/en.json";
import ar from "./locales/ar.json";
import de from "./locales/de.json";

const savedLanguage = localStorage.getItem("portfolio-language");
const initialLanguage = ["fr", "en", "de", "ar"].includes(savedLanguage ?? "")
  ? savedLanguage!
  : "fr";

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    de: { translation: de },
    ar: { translation: ar },
  },
  lng: initialLanguage,
  fallbackLng: "fr",
  interpolation: { escapeValue: false },
});

export default i18n;
