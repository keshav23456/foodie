import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyPayment } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';
import OrderTracker from '../components/OrderTracker';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { paymentResult, loading } = useSelector((state) => state.order);
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (orderId) {
      dispatch(verifyPayment(orderId)).then((res) => {
        if (res.payload?.success) dispatch(clearCart());
      });
    }
  }, [orderId, dispatch]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>;

  if (!paymentResult) return null;

  if (!paymentResult.success) {
    return (
      <div className="text-center py-5">
        <div style={{ fontSize: 60 }}>❌</div>
        <h3 className="mt-3">Payment Failed</h3>
        <p className="text-muted">Something went wrong. Please try again.</p>
        <button className="btn btn-danger" onClick={() => navigate('/cart')}>Back to Cart</button>
      </div>
    );
  }

  const order = paymentResult.data;
  return (
    <div className="container py-5" style={{ maxWidth: 600 }}>
      <div className="text-center mb-4">
        <div style={{ fontSize: 60 }}>✅</div>
        <h3 className="fw-bold mt-2">Order Confirmed!</h3>
        <p className="text-muted">Your order has been placed successfully.</p>
      </div>
      <div className="card border-0 shadow-sm p-4 mb-3">
        <h6 className="fw-bold mb-3">Order Status</h6>
        <OrderTracker status={order?.orderStatus || 'confirmed'} />
      </div>
      {order && (
        <div className="card border-0 shadow-sm p-4">
          <h6 className="fw-bold mb-3">Order Details</h6>
          {order.orderItems?.map((item, i) => (
            <div key={i} className="d-flex justify-content-between small mb-1">
              <span>{item.name} [{item.varient}] x{item.quantity}</span>
              <span>₹{item.price}</span>
            </div>
          ))}
          <hr />
          <div className="d-flex justify-content-between fw-bold">
            <span>Total Paid</span><span>₹{order.orderAmount}</span>
          </div>
        </div>
      )}
      <div className="text-center mt-4">
        <button className="btn btn-outline-danger me-2" onClick={() => navigate('/orders')}>My Orders</button>
        <button className="btn btn-danger" onClick={() => navigate('/')}>Order More</button>
      </div>
    </div>
  );
}
