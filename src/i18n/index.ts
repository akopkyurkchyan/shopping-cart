import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import de from './locales/de.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import hi from './locales/hi.json';
import hy from './locales/hy.json';
import it from './locales/it.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';
import type { AppLanguageCode, AppLanguagePreference } from '../types/settings';

export const SUPPORTED_LANGUAGES: AppLanguageCode[] = [
  'en',
  'hy',
  'ru',
  'zh',
  'hi',
  'fr',
  'de',
  'it',
];

export const FALLBACK_LANGUAGE: AppLanguageCode = 'en';

const resources = {
  en: { translation: en },
  hy: { translation: hy },
  ru: { translation: ru },
  zh: { translation: zh },
  hi: { translation: hi },
  fr: { translation: fr },
  de: { translation: de },
  it: { translation: it },
};

const isSupportedLanguage = (code: string): code is AppLanguageCode =>
  SUPPORTED_LANGUAGES.includes(code as AppLanguageCode);

export const getDeviceLanguage = (): AppLanguageCode => {
  const locales = RNLocalize.getLocales();

  for (const locale of locales) {
    const languageCode = locale.languageCode?.toLowerCase();

    if (languageCode && isSupportedLanguage(languageCode)) {
      return languageCode;
    }
  }

  return FALLBACK_LANGUAGE;
};

export const resolveLanguage = (
  preference: AppLanguagePreference,
): AppLanguageCode => {
  if (preference === 'system') {
    return getDeviceLanguage();
  }

  if (isSupportedLanguage(preference)) {
    return preference;
  }

  return FALLBACK_LANGUAGE;
};

export const applyLanguage = async (
  preference: AppLanguagePreference,
): Promise<AppLanguageCode> => {
  const language = resolveLanguage(preference);
  await i18n.changeLanguage(language);

  return language;
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources,
    lng: FALLBACK_LANGUAGE,
    fallbackLng: FALLBACK_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
