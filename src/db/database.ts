import { open, type DB } from '@op-engineering/op-sqlite';
import uuid from 'react-native-uuid';

import {
  addProductsExtraPriceColumn,
  createAppSettingsTable,
  createProductExtrasProductIdIndex,
  createProductExtrasTable,
  createProductsShoppingIdIndex,
  createProductsTable,
  createShoppingCartsTable,
} from './schema';

let database: DB | null = null;
let initPromise: Promise<DB> | null = null;

const ensureForeignKeys = async (db: DB): Promise<void> => {
  await db.execute('PRAGMA foreign_keys = ON;');
};

const ensureExtraPriceColumn = async (db: DB): Promise<void> => {
  const columns = await db.execute('PRAGMA table_info(products);');
  const hasExtraPrice = columns.rows.some(
    column => column.name === 'extra_price',
  );

  if (!hasExtraPrice) {
    await db.execute(addProductsExtraPriceColumn);
  }
};

const migrateLegacyExtraPrices = async (db: DB): Promise<void> => {
  const legacyExtras = await db.execute(
    `
      SELECT id, extra_price
      FROM products
      WHERE extra_price > 0
        AND id NOT IN (SELECT DISTINCT product_id FROM product_extras);
    `,
  );

  for (const row of legacyExtras.rows) {
    const productId = String(row.id);
    const amount = Number(row.extra_price);

    if (!productId || !Number.isFinite(amount) || amount <= 0) {
      continue;
    }

    await db.execute(
      `
        INSERT INTO product_extras (id, product_id, title, amount)
        VALUES (?, ?, ?, ?);
      `,
      [String(uuid.v4()), productId, 'Extra', amount],
    );
  }
};

const migrate = async (db: DB): Promise<void> => {
  await db.execute(createShoppingCartsTable);
  await db.execute(createProductsTable);
  await db.execute(createProductsShoppingIdIndex);
  await ensureExtraPriceColumn(db);
  await db.execute(createProductExtrasTable);
  await db.execute(createProductExtrasProductIdIndex);
  await migrateLegacyExtraPrices(db);
  await db.execute(createAppSettingsTable);
};

export const initDatabase = async (): Promise<DB> => {
  if (database) {
    return database;
  }

  if (!initPromise) {
    initPromise = (async () => {
      const db = open({
        name: 'shopping-cart.db',
      });

      await ensureForeignKeys(db);
      await migrate(db);
      database = db;

      return db;
    })();
  }

  return initPromise;
};

export const getDatabase = async (): Promise<DB> => initDatabase();
