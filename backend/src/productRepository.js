const { getDb } = require('./db/connection');

function findAll() {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM products ORDER BY id DESC');
  return stmt.all();
}

function findById(id) {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
  return stmt.get(id);
}

function create(product) {
  const db = getDb();

  const stmt = db.prepare(`
    INSERT INTO products (
      name,
      price,
      original_price,
      storage,
      image_url,
      whatsapp_link,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    product.name,
    product.price,
    product.original_price ?? null,
    product.storage ?? null,
    product.image_url,
    product.whatsapp_link,
    product.status || 'disponible'
  );

  return findById(result.lastInsertRowid);
}

function update(id, product) {
  const db = getDb();
  const existing = findById(id);

  if (!existing) {
    return null;
  }

  const updatedProduct = {
    ...existing,
    ...product,
    status: product.status || existing.status || 'disponible'
  };

  const stmt = db.prepare(`
    UPDATE products
    SET name = ?,
        price = ?,
        original_price = ?,
        storage = ?,
        image_url = ?,
        whatsapp_link = ?,
        status = ?
    WHERE id = ?
  `);

  stmt.run(
    updatedProduct.name,
    updatedProduct.price,
    updatedProduct.original_price ?? null,
    updatedProduct.storage ?? null,
    updatedProduct.image_url,
    updatedProduct.whatsapp_link,
    updatedProduct.status,
    id
  );

  return findById(id);
}

function deleteProduct(id) {
  const db = getDb();
  const existing = findById(id);

  if (!existing) {
    return false;
  }

  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
  stmt.run(id);
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  delete: deleteProduct
};