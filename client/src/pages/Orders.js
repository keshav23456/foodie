import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../redux/slices/orderSlice';
import OrderTracker from '../components/OrderTracker';

const STATUS_COLORS = {
  pending: 'secondary', confirmed: 'primary', preparing: 'warning',
  out_for_delivery: 'info', delivered: 'success',
};

export default function Orders() {
  const dispatch = useDispatch();
  const { myOrders, loading } = useSelector((state) => state.order);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>;

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4">My Orders</h4>
      {myOrders.length === 0 && <div className="text-center text-muted py-5">No orders yet.</div>}
      {myOrders.map((order) => (
        <div key={order._id} className="card border-0 shadow-sm mb-4 p-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
            <div>
              <h6 className="fw-bold mb-0">{order.restaurant?.name || 'Restaurant'}</h6>
              <small className="text-muted">{new Date(order.createdAt).toLocaleString()}</small>
            </div>
            <div className="text-end">
              <span className={`badge bg-${STATUS_COLORS[order.orderStatus] || 'secondary'} me-2`}>
                {order.orderStatus?.replace(/_/g, ' ')}
              </span>
              <strong>₹{order.orderAmount}</strong>
            </div>
          </div>
          <OrderTracker status={order.orderStatus} />
          <div className="mt-2">
            {order.orderItems?.map((item, i) => (
              <span key={i} className="badge bg-light text-dark me-1 mb-1 fw-normal">
                {item.name} [{item.varient}] x{item.quantity}
              </span>
            ))}
          </div>
          {order.transactionId && (
            <p className="text-muted small mt-2 mb-0">Transaction: {order.transactionId}</p>
          )}
        </div>
      ))}
    </div>
  );
}
