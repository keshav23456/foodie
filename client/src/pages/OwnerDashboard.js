import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMyRestaurant, fetchMenuByRestaurant, addMenuItem,
  toggleItemAvailability, deleteMenuItem, updateRestaurant,
} from '../redux/slices/restaurantSlice';
import { fetchRestaurantOrders, updateOrderStatus } from '../redux/slices/orderSlice';

const STATUS_OPTIONS = ['pending','confirmed','preparing','out_for_delivery','delivered'];
const BLANK_ITEM = { name: '', category: '', description: '', image: '', isVeg: false, varients: 'regular', prices: '' };

export default function OwnerDashboard() {
  const dispatch = useDispatch();
  const { myRestaurant, myMenu } = useSelector((state) => state.restaurant);
  const { restaurantOrders } = useSelector((state) => state.order);
  const [tab, setTab] = useState('orders');
  const [newItem, setNewItem] = useState(BLANK_ITEM);
  const [restForm, setRestForm] = useState({});

  useEffect(() => {
    dispatch(fetchMyRestaurant()).then((res) => {
      if (res.payload) {
        dispatch(fetchMenuByRestaurant(res.payload._id));
        dispatch(fetchRestaurantOrders(res.payload._id));
        setRestForm(res.payload);
      }
    });
  }, [dispatch]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    const varients = newItem.varients.split(',').map((v) => v.trim());
    const priceEntries = newItem.prices.split(',').map((p) => p.trim());
    const pricesObj = {};
    varients.forEach((v, i) => { pricesObj[v] = Number(priceEntries[i]) || 0; });
    await dispatch(addMenuItem({ ...newItem, varients, prices: [pricesObj] }));
    setNewItem(BLANK_ITEM);
  };

  const handleRestSave = async (e) => {
    e.preventDefault();
    dispatch(updateRestaurant({ id: myRestaurant._id, updates: restForm }));
  };

  if (!myRestaurant) return (
    <div className="container py-5 text-center">
      <h5>You don't have a restaurant yet.</h5>
      <p className="text-muted">Contact admin to set one up or create via API.</p>
    </div>
  );

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-1">{myRestaurant.name}</h4>
      <p className="text-muted mb-3">{myRestaurant.isApproved ? '✅ Approved' : '⏳ Pending approval'}</p>

      <ul className="nav nav-tabs mb-4">
        {[['orders','Incoming Orders'],['menu','My Menu'],['settings','Settings']].map(([key,label]) => (
          <li key={key} className="nav-item">
            <button className={`nav-link ${tab === key ? 'active text-danger' : ''}`} onClick={() => setTab(key)}>{label}</button>
          </li>
        ))}
      </ul>

      {tab === 'orders' && (
        <div>
          {restaurantOrders.length === 0 && <p className="text-muted">No orders yet.</p>}
          {restaurantOrders.map((order) => (
            <div key={order._id} className="card border-0 shadow-sm mb-3 p-3">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <strong>{order.userid?.name || 'Customer'}</strong> — ₹{order.orderAmount}
                  <br /><small className="text-muted">{new Date(order.createdAt).toLocaleString()}</small>
                  <div className="mt-1">
                    {order.orderItems?.map((i, idx) => (
                      <span key={idx} className="badge bg-light text-dark me-1">{i.name} x{i.quantity}</span>
                    ))}
                  </div>
                </div>
                <select className="form-select form-select-sm" style={{ width: 180 }}
                  value={order.orderStatus}
                  onChange={(e) => dispatch(updateOrderStatus({ orderId: order._id, orderStatus: e.target.value }))}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'menu' && (
        <div>
          <div className="row g-3 mb-4">
            {myMenu.map((item) => (
              <div key={item._id} className="col-12 col-md-6">
                <div className="card border-0 shadow-sm p-3 d-flex flex-row gap-3 align-items-center">
                  <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'} alt={item.name} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8 }} />
                  <div className="flex-grow-1">
                    <strong>{item.name}</strong>
                    <p className="small text-muted mb-1">{item.category}</p>
                    <div className="d-flex gap-2">
                      <button className={`btn btn-sm ${item.isAvailable ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => dispatch(toggleItemAvailability(item._id))}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </button>
                      <button className="btn btn-sm btn-outline-danger"
                        onClick={() => window.confirm('Delete this item?') && dispatch(deleteMenuItem(item._id))}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card border-0 shadow-sm p-4">
            <h6 className="fw-bold mb-3">Add New Item</h6>
            <form onSubmit={handleAddItem}>
              <div className="row g-2">
                {[['name','Name'],['category','Category'],['description','Description'],['image','Image URL']].map(([f,l]) => (
                  <div key={f} className="col-12 col-md-6">
                    <input className="form-control form-control-sm" placeholder={l} value={newItem[f]}
                      onChange={(e) => setNewItem({ ...newItem, [f]: e.target.value })} required={f !== 'image'} />
                  </div>
                ))}
                <div className="col-12 col-md-6">
                  <input className="form-control form-control-sm" placeholder="Variants (comma-separated: small,medium,large)" value={newItem.varients}
                    onChange={(e) => setNewItem({ ...newItem, varients: e.target.value })} />
                </div>
                <div className="col-12 col-md-6">
                  <input className="form-control form-control-sm" placeholder="Prices (comma-separated matching variants: 150,250,350)" value={newItem.prices}
                    onChange={(e) => setNewItem({ ...newItem, prices: e.target.value })} />
                </div>
                <div className="col-12">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={newItem.isVeg}
                      onChange={(e) => setNewItem({ ...newItem, isVeg: e.target.checked })} />
                    <label className="form-check-label">Vegetarian</label>
                  </div>
                </div>
              </div>
              <button className="btn btn-danger btn-sm mt-3" type="submit">Add Item</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="card border-0 shadow-sm p-4" style={{ maxWidth: 600 }}>
          <h6 className="fw-bold mb-3">Restaurant Settings</h6>
          <form onSubmit={handleRestSave}>
            {[['name','Restaurant Name'],['coverImage','Cover Image URL'],['deliveryTime','Delivery Time (mins)'],['minOrder','Minimum Order (₹)']].map(([f,l]) => (
              <div className="mb-3" key={f}>
                <label className="form-label small">{l}</label>
                <input className="form-control" value={restForm[f] || ''} onChange={(e) => setRestForm({ ...restForm, [f]: e.target.value })} />
              </div>
            ))}
            <div className="mb-3">
              <label className="form-label small">Cuisines (comma-separated)</label>
              <input className="form-control" value={(restForm.cuisines || []).join(', ')}
                onChange={(e) => setRestForm({ ...restForm, cuisines: e.target.value.split(',').map((c) => c.trim()) })} />
            </div>
            <button className="btn btn-danger" type="submit">Save Settings</button>
          </form>
        </div>
      )}
    </div>
  );
}
