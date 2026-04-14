const productRepository = require('./productRepository');
const { validateProduct } = require('./validators');

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
  const validation = validateProduct(data);

  if (!validation.valid) {
    const error = new Error(validation.errors.join(', '));
    error.status = 400;
    throw error;
  }

  return productRepository.create(data);
}

/**
 * Actualiza un producto existente
 */
function updateProduct(id, data) {
  const validation = validateProduct(data, true);

  if (!validation.valid) {
    const error = new Error(validation.errors.join(', '));
    error.status = 400;
    throw error;
  }

  const updated = productRepository.update(id, data);

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
