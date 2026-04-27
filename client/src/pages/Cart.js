import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateQuantity, removeFromCart } from '../redux/slices/cartSlice';
import useAuth from '../hooks/useAuth';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, restaurantName } = useSelector((state) => state.cart);

  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  const deliveryFee = items.length > 0 ? 40 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <div style={{ fontSize: 60 }}>🛒</div>
        <h4 className="mt-3">Your cart is empty</h4>
        <button className="btn btn-danger mt-2" onClick={() => navigate('/')}>Browse Restaurants</button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-1">Your Cart</h4>
      {restaurantName && <p className="text-muted mb-4">from <strong>{restaurantName}</strong></p>}
      <div className="row g-4">
        <div className="col-lg-8">
          {items.map((item) => (
            <div key={`${item._id}-${item.varient}`} className="card border-0 shadow-sm mb-3 p-3">
              <div className="d-flex align-items-center gap-3">
                <img src={item.image} alt={item.name} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8 }} />
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0">{item.name} <span className="text-muted fw-normal small">[{item.varient}]</span></h6>
                  <p className="text-muted small mb-1">₹{item.prices[0]?.[item.varient]} each</p>
                  <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-sm btn-outline-secondary" style={{ width: 30, padding: 0 }}
                      onClick={() => dispatch(updateQuantity({ _id: item._id, varient: item.varient, quantity: item.quantity - 1 }))}>−</button>
                    <span className="fw-bold">{item.quantity}</span>
                    <button className="btn btn-sm btn-outline-secondary" style={{ width: 30, padding: 0 }}
                      onClick={() => dispatch(updateQuantity({ _id: item._id, varient: item.varient, quantity: item.quantity + 1 }))}>+</button>
                  </div>
                </div>
                <div className="text-end">
                  <strong>₹{item.price}</strong>
                  <br />
                  <button className="btn btn-sm text-danger p-0 mt-1"
                    onClick={() => dispatch(removeFromCart({ _id: item._id, varient: item.varient }))}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Bill Summary</h5>
            <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="d-flex justify-content-between mb-2"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
            <div className="d-flex justify-content-between mb-2"><span>GST (5%)</span><span>₹{tax}</span></div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5"><span>Total</span><span>₹{total}</span></div>
            <button
              className="btn btn-danger w-100 mt-3"
              onClick={() => isAuthenticated ? navigate('/checkout') : navigate('/login')}
            >
              {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
