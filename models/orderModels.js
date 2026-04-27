const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema(
  {
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    orderItems: [],
    shippingAddress: { type: Object },
    deliveryAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      pincode: String,
    },
    orderAmount: { type: Number, required: true },
    transactionId: { type: String },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'],
      default: 'pending',
    },
    isDelivered: { type: Boolean, default: false },
    payment_confirmation: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', ordersSchema);
