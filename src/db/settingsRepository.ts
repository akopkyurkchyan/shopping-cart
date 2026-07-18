import { getDatabase } from './database';
import {
  CURRENCY_SETTING_KEY,
  DEFAULT_LANGUAGE_PREFERENCE,
  LANGUAGE_SETTING_KEY,
} from '../types/settings';
import type {
  AppCurrencyCode,
  AppLanguageCode,
  AppLanguagePreference,
} from '../types/settings';

const SUPPORTED_LANGUAGE_CODES: AppLanguageCode[] = [
  'en',
  'hy',
  'ru',
  'zh',
  'hi',
  'fr',
  'de',
  'it',
];

const isLanguagePreference = (
  value: string,
): value is AppLanguagePreference =>
  value === 'system' ||
  SUPPORTED_LANGUAGE_CODES.includes(value as AppLanguageCode);

export const getCurrencySetting = async (): Promise<AppCurrencyCode> => {
  const db = await getDatabase();
  const result = await db.execute(
    `
      SELECT value
      FROM app_settings
      WHERE key = ?;
    `,
    [CURRENCY_SETTING_KEY],
  );

  if (!result.rows.length) {
    return null;
  }

  const value = result.rows[0].value;

  if (value === null || value === undefined || value === '') {
    return null;
  }

  return String(value);
};

export const setCurrencySetting = async (
  currency: AppCurrencyCode,
): Promise<void> => {
  const db = await getDatabase();
  const value = currency ?? '';

  await db.execute(
    `
      INSERT INTO app_settings (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value;
    `,
    [CURRENCY_SETTING_KEY, value],
  );
};

export const getLanguageSetting =
  async (): Promise<AppLanguagePreference> => {
    const db = await getDatabase();
    const result = await db.execute(
      `
      SELECT value
      FROM app_settings
      WHERE key = ?;
    `,
      [LANGUAGE_SETTING_KEY],
    );

    if (!result.rows.length) {
      return DEFAULT_LANGUAGE_PREFERENCE;
    }

    const value = result.rows[0].value;

    if (value === null || value === undefined || value === '') {
      return DEFAULT_LANGUAGE_PREFERENCE;
    }

    const language = String(value);

    if (!isLanguagePreference(language)) {
      return DEFAULT_LANGUAGE_PREFERENCE;
    }

    return language;
  };

export const setLanguageSetting = async (
  language: AppLanguagePreference,
): Promise<void> => {
  const db = await getDatabase();

  await db.execute(
    `
      INSERT INTO app_settings (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value;
    `,
    [LANGUAGE_SETTING_KEY, language],
  );
};
