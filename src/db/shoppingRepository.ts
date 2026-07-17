import type { Scalar } from '@op-engineering/op-sqlite';

import { getDatabase } from './database';
import { calcCartTotal, roundCurrency } from '../utils/currency';
import type {
  Product,
  ProductExtraPrice,
  ShoppingCart,
  ShoppingCartDraftProduct,
  ShoppingCartSummary,
} from '../types/models';

type CartRow = {
  id: string;
  title: string;
  date: string;
  total: number;
  created_at: string;
};

type ProductRow = {
  id: string;
  shopping_id: string;
  title: string;
  price: number;
  quantity: number;
};

type ExtraRow = {
  id: string;
  product_id: string;
  title: string;
  amount: number;
};

type SaveCartInput = {
  id: string;
  title: string;
  date: string;
  createdAt: string;
  products: ShoppingCartDraftProduct[];
};

const mapCartSummary = (row: Record<string, Scalar>): ShoppingCartSummary => {
  const cartRow = row as unknown as CartRow;

  return {
    id: cartRow.id,
    title: cartRow.title,
    date: cartRow.date,
    total: Number(cartRow.total),
    createdAt: cartRow.created_at,
  };
};

const mapExtra = (row: Record<string, Scalar>): ProductExtraPrice => {
  const extraRow = row as unknown as ExtraRow;

  return {
    id: extraRow.id,
    title: extraRow.title,
    amount: Number(extraRow.amount),
  };
};

const mapProduct = (
  row: Record<string, Scalar>,
  extras: ProductExtraPrice[],
): Product => {
  const productRow = row as unknown as ProductRow;

  return {
    id: productRow.id,
    shoppingId: productRow.shopping_id,
    title: productRow.title,
    price: Number(productRow.price),
    quantity: Number(productRow.quantity),
    extras,
  };
};

export const getAllCarts = async (): Promise<ShoppingCartSummary[]> => {
  const db = await getDatabase();
  const result = await db.execute(
    `
      SELECT id, title, date, total, created_at
      FROM shopping_carts
      ORDER BY date DESC, created_at DESC;
    `,
  );

  return result.rows.map(mapCartSummary);
};

export const getCartById = async (id: string): Promise<ShoppingCart | null> => {
  const db = await getDatabase();
  const cartResult = await db.execute(
    `
      SELECT id, title, date, total, created_at
      FROM shopping_carts
      WHERE id = ?;
    `,
    [id],
  );

  if (!cartResult.rows.length) {
    return null;
  }

  const productResult = await db.execute(
    `
      SELECT id, shopping_id, title, price, quantity
      FROM products
      WHERE shopping_id = ?
      ORDER BY rowid ASC;
    `,
    [id],
  );

  const products: Product[] = [];

  for (const productRow of productResult.rows) {
    const productId = String(productRow.id);
    const extrasResult = await db.execute(
      `
        SELECT id, product_id, title, amount
        FROM product_extras
        WHERE product_id = ?
        ORDER BY rowid ASC;
      `,
      [productId],
    );

    products.push(mapProduct(productRow, extrasResult.rows.map(mapExtra)));
  }

  const cart = mapCartSummary(cartResult.rows[0]);

  return {
    ...cart,
    products,
  };
};

export const saveCart = async ({
  id,
  title,
  date,
  createdAt,
  products,
}: SaveCartInput): Promise<ShoppingCart> => {
  const db = await getDatabase();
  const normalizedTitle = title.trim() || 'Shopping';
  const total = calcCartTotal(
    products.map(product => ({
      price: roundCurrency(product.price),
      quantity: product.quantity,
      extras: (product.extras ?? []).map(extra => ({
        amount: roundCurrency(extra.amount),
      })),
    })),
  );

  await db.transaction(async tx => {
    await tx.execute(
      `
        INSERT INTO shopping_carts (id, title, date, total, created_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          date = excluded.date,
          total = excluded.total;
      `,
      [id, normalizedTitle, date, total, createdAt],
    );

    await tx.execute(
      `
        DELETE FROM product_extras
        WHERE product_id IN (
          SELECT id FROM products WHERE shopping_id = ?
        );
      `,
      [id],
    );
    await tx.execute('DELETE FROM products WHERE shopping_id = ?;', [id]);

    for (const product of products) {
      await tx.execute(
        `
          INSERT INTO products (id, shopping_id, title, price, quantity, extra_price)
          VALUES (?, ?, ?, ?, ?, ?);
        `,
        [
          product.id,
          id,
          product.title.trim(),
          roundCurrency(product.price),
          product.quantity,
          0,
        ],
      );

      for (const extra of product.extras ?? []) {
        await tx.execute(
          `
            INSERT INTO product_extras (id, product_id, title, amount)
            VALUES (?, ?, ?, ?);
          `,
          [
            extra.id,
            product.id,
            extra.title.trim(),
            roundCurrency(extra.amount),
          ],
        );
      }
    }
  });

  const savedCart = await getCartById(id);

  if (!savedCart) {
    throw new Error('Failed to load saved shopping cart');
  }

  return savedCart;
};

export const deleteCart = async (id: string): Promise<void> => {
  const db = await getDatabase();
  await db.transaction(async tx => {
    await tx.execute(
      `
        DELETE FROM product_extras
        WHERE product_id IN (
          SELECT id FROM products WHERE shopping_id = ?
        );
      `,
      [id],
    );
    await tx.execute('DELETE FROM products WHERE shopping_id = ?;', [id]);
    await tx.execute('DELETE FROM shopping_carts WHERE id = ?;', [id]);
  });
};
