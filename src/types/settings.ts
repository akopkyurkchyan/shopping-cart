export type AppCurrencyCode = string | null;

export type CurrencyOption = {
  code: string;
  label: string;
};

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'USD', label: 'US Dollar (USD)' },
  { code: 'EUR', label: 'Euro (EUR)' },
  { code: 'GBP', label: 'British Pound (GBP)' },
  { code: 'AMD', label: 'Armenian Dram (AMD)' },
  { code: 'RUB', label: 'Russian Ruble (RUB)' },
  { code: 'GEL', label: 'Georgian Lari (GEL)' },
  { code: 'TRY', label: 'Turkish Lira (TRY)' },
  { code: 'AED', label: 'UAE Dirham (AED)' },
  { code: 'JPY', label: 'Japanese Yen (JPY)' },
  { code: 'CNY', label: 'Chinese Yuan (CNY)' },
];

export const CURRENCY_SETTING_KEY = 'currency';
