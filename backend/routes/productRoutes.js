const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { optionalProtect, protect } = require('../middleware/authMiddleware');
const { uploadProductImages } = require('../middleware/uploadMiddleware');

router.get('/', optionalProtect, productController.getAllProducts);
router.get('/mine', protect, productController.getMyProducts);
router.get('/seller/:sellerId', productController.getSellerProducts);
router.get('/:id', optionalProtect, productController.getProduct);
router.post('/', protect, uploadProductImages, productController.createProduct);
router.put('/:id', protect, uploadProductImages, productController.updateProduct);
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router;
