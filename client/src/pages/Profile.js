import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      setError('Не авторизован');
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Токен отсутствует');

        const res = await fetch(`/api/profile/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || `Ошибка ${res.status}`);
        }

        const data = await res.json();
        setProfileData(data);
      } catch (err) {
        console.error('Ошибка профиля:', err);
        setError(err.message || 'Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  if (loading) {
    return <div className="text-center py-20 text-xl">Загрузка профиля...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 text-xl">
        {error}
        <p className="mt-4 text-base">Попробуйте перезайти в аккаунт</p>
            <button
              onClick={logout}
              className="w-3/4 bg-red-600 text-white py-4 rounded-full font-bold text-lg hover:bg-red-700 transition"
            >
              Выйти из аккаунта
            </button>
      </div>
    );
  }

  if (!profileData) {
    return <div className="text-center py-20 text-red-600">Профиль не найден</div>;
  }

  // Данные из backend (user + info_students)
  const {
    fullName = 'N/A',
    phone = 'N/A',
    email = 'N/A',
    theoryProgress = 0,
    practiceProgress = 0,
    instructor = { fullName: 'N/A', experience: 'N/A', photo: null },
  } = profileData;

  // Фото студента — если нет в данных, дефолтное (можно заменить на своё)
  const studentPhoto = "https://via.placeholder.com/128?text=Фото"; // ← или profileData.photo || дефолт

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Левая колонка (sticky) */}
          <div className="md:sticky md:top-20 md:h-fit">
            <div className="bg-white rounded-2xl p-6 shadow-md mb-8 text-center">
              <img
                src={studentPhoto}
                alt="Фото студента"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-2xl font-bold mb-2">{fullName}</h2>
              <p className="text-gray-600">Студент категории B</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4">Личные данные</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Имя</p>
                  <p className="font-medium">{fullName}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Телефон</p>
                  <p className="font-medium">{phone}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка */}
          <div className="md:col-span-2 space-y-8">
            {/* Общий прогресс */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4">Общий прогресс курса</h3>
              <div className="flex gap-8 mb-4 justify-center md:justify-start">
                {/* Теория */}
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="4"
                      strokeDasharray={`${theoryProgress}, 100`}
                    />
                  </svg>
                  <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-blue-600">
                    {theoryProgress}%
                  </p>
                </div>

                {/* Практика */}
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="4"
                      strokeDasharray={`${practiceProgress}, 100`}
                    />
                  </svg>
                  <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-blue-600">
                    {practiceProgress}%
                  </p>
                </div>
              </div>
              <p className="text-center text-gray-600 text-sm">
                Осталось 4 практических занятия до экзамена
              </p>
            </div>

            {/* Следующее занятие */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4">Следующее занятие</h3>
              <p className="text-2xl font-bold mb-2">ЗАВТРА, 14:00</p>
              <p className="text-gray-600 mb-4">Вождение в городе</p>
              <div className="flex items-center gap-4">
                {instructor.photo ? (
                  <img
                    src={instructor.photo}
                    alt="Инструктор"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    ?
                  </div>
                )}
                <div>
                  <p className="font-bold">Инструктор: {instructor.fullName}</p>
                  <p className="text-gray-600 text-sm">Стаж {instructor.experience || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Кнопки */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/booking"
                className="bg-blue-100 rounded-2xl p-6 text-center hover:bg-blue-200 transition"
              >
                <span className="material-symbols-outlined text-blue-600 text-4xl mb-2 block">
                  book
                </span>
                <p className="text-sm font-medium">История обучения</p>
              </Link>
              <Link
                to="/payments"
                className="bg-green-100 rounded-2xl p-6 text-center hover:bg-green-200 transition"
              >
                <span className="material-symbols-outlined text-green-600 text-4xl mb-2 block">
                  payments
                </span>
                <p className="text-sm font-medium">Платежи</p>
              </Link>
            </div>

            {/* Выход */}
            <button
              onClick={logout}
              className="w-full bg-red-600 text-white py-4 rounded-full font-bold text-lg hover:bg-red-700 transition"
            >
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}