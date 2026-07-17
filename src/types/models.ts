export type ProductExtraPrice = {
  id: string;
  title: string;
  amount: number;
};

export type Product = {
  id: string;
  shoppingId: string;
  title: string;
  price: number;
  quantity: number;
  extras: ProductExtraPrice[];
};

export type ShoppingCart = {
  id: string;
  title: string;
  date: string;
  total: number;
  createdAt: string;
  products: Product[];
};

export type ShoppingCartSummary = Omit<ShoppingCart, 'products'>;

export type ShoppingCartDraftProduct = Omit<Product, 'shoppingId'>;
