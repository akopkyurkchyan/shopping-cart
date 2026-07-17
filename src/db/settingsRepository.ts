import { getDatabase } from './database';
import { CURRENCY_SETTING_KEY } from '../types/settings';
import type { AppCurrencyCode } from '../types/settings';

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
