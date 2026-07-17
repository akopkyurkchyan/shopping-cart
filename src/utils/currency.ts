type ExtraLike = {
  amount: number;
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

export const calcExtrasTotal = (extras: ExtraLike[] = []): number =>
  roundCurrency(
    extras.reduce((total, extra) => total + (extra.amount || 0), 0),
  );

export const calcRowTotal = (
  price: number,
  quantity: number,
  extras: ExtraLike[] = [],
): number => roundCurrency(price * quantity + calcExtrasTotal(extras));

export const calcCartTotal = (products: ProductLike[]): number =>
  roundCurrency(
    products.reduce((total, product) => {
      return (
        total +
        product.price * product.quantity +
        calcExtrasTotal(product.extras)
      );
    }, 0),
  );
