import React from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function About() {
  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">О нас</h1>

        {/* Яндекс.Карта */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-xl" style={{ height: '500px' }}>
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A1bb562780a64ca57bcb0eea57030af9b1b88b4ea062a101c9432255e8ca1748d&amp;source=constructorhttps://yandex.ru/map-widget/v1/?um=constructor%3A1bb562780a64ca57bcb0eea57030af9b1b88b4ea062a101c9432255e8ca1748d&amp;source=constructorhttps://yandex.ru/map-widget/v1/?um=constructor%3A1bb562780a64ca57bcb0eea57030af9b1b88b4ea062a101c9432255e8ca1748d&amp;source=constructor"
            width="100%"
            height="100%"
            frameBorder="0"
            title="Карта филиалов автошколы Драйв"
          ></iframe>
        </div>

        <div className="flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Наш филиал</h3>
            <p className="text-gray-600">Луганск, ул. Советская 77, ТЦ. ГУМ, 2 этаж, к.133</p>
            <p className="mt-4">Тел: +7 (959) 271-62-26</p>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-xl text-gray-700">
            Email: info@drive.ru<br />
            Работаем ежедневно с 9:00 до 21:00
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}