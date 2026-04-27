const express = require('express');
const router = express.Router();
const {
  getPendingRestaurants,
  approveRestaurant,
  getAllUsers,
  getAllOrders,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.use(protect, roleCheck('admin'));

router.get('/restaurants/pending', getPendingRestaurants);
router.patch('/restaurants/:id/approve', approveRestaurant);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);

module.exports = router;
