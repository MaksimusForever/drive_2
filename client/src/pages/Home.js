import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero */}
      <div
        className="relative h-[500px] bg-cover bg-center flex flex-col justify-center items-center text-center text-white"
        style={{ backgroundImage: 'ur[](https://images.pexels.com/photos/29136672/pexels-photo-29136672/free-photo-of-luxurious-car-interior-with-digital-dashboard.jpeg)' }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 px-4">
          <h1 className="text-6xl font-bold mb-4">Водите уверенно</h1>
          <p className="text-2xl mb-8">Получите права за 3 месяца. Безопасно. Профессионально. Современно.</p>
          <Link to="/about" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition">
            Начать обучение
          </Link>
        </div>
      </div>

      {/* Статистика */}
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-5xl font-bold text-blue-600">5000+</h3>
            <p className="text-gray-600 text-lg">Выпускников</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold text-blue-600">15 лет</h3>
            <p className="text-gray-600 text-lg">Опыта</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold text-blue-600">98%</h3>
            <p className="text-gray-600 text-lg">Сдают с первого раза</p>
          </div>
        </div>
      </div>

      {/* Блок новостей */}
      <div className="container mx-auto px-4 pb-24">
        <h2 className="text-4xl font-bold text-center mb-12">Новости и обновления</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Новость 1</h3>
            <p className="text-gray-600">Описание новости 1.</p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h3 className="text-2xl font-bold mb-4">Новость 2</h3>
            <p className="text-gray-600">Описание новости 2.</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}