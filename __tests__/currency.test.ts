import {
  calcCartTotal,
  calcRowTotal,
  formatCurrency,
  roundCurrency,
} from '../src/utils/currency';

describe('currency utils', () => {
  it('rounds values to two decimals', () => {
    expect(roundCurrency(2.505)).toBe(2.51);
    expect(roundCurrency(12.344)).toBe(12.34);
  });

  it('formats currency with two decimal places', () => {
    expect(formatCurrency(42.3)).toBe('$42.30');
  });

  it('calculates row totals', () => {
    expect(calcRowTotal(2.5, 3)).toBe(7.5);
    expect(
      calcRowTotal(2.5, 3, [
        { amount: 1 },
        { amount: 0.25 },
      ]),
    ).toBe(8.75);
  });

  it('calculates cart totals across products', () => {
    expect(
      calcCartTotal([
        { price: 2.5, quantity: 3 },
        { price: 1.2, quantity: 2 },
      ]),
    ).toBe(9.9);
  });

  it('includes multiple fixed extras in cart totals', () => {
    expect(
      calcCartTotal([
        {
          price: 2.5,
          quantity: 3,
          extras: [{ amount: 1 }, { amount: 0.5 }],
        },
        {
          price: 1.2,
          quantity: 2,
          extras: [{ amount: 0.5 }],
        },
      ]),
    ).toBe(11.9);
  });
});
