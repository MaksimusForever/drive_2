import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { Link, useLocation } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/profile/${user.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => {
          setProfileData(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="text-center py-20">Загрузка...</div>;
  if (!profileData) return <div className="text-center py-20 text-red-600">Ошибка загрузки</div>;

  const { fullName, phone, email, theoryProgress, practiceProgress, instructor = {} } = profileData;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Левая колонка */}
          <div className="md:sticky md:top-20 md:h-fit">
            <div className="bg-white rounded-2xl p-6 shadow-md mb-8 text-center">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5yoYi3FmecvDnKR0YvNq5jOaVeZFg6EQUEecaizKtYS1bcY7YMMMjx6gghVEsevskwCCDvjU6Y1hSofPVZ3ejEXJR4SyQW4WBV8LYwEym45AV1bagBOdBAwCK_pcibxktjbu53OuKbIhF8Sb7NknDZj1pVGZD8msyuzjtOsexukbFifemQUN6fpZlmdlKzJnoKAMuLioatpeQRL6nCr91AiSpK7PwFmuKR8_8ZxZX1kLAHlQJe4eJ1tG2SVUg9YLjLfLIrF99HD8" alt="Фото" className="w-32 h-32 rounded-full mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">{fullName || 'Имя не указано'}</h2>
              <p className="text-gray-600">Студент категории B</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4">Личные данные</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Имя</p>
                  <p className="font-medium">Александр Иванов</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Телефон</p>
                  <p className="font-medium">+7 (999) 123-45-67</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">alex.ivanov@example.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4">Общий прогресс курса</h3>
              <div className="flex gap-8 mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray={`${theoryProgress} 100`} />
                  </svg>
                  <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-blue-600">{theoryProgress}%</p>
                </div>
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray={`${practiceProgress} 100`} />
                  </svg>
                  <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-blue-600">{practiceProgress}%</p>
                </div>
              </div>
              <p className="text-center text-gray-600 text-sm">Осталось 4 практических занятия до экзамена</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4">Следующее занятие</h3>
              <p className="text-2xl font-bold mb-2">ЗАВТРА, 14:00</p>
              <p className="text-gray-600 mb-4">Вождение в городе</p>
              <div className="flex items-center gap-4">
                <img src="https://www.shutterstock.com/image-photo/driving-instructor-teaching-his-student-260nw-781124311.jpg" alt="Инструктор" className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-bold">Инструктор: Дмитрий Петров</p>
                  <p className="text-gray-600 text-sm">Стаж 15 лет</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/booking" className="bg-blue-100 rounded-2xl p-6 text-center hover:bg-blue-200 transition">
                <span className="material-symbols-outlined text-blue-600 text-4xl mb-2 block">book</span>
                <p className="text-sm font-medium">История обучения</p>
              </Link>
              <Link to="/payments" className="bg-green-100 rounded-2xl p-6 text-center hover:bg-green-200 transition">
                <span className="material-symbols-outlined text-green-600 text-4xl mb-2 block">payments</span>
                <p className="text-sm font-medium">Платежи</p>
              </Link>
            </div>

            <button onClick={logout} className="w-full bg-red-600 text-white py-4 rounded-full font-bold text-lg hover:bg-red-700 transition">
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}