import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Book, User, Info } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 z-50">
      <div className="flex justify-around items-center">
        <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-600'}`}>
          <Home size={24} />
          <span className="text-xs">Главная</span>
        </Link>
        <Link to="/courses" className={`flex flex-col items-center gap-1 ${location.pathname.startsWith('/courses') ? 'text-blue-600' : 'text-gray-600'}`}>
          <Book size={24} />
          <span className="text-xs">Курсы</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center gap-1 ${location.pathname === '/profile' ? 'text-blue-600' : 'text-gray-600'}`}>
          <User size={24} />
          <span className="text-xs">Профиль</span>
        </Link>
        <Link to="/about" className={`flex flex-col items-center gap-1 ${location.pathname === '/about' ? 'text-blue-600' : 'text-gray-600'}`}>
          <Info size={24} />
          <span className="text-xs">О нас</span>
        </Link>
      </div>
    </nav>
  );
}