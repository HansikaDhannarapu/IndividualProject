const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/', adminController.getAdminDashboard);
router.get('/stats', adminController.getStats);
router.put('/users/:id/ban', adminController.setUserBan);
router.put('/products/:id/flag', adminController.setProductFlag);
router.delete('/products/:id', adminController.deleteProduct);

module.exports = router;
