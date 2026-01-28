import React from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function Courses() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Наши курсы</h1>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium">Все</button>
          <button className="bg-gray-200 px-6 py-2 rounded-full font-medium">Категория B</button>
          <button className="bg-gray-200 px-6 py-2 rounded-full font-medium">Мотоциклы (A)</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative rounded-3xl overflow-hidden shadow-xl">
            <div className="absolute top-4 right-4 flex items-center gap-1">
              <span className="material-symbols-outlined text-yellow-500 text-xl">star</span>
              4.9
            </div>
            <img src="https://images.pexels.com/photos/3952053/pexels-photo-3952053.jpeg" alt="Категория B" className="w-full h-64 object-cover" />
            <div className="p-6 bg-white">
              <h3 className="text-2xl font-bold mb-4">Категория B: Базовый</h3>
              <p className="text-gray-600 mb-6">2.5 месяца</p>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-blue-600">29 900 ₽</div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition">Подробнее</button>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl">
            <div className="absolute top-4 right-4 flex items-center gap-1">
              <span className="material-symbols-outlined text-yellow-500 text-xl">star</span>
              5.0
            </div>
            <img src="https://images.pexels.com/photos/1411772/pexels-photo-1411772.jpeg" alt="Категория C" className="w-full h-64 object-cover" />
            <div className="p-6 bg-white">
              <h3 className="text-2xl font-bold mb-4">Катegoрия C: Профессиональный</h3>
              <p className="text-gray-600 mb-6">4 месяца</p>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-blue-600">48 000 ₽</div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition">Подробнее</button>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl">
            <div className="absolute top-4 right-4 flex items-center gap-1">
              <span className="material-symbols-outlined text-yellow-500 text-xl">star</span>
              4.8
            </div>
            <img src="https://images.pexels.com/photos/1411772/pexels-photo-1411772.jpeg" alt="Категория A" className="w-full h-64 object-cover" />
            <div className="p-6 bg-white">
              <h3 className="text-2xl font-bold mb-4">Категория A: Экспресс</h3>
              <p className="text-gray-600 mb-6">1.5 месяца</p>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-blue-600">19 500 ₽</div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition">Подробнее</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}