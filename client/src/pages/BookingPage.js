// client/src/pages/Booking.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // стандартные стили, можно переопределить
import { format, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale'; // для русского языка
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function Booking() {
  const { user } = useAuth();
  const [days, setDays] = useState([]);           // массив доступных дней недели, напр. ['Понедельник', 'Вторник']
  const [times, setTimes] = useState([]);         // слоты времени
  const [notWdays, setNotWdays] = useState([]);   // исключения (даты как '2026-01-01')
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/days')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setDays)
      .catch(() => setDays([]));

    fetch('/api/times')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setTimes)
      .catch(() => setTimes([]));

    fetch('/api/not-wdays')  // добавь этот роут на сервере
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setNotWdays)
      .catch(() => setNotWdays([]));
  }, []);

  if (user?.status !== 'student') {
    return <div className="text-center py-20 text-red-600 text-2xl">Доступ запрещён</div>;
  }

  // Проверка доступности дня
  const tileDisabled = ({ date, view }) => {
    if (view !== 'month') return false;
    const dayOfWeek = format(date, 'EEEE', { locale: ru }); // 'Понедельник'
    const dateStr = format(date, 'yyyy-MM-dd');
    const isFuture = date >= new Date();
    const isWorkingDay = days.includes(dayOfWeek);
    const isNotException = !notWdays.includes(dateStr);
    return !(isFuture && isWorkingDay && isNotException);
  };

  // Подсветка доступных дней (белый = кликабельный)
  const tileClassName = ({ date, view }) => {
    if (view === 'month' && !tileDisabled({ date, view })) {
      return 'bg-white text-black hover:bg-blue-100 cursor-pointer';
    }
    return 'text-gray-400 cursor-not-allowed';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!selectedDate || !selectedTime || !selectedPlace) {
      setMessage('Выберите дату, время и место');
      setLoading(false);
      return;
    }

    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    try {
      const res = await fetch(`/api/add-booking/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ date: dateStr, time: selectedTime, place: selectedPlace })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Запись успешно добавлена!');
        setShowModal(false);
        setSelectedDate(null);
        setSelectedTime('');
        setSelectedPlace('');
      } else {
        setMessage(data.message || 'Ошибка (возможно, слот занят)');
      }
    } catch (err) {
      setMessage('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Запись на практику</h2>

          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition mb-8"
          >
            Открыть календарь и выбрать дату
          </button>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
              <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
                <h3 className="text-2xl font-bold mb-6 text-center">Выберите дату для практики</h3>

                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  locale="ru-RU"
                  tileDisabled={tileDisabled}
                  tileClassName={tileClassName}
                  minDate={new Date()}
                  next2Label={null}
                  prev2Label={null}
                />

                {selectedDate && (
                  <div className="mt-6">
                    <p className="text-center font-medium mb-4">
                      Выбрана дата: {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Время</label>
                        <select
                          value={selectedTime}
                          onChange={e => setSelectedTime(e.target.value)}
                          className="w-full px-4 py-3 border rounded-lg focus:border-blue-600"
                          required
                        >
                          <option value="">Выберите время</option>
                          {times.map((t, i) => (
                            <option key={i} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Место</label>
                        <select
                          value={selectedPlace}
                          onChange={e => setSelectedPlace(e.target.value)}
                          className="w-full px-4 py-3 border rounded-lg focus:border-blue-600"
                          required
                        >
                          <option value="">Выберите место</option>
                          <option value="Атриум">Атриум</option>
                          <option value="БК">БК</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-4 rounded-full font-bold text-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {loading ? 'Запись...' : 'Записаться на практику'}
                      </button>
                    </form>
                  </div>
                )}

                <button
                  onClick={() => setShowModal(false)}
                  className="mt-6 w-full bg-red-600 text-white py-4 rounded-full font-bold hover:bg-red-700 transition"
                >
                  Закрыть
                </button>

                {message && (
                  <p className={`text-center mt-4 text-lg font-medium ${message.includes('успешно') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}