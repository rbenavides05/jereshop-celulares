const express = require('express');
const router = express.Router();

const productController = require('../productController');
const { verifyAdminAuth } = require('../middleware/authMiddleware');

// Rutas públicas
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas protegidas
router.post('/', verifyAdminAuth, productController.createProduct);
router.put('/:id', verifyAdminAuth, productController.updateProduct);
router.delete('/:id', verifyAdminAuth, productController.deleteProduct);

module.exports = router;