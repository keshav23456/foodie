import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantById, fetchMenu } from '../redux/slices/restaurantSlice';
import { addToCart, clearCart } from '../redux/slices/cartSlice';
import StarRating from '../components/StarRating';

export default function RestaurantDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedRestaurant: restaurant, menu, loading } = useSelector((state) => state.restaurant);
  const { restaurantId: cartRestaurantId, restaurantName: cartRestaurantName, items: cartItems } = useSelector((state) => state.cart);
  const [varientMap, setVarientMap] = useState({});

  useEffect(() => {
    dispatch(fetchRestaurantById(id));
    dispatch(fetchMenu(id));
  }, [dispatch, id]);

  const getSelectedVarient = (item) => varientMap[item._id] || item.varients[0];

  const handleAddToCart = (item) => {
    const varient = getSelectedVarient(item);
    if (cartRestaurantId && cartRestaurantId !== id && cartItems.length > 0) {
      if (!window.confirm(`Your cart has items from "${cartRestaurantName}". Clear cart and add from ${restaurant?.name}?`)) return;
      dispatch(clearCart());
    }
    dispatch(addToCart({ item: { ...item, varient }, restaurantId: id, restaurantName: restaurant?.name }));
  };

  const categories = [...new Set(menu.map((m) => m.category))];

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>;
  if (!restaurant) return null;

  return (
    <div>
      {/* Cover */}
      <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
        <img src={restaurant.coverImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'flex-end', padding: 24 }}>
          <div style={{ color: '#fff' }}>
            <h2 className="fw-bold mb-1">{restaurant.name}</h2>
            <p className="mb-1 small">{restaurant.cuisines?.join(' • ')}</p>
            <div className="d-flex gap-3 align-items-center">
              <span><StarRating rating={restaurant.rating} /> {restaurant.rating?.toFixed(1)} ({restaurant.totalReviews} reviews)</span>
              <span>• {restaurant.deliveryTime} min</span>
              <span>• Min ₹{restaurant.minOrder}</span>
              <span>• {restaurant.openingHours?.open} – {restaurant.openingHours?.close}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {categories.map((cat) => (
          <div key={cat} className="mb-4">
            <h5 className="fw-bold text-capitalize border-bottom pb-2 mb-3">{cat}</h5>
            <div className="row g-3">
              {menu.filter((m) => m.category === cat).map((item) => {
                const varient = getSelectedVarient(item);
                const price = item.prices[0]?.[varient] ?? 0;
                return (
                  <div key={item._id} className="col-12 col-md-6">
                    <div className="card border-0 shadow-sm p-3 d-flex flex-row gap-3 align-items-center">
                      <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'} alt={item.name} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 8 }} />
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span style={{ display: 'inline-block', width: 14, height: 14, border: `2px solid ${item.isVeg ? 'green' : 'red'}`, borderRadius: 2, position: 'relative' }}>
                            <span style={{ position: 'absolute', inset: 2, borderRadius: '50%', background: item.isVeg ? 'green' : 'red' }} />
                          </span>
                          <strong style={{ fontSize: '0.95rem' }}>{item.name}</strong>
                        </div>
                        <p className="text-muted small mb-2" style={{ lineHeight: 1.3 }}>{item.description}</p>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          {item.varients.length > 1 && (
                            <select className="form-select form-select-sm" style={{ width: 'auto' }}
                              value={varientMap[item._id] || item.varients[0]}
                              onChange={(e) => setVarientMap((prev) => ({ ...prev, [item._id]: e.target.value }))}>
                              {item.varients.map((v) => <option key={v} value={v}>{v} — ₹{item.prices[0]?.[v]}</option>)}
                            </select>
                          )}
                          <strong>₹{price}</strong>
                          <button className="btn btn-sm btn-danger ms-auto" onClick={() => handleAddToCart(item)}>+ Add</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
