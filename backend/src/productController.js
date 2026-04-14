const productService = require('./productService');

/**
 * GET /api/products
 */
function getAllProducts(req, res, next) {
  try {
    const products = productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/products/:id
 */
function getProductById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const product = productService.getProductById(id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/products
 */
function createProduct(req, res, next) {
  try {
    console.log('🔥 BODY RECIBIDO:', req.body);
    const newProduct = productService.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/products/:id
 */
function updateProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const updatedProduct = productService.updateProduct(id, req.body);
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/products/:id
 */
function deleteProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const result = productService.deleteProduct(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};