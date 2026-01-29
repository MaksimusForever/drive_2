import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-var(--surface) py-8 mt-auto">
      <div className="container text-center">
        <p>&copy; 2025 Автошкола Драйв. Все права защищены.</p>
        <p className="text-var(--text-secondary)">Тел: +7 (495) 123-45-67 | Email: info@drive.ru</p>
      </div>
    </footer>
  );
}