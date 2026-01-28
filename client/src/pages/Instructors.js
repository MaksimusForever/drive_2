import React from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function Instructors() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Наши инструкторы</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-3xl shadow-xl overflow-hidden">
            <img src="https://www.shutterstock.com/image-photo/driving-instructor-teaching-his-student-260nw-781124311.jpg" alt="Инструктор 1" className="w-full h-64 object-cover" />
            <div className="p-6 bg-white">
              <h3 className="text-2xl font-bold mb-2">Алексей Иванов</h3>
              <p className="text-gray-600 mb-4">Стаж 12 лет • Toyota Camry</p>
              <div className="flex items-center mb-4">
                <span className="text-yellow-500 mr-2">★★★★★</span>
                <span className="font-bold">5.0</span>
              </div>
              <div className="flex gap-3">
                <span className="bg-blue-100 px-4 py-2 rounded-full text-blue-600 text-sm">Спокойный</span>
                <span className="bg-orange-100 px-4 py-2 rounded-full text-orange-600 text-sm">Профи</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl shadow-xl overflow-hidden">
            <img src="https://lirp.cdn-website.com/802219e3/dms3rep/multi/opt/gettyimages-1339051320-min-new-640w.jpg" alt="Инструктор 2" className="w-full h-64 object-cover" />
            <div className="p-6 bg-white">
              <h3 className="text-2xl font-bold mb-2">Анна Сидорова</h3>
              <p className="text-gray-600 mb-4">Стаж 10 лет • Volkswagen Polo</p>
              <div className="flex items-center mb-4">
                <span className="text-yellow-500 mr-2">★★★★★</span>
                <span className="font-bold">5.0</span>
              </div>
              <div className="flex gap-3">
                <span className="bg-blue-100 px-4 py-2 rounded-full text-blue-600 text-sm">Терпеливая</span>
                <span className="bg-orange-100 px-4 py-2 rounded-full text-orange-600 text-sm">Опытная</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}