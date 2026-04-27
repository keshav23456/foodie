const Restaurant = require('../models/restaurantModel');
const User = require('../models/userModel');
const Order = require('../models/orderModels');
const asyncHandler = require('../utils/asyncHandler');

const getPendingRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({ isApproved: false }).populate('owner', 'name email');
  res.json({ success: true, data: restaurants });
});

const approveRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { isApproved: req.body.isApproved !== false },
    { new: true }
  );
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }
  res.json({ success: true, data: restaurant });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('userid', 'name email')
    .populate('restaurant', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

module.exports = { getPendingRestaurants, approveRestaurant, getAllUsers, getAllOrders };
