export const createShoppingCartsTable = `
  CREATE TABLE IF NOT EXISTS shopping_carts (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL DEFAULT 'Shopping',
    date TEXT NOT NULL,
    total REAL NOT NULL,
    created_at TEXT NOT NULL
  );
`;

export const createProductsTable = `
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY NOT NULL,
    shopping_id TEXT NOT NULL,
    title TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    extra_price REAL NOT NULL DEFAULT 0,
    FOREIGN KEY (shopping_id) REFERENCES shopping_carts(id) ON DELETE CASCADE
  );
`;

export const createProductExtrasTable = `
  CREATE TABLE IF NOT EXISTS product_extras (
    id TEXT PRIMARY KEY NOT NULL,
    product_id TEXT NOT NULL,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );
`;

export const createProductsShoppingIdIndex = `
  CREATE INDEX IF NOT EXISTS idx_products_shopping_id
  ON products (shopping_id);
`;

export const createProductExtrasProductIdIndex = `
  CREATE INDEX IF NOT EXISTS idx_product_extras_product_id
  ON product_extras (product_id);
`;

export const addProductsExtraPriceColumn = `
  ALTER TABLE products ADD COLUMN extra_price REAL NOT NULL DEFAULT 0;
`;

export const createAppSettingsTable = `
  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT
  );
`;
