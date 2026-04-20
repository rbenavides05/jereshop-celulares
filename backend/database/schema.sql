DROP TABLE IF EXISTS products;

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  name TEXT NOT NULL,
  price REAL NOT NULL,
  original_price REAL,

  storage TEXT,

  image_url TEXT NOT NULL,
  whatsapp_link TEXT NOT NULL,

  status TEXT NOT NULL DEFAULT 'disponible'
    CHECK(status IN ('disponible', 'agotado')),

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);