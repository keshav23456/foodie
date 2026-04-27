const Review = require('../models/reviewModel');
const Restaurant = require('../models/restaurantModel');
const Order = require('../models/orderModels');
const asyncHandler = require('../utils/asyncHandler');

const addReview = asyncHandler(async (req, res) => {
  const { restaurantId, orderId, rating, comment } = req.body;

  const order = await Order.findById(orderId);
  if (!order || order.orderStatus !== 'delivered') {
    res.status(400);
    throw new Error('Can only review delivered orders');
  }

  const existing = await Review.findOne({ user: req.user._id, order: orderId });
  if (existing) {
    res.status(400);
    throw new Error('Already reviewed this order');
  }

  const review = await Review.create({
    user: req.user._id,
    restaurant: restaurantId,
    order: orderId,
    rating,
    comment,
  });

  // Update restaurant average rating
  const reviews = await Review.find({ restaurant: restaurantId });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Restaurant.findByIdAndUpdate(restaurantId, {
    rating: Math.round(avgRating * 10) / 10,
    totalReviews: reviews.length,
  });

  res.status(201).json({ success: true, data: review });
});

const getRestaurantReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ restaurant: req.params.id })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: reviews });
});

module.exports = { addReview, getRestaurantReviews };
