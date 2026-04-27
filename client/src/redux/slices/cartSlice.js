import { createSlice } from '@reduxjs/toolkit';

const saved = localStorage.getItem('cart');
const initialCart = saved ? JSON.parse(saved) : { items: [], restaurantId: null, restaurantName: '' };

const persist = (state) => {
  localStorage.setItem('cart', JSON.stringify({
    items: state.items,
    restaurantId: state.restaurantId,
    restaurantName: state.restaurantName,
  }));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCart,
  reducers: {
    addToCart(state, action) {
      const { item, restaurantId, restaurantName } = action.payload;
      // Different restaurant — cart cleared by the page (after confirm dialog)
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
        state.restaurantId = restaurantId;
        state.restaurantName = restaurantName;
      } else if (!state.restaurantId) {
        state.restaurantId = restaurantId;
        state.restaurantName = restaurantName;
      }

      const existing = state.items.find(
        (i) => i._id === item._id && i.varient === item.varient
      );
      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, 10);
        existing.price = existing.prices[0][existing.varient] * existing.quantity;
      } else {
        state.items.push({ ...item, quantity: 1, price: item.prices[0][item.varient] });
      }
      persist(state);
    },
    removeFromCart(state, action) {
      const { _id, varient } = action.payload;
      state.items = state.items.filter((i) => !(i._id === _id && i.varient === varient));
      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = '';
      }
      persist(state);
    },
    updateQuantity(state, action) {
      const { _id, varient, quantity } = action.payload;
      if (quantity < 1) {
        state.items = state.items.filter((i) => !(i._id === _id && i.varient === varient));
        if (state.items.length === 0) {
          state.restaurantId = null;
          state.restaurantName = '';
        }
      } else {
        const item = state.items.find((i) => i._id === _id && i.varient === varient);
        if (item) {
          item.quantity = Math.min(quantity, 10);
          item.price = item.prices[0][item.varient] * item.quantity;
        }
      }
      persist(state);
    },
    clearCart(state) {
      state.items = [];
      state.restaurantId = null;
      state.restaurantName = '';
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
