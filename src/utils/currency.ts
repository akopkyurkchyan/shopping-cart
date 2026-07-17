type ExtraLike = {
  amount: number;
};

type ProductLike = {
  price: number;
  quantity: number;
  extras?: ExtraLike[];
};

export const roundCurrency = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

export const formatCurrency = (value: number): string =>
  `$${roundCurrency(value).toFixed(2)}`;

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
