-- Schema para la base de datos de productos de Jereshop
-- Este archivo define la estructura de la tabla products

DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  storage TEXT NOT NULL,
  original_price REAL NOT NULL CHECK(original_price > 0),
  discount_price REAL NOT NULL CHECK(discount_price > 0),
  image_url TEXT NOT NULL,
  whatsapp_link TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
