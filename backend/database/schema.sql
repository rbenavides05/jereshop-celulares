CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  original_price REAL,
  storage TEXT,
  image_url TEXT NOT NULL,
  whatsapp_link TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);