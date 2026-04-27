import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createCheckoutSession } from '../redux/slices/orderSlice';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, restaurantId, restaurantName } = useSelector((state) => state.cart);
  const { loading, error } = useSelector((state) => state.order);
  const [form, setForm] = useState({ name: '', phone: '', street: '', city: '', pincode: '' });

  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  const deliveryFee = 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!restaurantId) { alert('Cart is empty'); return; }
    const result = await dispatch(createCheckoutSession({
      cartItems: items,
      restaurantId,
      deliveryAddress: form,
    }));
    if (result.payload?.url) window.location.replace(result.payload.url);
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4">Checkout</h4>
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Delivery Address</h5>
            <form onSubmit={handleSubmit}>
              {[['name','Full Name'],['phone','Phone Number'],['street','Street Address'],['city','City'],['pincode','Pincode']].map(([field, label]) => (
                <div className="mb-3" key={field}>
                  <label className="form-label">{label}</label>
                  <input className="form-control" name={field} placeholder={label} value={form[field]} onChange={handleChange} required />
                </div>
              ))}
              {error && <div className="alert alert-danger">{error}</div>}
              <button className="btn btn-danger w-100" type="submit" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm" /> : `Pay ₹${total} with Stripe`}
              </button>
            </form>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Order Summary</h5>
            <p className="text-muted small">from <strong>{restaurantName}</strong></p>
            {items.map((item) => (
              <div key={`${item._id}-${item.varient}`} className="d-flex justify-content-between mb-2 small">
                <span>{item.name} [{item.varient}] x{item.quantity}</span>
                <span>₹{item.price}</span>
              </div>
            ))}
            <hr />
            <div className="d-flex justify-content-between small"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="d-flex justify-content-between small"><span>Delivery</span><span>₹{deliveryFee}</span></div>
            <div className="d-flex justify-content-between small"><span>GST (5%)</span><span>₹{tax}</span></div>
            <hr />
            <div className="d-flex justify-content-between fw-bold"><span>Total</span><span>₹{total}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
