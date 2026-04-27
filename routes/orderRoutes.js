const express = require('express');
const router = express.Router();
const {
  createCheckoutSession,
  verifyPayment,
  getMyOrders,
  getRestaurantOrders,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.post('/checkout_session', protect, createCheckoutSession);
router.post('/verify-payment', protect, verifyPayment);
router.get('/my', protect, getMyOrders);
router.get('/all', protect, roleCheck('admin'), getAllOrders);
router.get('/restaurant/:id', protect, roleCheck('owner', 'admin'), getRestaurantOrders);
router.patch('/:id/status', protect, roleCheck('owner', 'admin'), updateOrderStatus);

module.exports = router;
