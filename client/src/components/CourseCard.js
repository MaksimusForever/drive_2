import React from 'react';

export default function CourseCard({ title, description, price, image }) {
  return (
    <div className="card">
      <img src={image} alt={title} className="w-full h-48 object-cover rounded-t-16px" />
      <h3>{title}</h3>
      <p>{description}</p>
      <p className="font-bold">{price} руб.</p>
      <span className="badge">Категория B</span>
      <button className="btn btn-primary mt-4">Записаться</button>
    </div>
  );
}