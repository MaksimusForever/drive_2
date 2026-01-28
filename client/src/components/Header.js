import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Car } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Логотип */}
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-blue-600">
          <Car size={32} />
          Драйв
        </Link>

        {/* Десктоп меню */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-blue-600 transition">Главная</Link>
          <Link to="/courses" className="hover:text-blue-600 transition">Курсы</Link>
          <Link to="/instructors" className="hover:text-blue-600 transition">Инструкторы</Link>
          <Link to="/about" className="hover:text-blue-600 transition">О нас</Link>
          <Link to="/profile" className="hover:text-blue-600 transition">Профиль</Link>

          {/* Кнопка "Записаться" только для неавторизованных */}
          {!user && (
            <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition">
              Записаться
            </button>
          )}

          {/* Две кнопки для staff */}
          {user?.status === 'staff' && (
            <>
              <Link
                to="/staff-register"
                className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
              >
                Регистрация учеников
              </Link>
              <Link
                to="/editor-student"
                className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition"
              >
                Редактировать ученика
              </Link>
            </>
          )}
        </nav>

        {/* Мобильный гамбургер */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Мобильное выпадающее меню */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-t py-6">
          <div className="container mx-auto px-4 flex flex-col gap-4">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Главная</Link>
            <Link to="/courses" onClick={() => setMobileMenuOpen(false)}>Курсы</Link>
            <Link to="/instructors" onClick={() => setMobileMenuOpen(false)}>Инструкторы</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>О нас</Link>
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Профиль</Link>

            {!user && (
              <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold">
                Записаться
              </button>
            )}

            {/* Две кнопки для staff в мобильном меню */}
            {user?.status === 'staff' && (
              <>
                <Link
                  to="/staff-register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold text-center"
                >
                  Регистрация учеников
                </Link>
                <Link
                  to="/editor-student"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold text-center"
                >
                  Редактировать ученика
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}