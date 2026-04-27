import React from 'react';

const STEPS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
const LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

export default function OrderTracker({ status }) {
  const currentIdx = STEPS.indexOf(status);
  return (
    <div className="d-flex align-items-center justify-content-between my-3 flex-wrap gap-2">
      {STEPS.map((step, idx) => (
        <React.Fragment key={step}>
          <div className="text-center" style={{ minWidth: 80 }}>
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center"
              style={{
                width: 36,
                height: 36,
                background: idx <= currentIdx ? '#e63946' : '#e9ecef',
                color: idx <= currentIdx ? '#fff' : '#999',
                fontWeight: 'bold',
                fontSize: 14,
              }}
            >
              {idx <= currentIdx ? '✓' : idx + 1}
            </div>
            <div style={{ fontSize: 11, marginTop: 4, color: idx <= currentIdx ? '#e63946' : '#999' }}>
              {LABELS[step]}
            </div>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 3,
                background: idx < currentIdx ? '#e63946' : '#e9ecef',
                minWidth: 20,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
