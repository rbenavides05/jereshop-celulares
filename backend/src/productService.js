const productRepository = require('./productRepository');
const { validateProduct } = require('./validators');

/**
 * Normaliza el estado del producto
 */
function normalizeStatus(status) {
  if (!status) return 'disponible';

  const normalized = String(status).trim().toLowerCase();

  if (normalized === 'agotado') return 'agotado';
  return 'disponible';
}

/**
 * Obtiene todos los productos
 */
function getAllProducts() {
  return productRepository.findAll();
}

/**
 * Obtiene un producto por ID
 */
function getProductById(id) {
  const product = productRepository.findById(id);

  if (!product) {
    const error = new Error('Producto no encontrado');
    error.status = 404;
    throw error;
  }

  return product;
}

/**
 * Crea un nuevo producto
 */
function createProduct(data) {
  const payload = {
    ...data,
    status: normalizeStatus(data.status)
  };

  const validation = validateProduct(payload);

  if (!validation.valid) {
    const error = new Error(validation.errors.join(', '));
    error.status = 400;
    throw error;
  }

  return productRepository.create(payload);
}

/**
 * Actualiza un producto existente
 */
function updateProduct(id, data) {
  const payload = {
    ...data,
    status: normalizeStatus(data.status)
  };

  const validation = validateProduct(payload, true);

  if (!validation.valid) {
    const error = new Error(validation.errors.join(', '));
    error.status = 400;
    throw error;
  }

  const updated = productRepository.update(id, payload);

  if (!updated) {
    const error = new Error('Producto no encontrado');
    error.status = 404;
    throw error;
  }

  return updated;
}

/**
 * Elimina un producto
 */
function deleteProduct(id) {
  const deleted = productRepository.delete(id);

  if (!deleted) {
    const error = new Error('Producto no encontrado');
    error.status = 404;
    throw error;
  }

  return { message: 'Producto eliminado correctamente' };
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};