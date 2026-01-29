import React from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ paths }) {
  return (
    <nav className="breadcrumbs">
      {paths.map((path, index) => (
        <span key={index}>
          {index > 0 && ' / '}
          {path.link ? <Link to={path.link}>{path.name}</Link> : path.name}
        </span>
      ))}
    </nav>
  );
}