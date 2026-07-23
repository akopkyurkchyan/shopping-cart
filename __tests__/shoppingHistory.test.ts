import {
  formatMonthLabel,
  getMonthKey,
  groupCartsByMonth,
} from '../src/utils/shoppingHistory';
import type { ShoppingCartSummary } from '../src/types/models';

const makeCart = (
  overrides: Partial<ShoppingCartSummary> & Pick<ShoppingCartSummary, 'id' | 'date'>,
): ShoppingCartSummary => ({
  createdAt: '2026-07-01T00:00:00.000Z',
  title: 'Shopping',
  total: 10,
  ...overrides,
});

describe('shoppingHistory utils', () => {
  it('builds a YYYY-MM month key from a local calendar date', () => {
    expect(getMonthKey('2026-07-22')).toBe('2026-07');
    expect(getMonthKey('2026-01-01')).toBe('2026-01');
  });

  it('formats month labels with the given locale', () => {
    expect(formatMonthLabel('2026-07', 'en')).toBe('July 2026');
  });

  it('groups carts by month with newest months and carts first', () => {
    const carts = [
      makeCart({ id: '1', date: '2026-07-22', title: 'July latest' }),
      makeCart({ id: '2', date: '2026-07-01', title: 'July earlier' }),
      makeCart({ id: '3', date: '2026-06-15', title: 'June' }),
      makeCart({ id: '4', date: '2025-12-31', title: 'December' }),
    ];

    const groups = groupCartsByMonth(carts, 'en');

    expect(groups.map(group => group.key)).toEqual([
      '2026-07',
      '2026-06',
      '2025-12',
    ]);
    expect(groups[0].title).toBe('July 2026');
    expect(groups[0].carts.map(cart => cart.id)).toEqual(['1', '2']);
    expect(groups[1].carts.map(cart => cart.id)).toEqual(['3']);
  });
});
