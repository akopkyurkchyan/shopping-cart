import type { ShoppingCartSummary } from '../types/models';
import { parseDateValue } from './date';

export type ShoppingMonthGroup = {
  key: string;
  title: string;
  carts: ShoppingCartSummary[];
};

const MONTH_KEY_PATTERN = /^(\d{4})-(\d{2})$/;

export const getMonthKey = (dateValue: string): string => {
  const parsed = parseDateValue(dateValue);

  if (parsed) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}`;
  }

  const match = MONTH_KEY_PATTERN.exec(dateValue.slice(0, 7));

  if (match) {
    return match[0];
  }

  return 'unknown';
};

export const formatMonthLabel = (monthKey: string, locale: string): string => {
  const match = MONTH_KEY_PATTERN.exec(monthKey);

  if (!match) {
    return monthKey;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const date = new Date(year, month - 1, 1);

  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(date);
};

/**
 * Groups carts by calendar month. Expects `carts` already sorted newest-first
 * (date DESC); that order is preserved within each month section, and months
 * themselves are ordered newest-first.
 */
export const groupCartsByMonth = (
  carts: ShoppingCartSummary[],
  locale: string,
): ShoppingMonthGroup[] => {
  const groups = new Map<string, ShoppingCartSummary[]>();

  for (const cart of carts) {
    const key = getMonthKey(cart.date);
    const existing = groups.get(key);

    if (existing) {
      existing.push(cart);
    } else {
      groups.set(key, [cart]);
    }
  }

  return Array.from(groups.entries())
    .sort(([leftKey], [rightKey]) => rightKey.localeCompare(leftKey))
    .map(([key, monthCarts]) => ({
      carts: monthCarts,
      key,
      title: formatMonthLabel(key, locale),
    }));
};
