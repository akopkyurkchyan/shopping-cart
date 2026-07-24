import {
  filterCartsByDateRange,
  formatMonthLabel,
  getMonthKey,
  groupCartsByMonth,
  HISTORY_PAGE_SIZE,
  normalizeDateRange,
  paginateCarts,
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

  it('returns all carts when date range bounds are empty', () => {
    const carts = [
      makeCart({ id: '1', date: '2026-07-22' }),
      makeCart({ id: '2', date: '2026-06-01' }),
    ];

    expect(filterCartsByDateRange(carts, '', '')).toEqual(carts);
  });

  it('filters carts inclusively by from and to dates', () => {
    const carts = [
      makeCart({ id: '1', date: '2026-07-22' }),
      makeCart({ id: '2', date: '2026-07-10' }),
      makeCart({ id: '3', date: '2026-07-01' }),
      makeCart({ id: '4', date: '2026-06-15' }),
    ];

    expect(
      filterCartsByDateRange(carts, '2026-07-01', '2026-07-10').map(
        cart => cart.id,
      ),
    ).toEqual(['2', '3']);
    expect(
      filterCartsByDateRange(carts, '2026-07-10', '').map(cart => cart.id),
    ).toEqual(['1', '2']);
    expect(
      filterCartsByDateRange(carts, '', '2026-07-01').map(cart => cart.id),
    ).toEqual(['3', '4']);
  });

  it('paginates carts with the default page size', () => {
    const carts = Array.from({ length: 15 }, (_, index) =>
      makeCart({
        date: `2026-07-${String(15 - index).padStart(2, '0')}`,
        id: String(index + 1),
      }),
    );

    expect(HISTORY_PAGE_SIZE).toBe(10);
    expect(paginateCarts(carts, HISTORY_PAGE_SIZE).map(cart => cart.id)).toEqual(
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    );
    expect(paginateCarts(carts, 20).map(cart => cart.id)).toHaveLength(15);
  });

  it('swaps inverted from/to dates when normalizing', () => {
    expect(normalizeDateRange('2026-07-20', '2026-07-01')).toEqual({
      fromDate: '2026-07-01',
      toDate: '2026-07-20',
    });
    expect(normalizeDateRange('2026-07-01', '')).toEqual({
      fromDate: '2026-07-01',
      toDate: '',
    });
  });
});
