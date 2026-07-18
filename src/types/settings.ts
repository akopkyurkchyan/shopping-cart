export type AppCurrencyCode = string | null;

export type AppLanguageCode =
  | 'en'
  | 'hy'
  | 'ru'
  | 'zh'
  | 'hi'
  | 'fr'
  | 'de'
  | 'it';

export type AppLanguagePreference = 'system' | AppLanguageCode;

export type CurrencyOption = {
  code: string;
  labelKey: string;
};

export type LanguageOption = {
  code: AppLanguageCode;
  labelKey: string;
};

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'USD', labelKey: 'currency.USD' },
  { code: 'EUR', labelKey: 'currency.EUR' },
  { code: 'GBP', labelKey: 'currency.GBP' },
  { code: 'AMD', labelKey: 'currency.AMD' },
  { code: 'RUB', labelKey: 'currency.RUB' },
  { code: 'GEL', labelKey: 'currency.GEL' },
  { code: 'TRY', labelKey: 'currency.TRY' },
  { code: 'AED', labelKey: 'currency.AED' },
  { code: 'JPY', labelKey: 'currency.JPY' },
  { code: 'CNY', labelKey: 'currency.CNY' },
];

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', labelKey: 'languages.en' },
  { code: 'hy', labelKey: 'languages.hy' },
  { code: 'ru', labelKey: 'languages.ru' },
  { code: 'zh', labelKey: 'languages.zh' },
  { code: 'hi', labelKey: 'languages.hi' },
  { code: 'fr', labelKey: 'languages.fr' },
  { code: 'de', labelKey: 'languages.de' },
  { code: 'it', labelKey: 'languages.it' },
];

export const CURRENCY_SETTING_KEY = 'currency';
export const LANGUAGE_SETTING_KEY = 'language';
export const DEFAULT_LANGUAGE_PREFERENCE: AppLanguagePreference = 'system';
