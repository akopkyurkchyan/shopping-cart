import {
  calcCartTotal,
  calcExtrasTotal,
  calcRowTotal,
  formatCurrency,
  roundCurrency,
} from '../src/utils/currency';

describe('currency utils', () => {
  it('rounds values to two decimals', () => {
    expect(roundCurrency(2.505)).toBe(2.51);
    expect(roundCurrency(12.344)).toBe(12.34);
  });

  it('formats amounts without currency when none is set', () => {
    expect(formatCurrency(42.3, null)).toBe('42.30');
  });

  it('formats amounts with a selected currency code', () => {
    expect(formatCurrency(42.3, 'USD')).toMatch(/42\.30/);
    expect(formatCurrency(42.3, 'USD')).not.toBe('42.30');
  });

  it('multiplies unit-scoped extras by quantity by default', () => {
    // 5 * 1 + 5 * 0.15 = 5.75
    expect(
      calcRowTotal(1, 5, [{ amount: 0.15, scope: 'unit' }]),
    ).toBe(5.75);
    expect(calcExtrasTotal([{ amount: 0.15 }], 5)).toBe(0.75);
  });

  it('adds product-scoped extras once', () => {
    // 5 * 1 + 0.15 = 5.15
    expect(
      calcRowTotal(1, 5, [{ amount: 0.15, scope: 'product' }]),
    ).toBe(5.15);
  });

  it('supports mixed extra scopes on one row', () => {
    // 5 * 2 + (0.10 * 5) + 0.50 = 10 + 0.5 + 0.5 = 11
    expect(
      calcRowTotal(2, 5, [
        { amount: 0.1, scope: 'unit' },
        { amount: 0.5, scope: 'product' },
      ]),
    ).toBe(11);
  });

  it('calculates cart totals across products with scopes', () => {
    expect(
      calcCartTotal([
        {
          price: 1,
          quantity: 5,
          extras: [{ amount: 0.15, scope: 'unit' }],
        },
        {
          price: 1,
          quantity: 5,
          extras: [{ amount: 0.15, scope: 'product' }],
        },
      ]),
    ).toBe(10.9);
  });
});
