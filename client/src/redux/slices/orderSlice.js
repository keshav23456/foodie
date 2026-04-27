import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';

export const createCheckoutSession = createAsyncThunk('order/checkout', async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/orders/checkout_session', orderData);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Checkout failed');
  }
});

export const verifyPayment = createAsyncThunk('order/verify', async (orderId, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/orders/verify-payment', { order_id: orderId });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Verification failed');
  }
});

export const fetchMyOrders = createAsyncThunk('order/myOrders', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/orders/my');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchRestaurantOrders = createAsyncThunk('order/restaurantOrders', async (restaurantId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/api/orders/restaurant/${restaurantId}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
  }
});

export const updateOrderStatus = createAsyncThunk('order/updateStatus', async ({ orderId, orderStatus }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/api/orders/${orderId}/status`, { orderStatus });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update status');
  }
});

export const fetchAllOrders = createAsyncThunk('order/allOrders', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/orders/all');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch all orders');
  }
});

export const fetchAdminUsers = createAsyncThunk('order/adminUsers', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/admin/users');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const fetchPendingRestaurants = createAsyncThunk('order/pendingRestaurants', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/admin/restaurants/pending');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const approveRestaurant = createAsyncThunk('order/approveRestaurant', async ({ id, isApproved }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/api/admin/restaurants/${id}/approve`, { isApproved });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    myOrders: [],
    restaurantOrders: [],
    allOrders: [],
    allUsers: [],
    pendingRestaurants: [],
    paymentResult: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(createCheckoutSession.pending, pending)
      .addCase(createCheckoutSession.fulfilled, (state) => { state.loading = false; })
      .addCase(createCheckoutSession.rejected, rejected)

      .addCase(verifyPayment.pending, pending)
      .addCase(verifyPayment.fulfilled, (state, action) => { state.loading = false; state.paymentResult = action.payload; })
      .addCase(verifyPayment.rejected, rejected)

      .addCase(fetchMyOrders.pending, pending)
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.myOrders = action.payload; })
      .addCase(fetchMyOrders.rejected, rejected)

      .addCase(fetchRestaurantOrders.pending, pending)
      .addCase(fetchRestaurantOrders.fulfilled, (state, action) => { state.loading = false; state.restaurantOrders = action.payload; })
      .addCase(fetchRestaurantOrders.rejected, rejected)

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.restaurantOrders.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) state.restaurantOrders[idx] = action.payload;
      })

      .addCase(fetchAllOrders.fulfilled, (state, action) => { state.allOrders = action.payload; })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => { state.allUsers = action.payload; })
      .addCase(fetchPendingRestaurants.fulfilled, (state, action) => { state.pendingRestaurants = action.payload; })
      .addCase(approveRestaurant.fulfilled, (state, action) => {
        state.pendingRestaurants = state.pendingRestaurants.filter((r) => r._id !== action.payload._id);
      });
  },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
