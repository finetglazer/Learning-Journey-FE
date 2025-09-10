import * as i18n from "i18next";
import type { Callback, InitOptions } from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translationENG from "./../../locales/en";
import translationVI from "./../../locales/vi";

const resources = {
  vi: {
    translation: translationVI,
  },
  en: {
    translation: translationENG,
  },
};

class I18nTranslation {
  public async initialize(
    initOptions?: InitOptions,
    callback?: Callback
  ): Promise<void> {
    await i18n
      .use(detector)
      .use(initReactI18next)
      .init(
        initOptions ?? {
          resources,
          compatibilityJSON: "v3",
          lng: localStorage.getItem("I18N_LANGUAGE") || "vi",
          fallbackLng: "vi",
          interpolation: {
            escapeValue: false,
          },
        },
        callback
      );
  }

  public async changeLanguage(lang: string): Promise<void> {
    await i18n.changeLanguage(lang);
  }
}

const i18nTranslation = new I18nTranslation();

export default i18nTranslation;
export function translate(keyTranslate: string): string {
  return keyTranslate;
}
