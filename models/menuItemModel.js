const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    varients: { type: [String], default: ['regular'] },
    prices: [{}],
    category: { type: String, required: true },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    isVeg: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
