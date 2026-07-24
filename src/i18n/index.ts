import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import type { AppLanguageCode, AppLanguagePreference } from '../types/settings';

// Use require() for locale JSON. Metro's ESM JSON imports can wrap the file as
// `{ default: { ... } }`, which nests every key under `default.*` and makes
// `t('about.title')` return the raw key instead of the translated string.
const unwrapLocale = <T,>(mod: T | { default: T }): T => {
  if (
    mod &&
    typeof mod === 'object' &&
    'default' in (mod as object) &&
    (mod as { default: unknown }).default &&
    typeof (mod as { default: unknown }).default === 'object'
  ) {
    return (mod as { default: T }).default;
  }

  return mod as T;
};

const de = unwrapLocale(require('./locales/de.json'));
const en = unwrapLocale(require('./locales/en.json'));
const fr = unwrapLocale(require('./locales/fr.json'));
const hi = unwrapLocale(require('./locales/hi.json'));
const hy = unwrapLocale(require('./locales/hy.json'));
const it = unwrapLocale(require('./locales/it.json'));
const ru = unwrapLocale(require('./locales/ru.json'));
const zh = unwrapLocale(require('./locales/zh.json'));

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
  de: { translation: de },
  en: { translation: en },
  fr: { translation: fr },
  hi: { translation: hi },
  hy: { translation: hy },
  it: { translation: it },
  ru: { translation: ru },
  zh: { translation: zh },
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

const registerResources = () => {
  for (const [language, bundle] of Object.entries(resources)) {
    // deep: true + overwrite: true so Fast Refresh / Metro reloads pick up
    // newly added translation keys instead of leaving raw keys on screen.
    i18n.addResourceBundle(
      language,
      'translation',
      bundle.translation,
      true,
      true,
    );
  }
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    fallbackLng: FALLBACK_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
    lng: FALLBACK_LANGUAGE,
    react: {
      useSuspense: false,
    },
    resources,
  });
} else {
  registerResources();
}

export default i18n;
