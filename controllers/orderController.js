const Order = require('../models/orderModels');
const MenuItem = require('../models/menuItemModel');
const Restaurant = require('../models/restaurantModel');
const asyncHandler = require('../utils/asyncHandler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = asyncHandler(async (req, res) => {
  const { cartItems, restaurantId, deliveryAddress } = req.body;

  const itemIds = cartItems.map((item) => item._id);
  const menuItems = await MenuItem.find({ _id: { $in: itemIds } });

  const total = cartItems.reduce((acc, cartItem) => {
    const item = menuItems.find((m) => m._id.toString() === cartItem._id.toString());
    if (!item) return acc;
    const price = item.prices[0] ? item.prices[0][cartItem.varient] : 0;
    return acc + price * cartItem.quantity;
  }, 0);

  const newOrder = await Order.create({
    userid: req.user._id,
    restaurant: restaurantId,
    orderItems: cartItems,
    deliveryAddress,
    orderAmount: total,
    paymentStatus: 'pending',
    orderStatus: 'pending',
  });

  const session = await stripe.checkout.sessions.create({
    success_url: `${process.env.CLIENT_URL}/success?order_id=${newOrder._id}`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: { name: 'Food Order' },
          unit_amount: total * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });

  newOrder.transactionId = session.id;
  await newOrder.save();

  res.json({ success: true, data: { id: session.id, url: session.url, orderId: newOrder._id } });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { order_id } = req.body;
  const order = await Order.findById(order_id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const session = await stripe.checkout.sessions.retrieve(order.transactionId);
  if (session.payment_status === 'paid') {
    order.paymentStatus = 'paid';
    order.payment_confirmation = true;
    order.orderStatus = 'confirmed';
    await order.save();
    return res.json({ success: true, message: 'Payment successful', data: order });
  }
  order.paymentStatus = 'failed';
  await order.save();
  res.json({ success: false, message: 'Payment not completed' });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userid: req.user._id })
    .populate('restaurant', 'name coverImage')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

const getRestaurantOrders = asyncHandler(async (req, res) => {
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
    throw new Error('Not authorized');
  }
  const orders = await Order.find({ restaurant: req.params.id })
    .populate('userid', 'name email phone')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('restaurant');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (
    order.restaurant.owner.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized');
  }
  order.orderStatus = req.body.orderStatus;
  if (req.body.orderStatus === 'delivered') order.isDelivered = true;
  await order.save();
  res.json({ success: true, data: order });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('userid', 'name email')
    .populate('restaurant', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

module.exports = {
  createCheckoutSession,
  verifyPayment,
  getMyOrders,
  getRestaurantOrders,
  updateOrderStatus,
  getAllOrders,
};
