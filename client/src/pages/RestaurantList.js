import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchRestaurants } from '../redux/slices/restaurantSlice';
import StarRating from '../components/StarRating';

export default function RestaurantList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { restaurants, loading } = useSelector((state) => state.restaurant);

  const [veg, setVeg] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('');

  useEffect(() => {
    const params = {};
    if (searchParams.get('search')) params.search = searchParams.get('search');
    if (veg) params.veg = 'true';
    if (minRating > 0) params.minRating = minRating;
    if (sort) params.sort = sort;
    dispatch(fetchRestaurants(params));
  }, [dispatch, searchParams, veg, minRating, sort]);

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="card border-0 shadow-sm p-3">
            <h6 className="fw-bold mb-3">Filters</h6>
            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" checked={veg} onChange={(e) => setVeg(e.target.checked)} />
              <label className="form-check-label">Veg Only</label>
            </div>
            <label className="small fw-semibold mb-1">Min Rating: {minRating}+</label>
            <input type="range" className="form-range" min={0} max={5} step={0.5} value={minRating} onChange={(e) => setMinRating(e.target.value)} />
            <label className="small fw-semibold mt-2 mb-1">Sort By</label>
            <select className="form-select form-select-sm" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Relevance</option>
              <option value="rating">Rating</option>
              <option value="deliveryTime">Delivery Time</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="col-md-9">
          {searchParams.get('search') && (
            <h5 className="mb-3">Results for "<strong>{searchParams.get('search')}</strong>"</h5>
          )}
          {loading && <div className="text-center py-5"><div className="spinner-border text-danger" /></div>}
          <div className="row g-4">
            {restaurants.map((r) => (
              <div key={r._id} className="col-12 col-sm-6 col-xl-4" onClick={() => navigate(`/restaurants/${r._id}`)} style={{ cursor: 'pointer' }}>
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12, overflow: 'hidden' }}>
                  <img src={r.coverImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'} alt={r.name} style={{ height: 160, objectFit: 'cover' }} />
                  <div className="card-body">
                    <h6 className="fw-bold">{r.name}</h6>
                    <p className="text-muted small mb-1">{r.cuisines?.join(', ')}</p>
                    <div className="d-flex gap-2 align-items-center">
                      <StarRating rating={r.rating} />
                      <span className="small text-muted">{r.rating?.toFixed(1)} • {r.deliveryTime} min • Min ₹{r.minOrder}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!loading && restaurants.length === 0 && (
            <div className="text-center py-5 text-muted">No restaurants match your filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}
