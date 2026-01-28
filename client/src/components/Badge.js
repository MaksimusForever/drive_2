import React from 'react';

export default function Badge({ children, type = 'popular' }) {
  return (
    <span className={`badge badge-${type}`}>
      {children}
    </span>
  );
}