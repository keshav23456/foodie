import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRestaurants } from '../redux/slices/restaurantSlice';
import StarRating from '../components/StarRating';

const CUISINES = ['Pizza', 'Burgers', 'Biryani', 'Chinese', 'Indian', 'Desserts', 'Fast Food'];

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurants, loading, error } = useSelector((state) => state.restaurant);
  const [search, setSearch] = useState('');
  const [activeCuisine, setActiveCuisine] = useState('');

  useEffect(() => {
    dispatch(fetchRestaurants({}));
  }, [dispatch]);

  const handleCuisineClick = (c) => {
    const next = activeCuisine === c ? '' : c;
    setActiveCuisine(next);
    dispatch(fetchRestaurants(next ? { cuisine: next } : {}));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/restaurants?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#e63946,#f4a261)', padding: '60px 20px', textAlign: 'center', color: '#fff' }}>
        <h1 className="fw-bold" style={{ fontSize: '2.5rem' }}>Hungry? We've got you covered.</h1>
        <p className="mb-4" style={{ fontSize: '1.1rem' }}>Order from the best restaurants near you</p>
        <form className="d-flex justify-content-center" onSubmit={handleSearch}>
          <input
            className="form-control"
            style={{ maxWidth: 480, borderRadius: '8px 0 0 8px' }}
            placeholder="Search restaurants or cuisines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn" style={{ background: '#fff', color: '#e63946', borderRadius: '0 8px 8px 0', fontWeight: 600 }} type="submit">
            Search
          </button>
        </form>
      </div>

      <div className="container py-4">
        {/* Cuisine chips */}
        <div className="d-flex gap-2 flex-wrap mb-4">
          {CUISINES.map((c) => (
            <button
              key={c}
              className={`btn btn-sm ${activeCuisine === c ? 'btn-danger' : 'btn-outline-danger'}`}
              style={{ borderRadius: 20 }}
              onClick={() => handleCuisineClick(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <h4 className="fw-bold mb-3">Top Restaurants</h4>

        {loading && <div className="text-center py-5"><div className="spinner-border text-danger" /></div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-4">
          {restaurants.map((r) => (
            <div key={r._id} className="col-12 col-sm-6 col-lg-4" onClick={() => navigate(`/restaurants/${r._id}`)} style={{ cursor: 'pointer' }}>
              <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: 12, overflow: 'hidden', transition: 'transform .2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img
                  src={r.coverImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'}
                  alt={r.name}
                  style={{ height: 180, objectFit: 'cover', width: '100%' }}
                />
                <div className="card-body">
                  <h5 className="fw-bold mb-1">{r.name}</h5>
                  <p className="text-muted small mb-2">{r.cuisines?.join(', ')}</p>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="badge" style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 8px' }}>
                      <StarRating rating={r.rating} /> {r.rating?.toFixed(1)}
                    </span>
                    <span className="text-muted small">• {r.deliveryTime} min</span>
                    <span className="text-muted small">• Min ₹{r.minOrder}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && restaurants.length === 0 && (
          <div className="text-center py-5 text-muted">No restaurants found.</div>
        )}
      </div>
    </div>
  );
}
