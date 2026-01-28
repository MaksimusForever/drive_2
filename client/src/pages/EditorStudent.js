import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function EditorStudent() {
  const { user } = useAuth();
  const [searchId, setSearchId] = useState('');
  const [student, setStudent] = useState(null);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');

  // Формы для оплаты и практики
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingPlace, setBookingPlace] = useState('');

  if (user?.status !== 'staff') {
    return <div className="text-center py-20 text-red-600 text-2xl">Доступ запрещён</div>;
  }

  const handleSearch = async () => {
    setMessage('');
    setStudent(null);

    if (!searchId.trim()) {
      setMessage('Введите ID ученика');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/student/${searchId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await res.json();
      if (res.ok) {
        setStudent(data);
        setForm({
          fullName: data.fullName || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          group: data.group || '',
        });
      } else {
        setMessage(data.message || 'Ученик не найден');
      }
    } catch (err) {
      setMessage('Ошибка сервера');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch(`http://localhost:5000/api/update-student/${searchId}`, {
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
        setStudent(data.user);
      } else {
        setMessage(data.message || 'Ошибка');
      }
    } catch (err) {
      setMessage('Ошибка сервера');
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const today = new Date().toISOString().split('T')[0]; // Автоматическая дата
      const res = await fetch(`http://localhost:5000/api/add-payment/${searchId}`, {
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
        setStudent(data.user);
        setShowPaymentForm(false);
        setPaymentAmount('');
      } else {
        setMessage(data.message || 'Ошибка');
      }
    } catch (err) {
      setMessage('Ошибка сервера');
    }
  };

  const handleAddBooking = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch(`http://localhost:5000/api/add-booking/${searchId}`, {
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
        setStudent(data.user);
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
      const res = await fetch(`http://localhost:5000/api/cancel-booking/${searchId}/${index}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Запись отменена');
        setStudent(data.user);
      }
    } catch (err) {
      setMessage('Ошибка');
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Редактирование ученика</h2>

          {/* Поиск */}
          <div className="mb-10">
            <label className="block text-sm font-medium text-gray-700 mb-2">ID ученика</label>
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="mt-4 w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition"
            >
              Найти
            </button>
          </div>

          {student && (
            <>
              {/* Основные данные — как на регистрации */}
              <form onSubmit={handleUpdate} className="space-y-8 mb-12">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ФИО</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Адрес проживания</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Группа</label>
                    <input
                      type="text"
                      value={form.group}
                      onChange={(e) => setForm({ ...form, group: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Сменить пароль</label>
                  <input
                    type="password"
                    placeholder="Оставьте пустым, если не хотите менять"
                    value={form.newPassword || ''}
                    onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-full font-bold text-lg hover:bg-green-700 transition">
                  Сохранить основные данные
                </button>
              </form>

              {/* Оплата — кнопка + форма + список */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Оплата обучения</h3>
                  <button
                    onClick={() => setShowPaymentForm(!showPaymentForm)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition"
                  >
                    Добавить оплату
                  </button>
                </div>

                {showPaymentForm && (
                  <form onSubmit={handleAddPayment} className="space-y-4 mb-8 p-6 bg-gray-50 rounded-xl">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Сумма оплаты (руб)</label>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-600">Дата оплаты будет сегодняшняя автоматически</p>
                    <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-full font-bold hover:bg-green-700 transition">
                      Добавить оплату
                    </button>
                  </form>
                )}

                <div className="space-y-4">
                  <h4 className="font-medium text-lg">История оплат</h4>
                  {(student.payments || []).length === 0 ? (
                    <p className="text-gray-500">Оплат пока нет</p>
                  ) : (
                    student.payments.map((p, i) => (
                      <div key={i} className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{p.date}</p>
                          <p className="text-green-600 font-bold">{p.amount} ₽</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Практика — кнопка + форма + таблица записей */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Запись на практику</h3>
                  <button
                    onClick={() => setShowBookingForm(!showBookingForm)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition"
                  >
                    Записать на практику
                  </button>
                </div>

                {showBookingForm && (
                  <form onSubmit={handleAddBooking} className="space-y-4 mb-8 p-6 bg-gray-50 rounded-xl">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Дата</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Время</label>
                      <input
                        type="time"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Адрес</label>
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
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-full font-bold hover:bg-green-700 transition">
                      Записать
                    </button>
                  </form>
                )}

                <h4 className="font-medium text-lg mb-4">Текущие записи на практику</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-4 border-b">Дата</th>
                        <th className="text-left p-4 border-b">Время</th>
                        <th className="text-left p-4 border-b">Адрес</th>
                        <th className="p-4 border-b"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(student.booking || []).length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center p-8 text-gray-500">Записей нет</td>
                        </tr>
                      ) : (
                        student.booking.map((b, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-4">{b.date}</td>
                            <td className="p-4">{b.time}</td>
                            <td className="p-4">{b.place}</td>
                            <td className="p-4 text-center">
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
              </div>
            </>
          )}

          {message && (
            <p className={`text-center mt-8 text-xl font-medium ${message.includes('успешно') || message.includes('обновлены') || message.includes('добавлена') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}