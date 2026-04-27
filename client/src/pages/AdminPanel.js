import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, fetchAdminUsers, fetchPendingRestaurants, approveRestaurant } from '../redux/slices/orderSlice';

export default function AdminPanel() {
  const dispatch = useDispatch();
  const { allOrders, allUsers, pendingRestaurants } = useSelector((state) => state.order);
  const [tab, setTab] = useState('pending');

  useEffect(() => {
    dispatch(fetchPendingRestaurants());
    dispatch(fetchAdminUsers());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-1">Admin Panel</h4>
      <ul className="nav nav-tabs mb-4">
        {[['pending','Pending Restaurants'],['users','All Users'],['orders','All Orders']].map(([key,label]) => (
          <li key={key} className="nav-item">
            <button className={`nav-link ${tab === key ? 'active text-danger' : ''}`} onClick={() => setTab(key)}>
              {label}
              {key === 'pending' && pendingRestaurants.length > 0 && (
                <span className="badge bg-danger ms-1">{pendingRestaurants.length}</span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {tab === 'pending' && (
        <div>
          {pendingRestaurants.length === 0 && <p className="text-muted">No pending restaurants.</p>}
          {pendingRestaurants.map((r) => (
            <div key={r._id} className="card border-0 shadow-sm mb-3 p-3">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <strong>{r.name}</strong>
                  <p className="text-muted small mb-0">Owner: {r.owner?.name} ({r.owner?.email})</p>
                  <p className="text-muted small mb-0">Cuisines: {r.cuisines?.join(', ')}</p>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-success" onClick={() => dispatch(approveRestaurant({ id: r._id, isApproved: true }))}>
                    Approve
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => dispatch(approveRestaurant({ id: r._id, isApproved: false }))}>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Joined</th></tr></thead>
            <tbody>
              {allUsers.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'bg-danger' : u.role === 'owner' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{u.role}</span></td>
                  <td>{u.phone || '—'}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'orders' && (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead><tr><th>Customer</th><th>Restaurant</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {allOrders.map((o) => (
                <tr key={o._id}>
                  <td>{o.userid?.name || '—'}</td>
                  <td>{o.restaurant?.name || '—'}</td>
                  <td>₹{o.orderAmount}</td>
                  <td><span className={`badge ${o.paymentStatus === 'paid' ? 'bg-success' : o.paymentStatus === 'failed' ? 'bg-danger' : 'bg-warning text-dark'}`}>{o.paymentStatus}</span></td>
                  <td>{o.orderStatus?.replace(/_/g,' ')}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
