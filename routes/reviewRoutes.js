const express = require('express');
const router = express.Router();
const { addReview, getRestaurantReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addReview);
router.get('/restaurant/:id', getRestaurantReviews);

module.exports = router;
