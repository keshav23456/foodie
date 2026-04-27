const MenuItem = require('../models/menuItemModel');
const Restaurant = require('../models/restaurantModel');
const asyncHandler = require('../utils/asyncHandler');

const verifyOwner = async (itemId, userId) => {
  const item = await MenuItem.findById(itemId).populate('restaurant');
  if (!item) return { item: null, error: 'Item not found' };
  if (item.restaurant.owner.toString() !== userId.toString())
    return { item, error: 'Not authorized' };
  return { item, error: null };
};

const addMenuItem = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ owner: req.user._id });
  if (!restaurant) {
    res.status(404);
    throw new Error('Create a restaurant first');
  }
  const item = await MenuItem.create({ ...req.body, restaurant: restaurant._id });
  res.status(201).json({ success: true, data: item });
});

const updateMenuItem = asyncHandler(async (req, res) => {
  const { item, error } = await verifyOwner(req.params.itemId, req.user._id);
  if (error) {
    res.status(error === 'Item not found' ? 404 : 403);
    throw new Error(error);
  }
  const updated = await MenuItem.findByIdAndUpdate(req.params.itemId, req.body, {
    new: true,
  });
  res.json({ success: true, data: updated });
});

const deleteMenuItem = asyncHandler(async (req, res) => {
  const { item, error } = await verifyOwner(req.params.itemId, req.user._id);
  if (error) {
    res.status(error === 'Item not found' ? 404 : 403);
    throw new Error(error);
  }
  await MenuItem.findByIdAndDelete(req.params.itemId);
  res.json({ success: true, message: 'Item deleted' });
});

const toggleAvailability = asyncHandler(async (req, res) => {
  const { item, error } = await verifyOwner(req.params.itemId, req.user._id);
  if (error) {
    res.status(error === 'Item not found' ? 404 : 403);
    throw new Error(error);
  }
  item.isAvailable = !item.isAvailable;
  await item.save();
  res.json({ success: true, data: item });
});

const getMenuByRestaurant = asyncHandler(async (req, res) => {
  const items = await MenuItem.find({ restaurant: req.params.restaurantId });
  res.json({ success: true, data: items });
});

module.exports = {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  getMenuByRestaurant,
};
