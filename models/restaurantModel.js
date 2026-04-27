const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cuisines: [{ type: String }],
    address: {
      street: String,
      city: String,
      pincode: String,
    },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    coverImage: { type: String, default: '' },
    openingHours: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '23:00' },
    },
    deliveryTime: { type: Number, default: 30 },
    minOrder: { type: Number, default: 100 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
