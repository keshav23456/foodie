const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  getRestaurantMenu,
  getMyRestaurant,
} = require('../controllers/restaurantController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.get('/', getRestaurants);
router.get('/mine', protect, roleCheck('owner', 'admin'), getMyRestaurant);
router.get('/:id', getRestaurantById);
router.get('/:id/menu', getRestaurantMenu);
router.post('/', protect, roleCheck('owner', 'admin'), createRestaurant);
router.put('/:id', protect, roleCheck('owner', 'admin'), updateRestaurant);

module.exports = router;
