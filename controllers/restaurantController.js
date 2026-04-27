const Restaurant = require('../models/restaurantModel');
const MenuItem = require('../models/menuItemModel');
const asyncHandler = require('../utils/asyncHandler');

const getRestaurants = asyncHandler(async (req, res) => {
  const { search, cuisine, veg, minRating, sort } = req.query;
  const filter = { isApproved: true, isActive: true };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { cuisines: { $regex: search, $options: 'i' } },
    ];
  }
  if (cuisine) filter.cuisines = { $regex: cuisine, $options: 'i' };
  if (minRating) filter.rating = { $gte: Number(minRating) };

  let query = Restaurant.find(filter).populate('owner', 'name email');
  if (sort === 'rating') query = query.sort({ rating: -1 });
  else if (sort === 'deliveryTime') query = query.sort({ deliveryTime: 1 });
  else query = query.sort({ createdAt: -1 });

  const restaurants = await query;

  if (veg === 'true') {
    const vegRestaurantIds = await MenuItem.distinct('restaurant', { isVeg: true });
    const filtered = restaurants.filter((r) =>
      vegRestaurantIds.map((id) => id.toString()).includes(r._id.toString())
    );
    return res.json({ success: true, data: filtered });
  }

  res.json({ success: true, data: restaurants });
});

const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email');
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }
  res.json({ success: true, data: restaurant });
});

const createRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.create({ ...req.body, owner: req.user._id });
  res.status(201).json({ success: true, data: restaurant });
});

const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }
  if (
    restaurant.owner.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to update this restaurant');
  }
  const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: updated });
});

const getRestaurantMenu = asyncHandler(async (req, res) => {
  const items = await MenuItem.find({
    restaurant: req.params.id,
    isAvailable: true,
  });
  res.json({ success: true, data: items });
});

const getMyRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ owner: req.user._id });
  if (!restaurant) {
    res.status(404);
    throw new Error('You do not have a restaurant yet');
  }
  res.json({ success: true, data: restaurant });
});

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  getRestaurantMenu,
  getMyRestaurant,
};
