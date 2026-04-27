import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';

export const fetchRestaurants = createAsyncThunk('restaurant/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/restaurants', { params });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch restaurants');
  }
});

export const fetchRestaurantById = createAsyncThunk('restaurant/fetchById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/api/restaurants/${id}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch restaurant');
  }
});

export const fetchMenu = createAsyncThunk('restaurant/fetchMenu', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/api/restaurants/${id}/menu`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch menu');
  }
});

export const fetchMyRestaurant = createAsyncThunk('restaurant/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/restaurants/mine');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch your restaurant');
  }
});

export const updateRestaurant = createAsyncThunk('restaurant/update', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/api/restaurants/${id}`, updates);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

export const fetchMenuByRestaurant = createAsyncThunk('restaurant/fetchMenuOwner', async (restaurantId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/api/menu/restaurant/${restaurantId}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch menu');
  }
});

export const addMenuItem = createAsyncThunk('restaurant/addItem', async (itemData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/menu', itemData);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add item');
  }
});

export const toggleItemAvailability = createAsyncThunk('restaurant/toggleItem', async (itemId, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/api/menu/${itemId}/toggle`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to toggle item');
  }
});

export const deleteMenuItem = createAsyncThunk('restaurant/deleteItem', async (itemId, { rejectWithValue }) => {
  try {
    await api.delete(`/api/menu/${itemId}`);
    return itemId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete item');
  }
});

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState: {
    restaurants: [],
    selectedRestaurant: null,
    menu: [],
    myRestaurant: null,
    myMenu: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearRestaurantError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRestaurants.fulfilled, (state, action) => { state.loading = false; state.restaurants = action.payload; })
      .addCase(fetchRestaurants.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchRestaurantById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => { state.loading = false; state.selectedRestaurant = action.payload; })
      .addCase(fetchRestaurantById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchMenu.pending, (state) => { state.loading = true; })
      .addCase(fetchMenu.fulfilled, (state, action) => { state.loading = false; state.menu = action.payload; })
      .addCase(fetchMenu.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchMyRestaurant.fulfilled, (state, action) => { state.myRestaurant = action.payload; })

      .addCase(updateRestaurant.fulfilled, (state, action) => { state.myRestaurant = action.payload; })

      .addCase(fetchMenuByRestaurant.fulfilled, (state, action) => { state.myMenu = action.payload; })

      .addCase(addMenuItem.fulfilled, (state, action) => { state.myMenu.push(action.payload); })

      .addCase(toggleItemAvailability.fulfilled, (state, action) => {
        const idx = state.myMenu.findIndex((i) => i._id === action.payload._id);
        if (idx !== -1) state.myMenu[idx] = action.payload;
      })

      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.myMenu = state.myMenu.filter((i) => i._id !== action.payload);
      });
  },
});

export const { clearRestaurantError } = restaurantSlice.actions;
export default restaurantSlice.reducer;
