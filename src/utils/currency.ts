import type { ProductExtraScope } from '../types/models';

type ExtraLike = {
  amount: number;
  scope?: ProductExtraScope;
};

type ProductLike = {
  price: number;
  quantity: number;
  extras?: ExtraLike[];
};

export type CurrencyCode = string | null;

export const roundCurrency = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

export const formatCurrency = (
  value: number,
  currency: CurrencyCode = null,
): string => {
  const amount = roundCurrency(value);

  if (!currency) {
    return amount.toFixed(2);
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
};

/**
 * Sums extras for a product row.
 * - `unit` (default): amount × quantity
 * - `product`: amount once
 */
export const calcExtrasTotal = (
  extras: ExtraLike[] = [],
  quantity = 1,
): number =>
  roundCurrency(
    extras.reduce((total, extra) => {
      const amount = extra.amount || 0;
      const scope = extra.scope ?? 'unit';

      return total + (scope === 'product' ? amount : amount * quantity);
    }, 0),
  );

export const calcRowTotal = (
  price: number,
  quantity: number,
  extras: ExtraLike[] = [],
): number =>
  roundCurrency(price * quantity + calcExtrasTotal(extras, quantity));

export const calcCartTotal = (products: ProductLike[]): number =>
  roundCurrency(
    products.reduce(
      (total, product) =>
        total +
        product.price * product.quantity +
        calcExtrasTotal(product.extras, product.quantity),
      0,
    ),
  );
