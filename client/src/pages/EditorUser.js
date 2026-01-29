// client/src/pages/EditorUser.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function EditorUser() {
  const { user } = useAuth();
  const [searchId, setSearchId] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');

  // Для студентов: оплата и практика
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingPlace, setBookingPlace] = useState('');

  // Для mastercar: not_wdays
  const [notWdays, setNotWdays] = useState([]);
  const [newNotWday, setNewNotWday] = useState('');

  if (user?.status !== 'staff') {
    return <div className="text-center py-20 text-red-600 text-2xl">Доступ запрещён</div>;
  }

  const handleSearch = async () => {
    setMessage('');
    setEditUser(null);
    setNotWdays([]);

    if (!searchId.trim()) {
      setMessage('Введите ID пользователя');
      return;
    }

    try {
      const res = await fetch(`/api/student/${searchId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await res.json();
      if (res.ok) {
        setEditUser(data);
        setForm({
          fullName: data.fullName || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          group: data.group || '',
        });

        // Если mastercar — загружаем not_wdays
        if (data.status === 'mastercar') {
          const nwRes = await fetch('/api/not-wdays');
          const nwData = await nwRes.json();
          setNotWdays(nwData);
        }
      } else {
        setMessage(data.message || 'Пользователь не найден');
      }
    } catch (err) {
      setMessage('Ошибка сервера');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch(`/api/update-student/${searchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Данные обновлены');
        setEditUser(data.user);
      } else {
        setMessage(data.message || 'Ошибка');
      }
    } catch (err) {
      setMessage('Ошибка сервера');
    }
  };

  // Оплата (только для student)
  const handleAddPayment = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`/api/add-payment/${searchId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: Number(paymentAmount), date: today })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Оплата добавлена');
        setEditUser(data.user);
        setShowPaymentForm(false);
        setPaymentAmount('');
      } else {
        setMessage(data.message || 'Ошибка');
      }
    } catch (err) {
      setMessage('Ошибка сервера');
    }
  };

  // Практика (только для student)
  const handleAddBooking = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch(`/api/add-booking/${searchId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ date: bookingDate, time: bookingTime, place: bookingPlace })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Запись добавлена');
        setEditUser(data.user);
        setShowBookingForm(false);
        setBookingDate('');
        setBookingTime('');
        setBookingPlace('');
      } else {
        setMessage(data.message || 'Ошибка');
      }
    } catch (err) {
      setMessage('Ошибка сервера');
    }
  };

  const handleCancelBooking = async (index) => {
    try {
      const res = await fetch(`/api/cancel-booking/${searchId}/${index}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Запись отменена');
        setEditUser(data.user);
      }
    } catch (err) {
      setMessage('Ошибка');
    }
  };

  // not_wdays (для mastercar)
  const handleAddNotWday = () => {
    if (newNotWday && !notWdays.includes(newNotWday)) {
      setNotWdays([...notWdays, newNotWday]);
      setNewNotWday('');
    }
  };

  const handleRemoveNotWday = (index) => {
    setNotWdays(notWdays.filter((_, i) => i !== index));
  };

  const handleSaveNotWdays = async () => {
    try {
      const res = await fetch('/api/not-wdays', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ dates: notWdays })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Исключения сохранены');
      } else {
        setMessage(data.message || 'Ошибка сохранения');
      }
    } catch (err) {
      setMessage('Ошибка сервера');
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Редактирование пользователя</h2>

          {/* Поиск */}
          <div className="flex gap-4 mb-8">
            <input
              type="text"
              placeholder="ID пользователя"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition"
            >
              Найти
            </button>
          </div>

          {editUser && (
            <>
              {/* Базовая форма (для всех) */}
              <form onSubmit={handleUpdate} className="space-y-6 mb-12">
                <h3 className="text-2xl font-semibold mb-4">Основные данные</h3>
                <input
                  type="text"
                  placeholder="ФИО"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Телефон"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Адрес"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                />

                {editUser.status === 'student' && (
                  <input
                    type="text"
                    placeholder="Группа"
                    value={form.group}
                    onChange={(e) => setForm({ ...form, group: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                  />
                )}

                <input
                  type="password"
                  placeholder="Новый пароль (опционально)"
                  value={form.newPassword || ''}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                />

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition"
                >
                  Сохранить данные
                </button>
              </form>

              {/* Контент только для student */}
              {editUser.status === 'student' && (
                <>
                  {/* Оплата */}
                  <div className="mb-12">
                    <h3 className="text-2xl font-semibold mb-4">Оплата обучения</h3>
                    <button
                      onClick={() => setShowPaymentForm(!showPaymentForm)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition"
                    >
                      Добавить оплату
                    </button>

                    {showPaymentForm && (
                      <form onSubmit={handleAddPayment} className="space-y-4 mt-4">
                        <input
                          type="number"
                          placeholder="Сумма оплаты"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                          required
                        />
                        <p className="text-gray-600">Дата оплаты будет сегодняшняя автоматически</p>
                        <button
                          type="submit"
                          className="w-full bg-green-600 text-white py-4 rounded-full font-bold text-lg hover:bg-green-700 transition"
                        >
                          Добавить оплату
                        </button>
                      </form>
                    )}

                    <h4 className="text-xl font-medium mt-6 mb-2">История оплат</h4>
                    {(editUser.payments || []).length === 0 ? (
                      <p>Оплат пока нет</p>
                    ) : (
                      editUser.payments.map((p, i) => (
                        <div key={i} className="flex justify-between border-b py-2">
                          <span>{p.date}</span>
                          <span>{p.amount} ₽</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Практика */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Запись на практику</h3>
                    <button
                      onClick={() => setShowBookingForm(!showBookingForm)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition"
                    >
                      Записать на практику
                    </button>

                    {showBookingForm && (
                      <form onSubmit={handleAddBooking} className="space-y-4 mt-4">
                        <input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                          required
                        />
                        <input
                          type="time"
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                          required
                        />
                        <select
                          value={bookingPlace}
                          onChange={(e) => setBookingPlace(e.target.value)}
                          className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                          required
                        >
                          <option value="">Выберите адрес</option>
                          <option value="Атриум">Атриум</option>
                          <option value="БК">БК</option>
                        </select>
                        <button
                          type="submit"
                          className="w-full bg-green-600 text-white py-4 rounded-full font-bold text-lg hover:bg-green-700 transition"
                        >
                          Записать
                        </button>
                      </form>
                    )}

                    <h4 className="text-xl font-medium mt-6 mb-2">Текущие записи на практику</h4>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="p-2">Дата</th>
                          <th className="p-2">Время</th>
                          <th className="p-2">Адрес</th>
                          <th className="p-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {(editUser.booking || []).length === 0 ? (
                          <tr>
                            <td colSpan="4" className="text-center p-4">Записей нет</td>
                          </tr>
                        ) : (
                          editUser.booking.map((b, i) => (
                            <tr key={i} className="border-b">
                              <td className="p-2">{b.date}</td>
                              <td className="p-2">{b.time}</td>
                              <td className="p-2">{b.place}</td>
                              <td className="p-2">
                                <button
                                  onClick={() => handleCancelBooking(i)}
                                  className="bg-red-600 text-white px-4 py-2 rounded-full text-sm hover:bg-red-700 transition"
                                >
                                  Отменить
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Контент только для mastercar */}
              {editUser.status === 'mastercar' && (
                <div className="mt-12">
                  <h3 className="text-2xl font-semibold mb-4">Редактирование исключений (not_wdays)</h3>

                  <div className="flex gap-4 mb-4">
                    <input
                      type="date"
                      value={newNotWday}
                      onChange={(e) => setNewNotWday(e.target.value)}
                      className="flex-1 px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                    />
                    <button
                      onClick={handleAddNotWday}
                      className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition"
                    >
                      Добавить
                    </button>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {notWdays.map((date, i) => (
                      <li key={i} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                        <span>{date}</span>
                        <button
                          onClick={() => handleRemoveNotWday(i)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Удалить
                        </button>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handleSaveNotWdays}
                    className="w-full bg-green-600 text-white py-4 rounded-full font-bold text-lg hover:bg-green-700 transition"
                  >
                    Сохранить исключения
                  </button>
                </div>
              )}
            </>
          )}

          {message && (
            <p className={`text-center mt-8 text-xl font-medium ${message.includes('успешно') || message.includes('обновлены') || message.includes('добавлена') || message.includes('отменена') || message.includes('сохранены') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}