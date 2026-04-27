import React from 'react';

export default function StarRating({ rating, max = 5, interactive = false, onChange }) {
  return (
    <span>
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <span
          key={star}
          style={{
            color: star <= Math.round(rating) ? '#f4c430' : '#ccc',
            cursor: interactive ? 'pointer' : 'default',
            fontSize: '1.1rem',
          }}
          onClick={() => interactive && onChange && onChange(star)}
        >
          ★
        </span>
      ))}
    </span>
  );
}
