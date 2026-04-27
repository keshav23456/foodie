const express = require('express');
const router = express.Router();
const {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  getMenuByRestaurant,
} = require('../controllers/menuController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/restaurant/:restaurantId', getMenuByRestaurant);
router.post('/', protect, roleCheck('owner', 'admin'), addMenuItem);
router.put('/:itemId', protect, roleCheck('owner', 'admin'), updateMenuItem);
router.delete('/:itemId', protect, roleCheck('owner', 'admin'), deleteMenuItem);
router.patch('/:itemId/toggle', protect, roleCheck('owner', 'admin'), toggleAvailability);

module.exports = router;
