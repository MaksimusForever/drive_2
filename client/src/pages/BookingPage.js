import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function BookingPage() {
  const { user } = useAuth();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [place, setPlace] = useState('');
  const [bookings, setBookings] = useState([]);
  const [days, setDays] = useState([]);
  const [times, setTimes] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch days and times
    fetch('http://localhost:5000/api/days')
      .then(res => res.json())
      .then(setDays)
      .catch(() => setDays([]));

    fetch('http://localhost:5000/api/times')
      .then(res => res.json())
      .then(setTimes)
      .catch(() => setTimes([]));

    // Fetch bookings
    if (user?.id) {
      fetch(`http://localhost:5000/api/profile/${user.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => setBookings(data.booking || []))
        .catch(() => setBookings([]));
    }
  }, [user]);

  const validateDate = (selectedDate) => {
    if (!selectedDate) return;
    const dt = new Date(selectedDate);
    const weekday = dt.toLocaleString('en-us', { weekday: 'long' });
    if (!days.includes(weekday)) {
      setError(`Недоступный день: ${weekday}. Доступны: ${days.join(', ')}`);
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (error || !date || !time || !place) {
      setMessage('Исправьте ошибки');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/add-booking/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ date, time, place })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Запись добавлена');
        setBookings([...bookings, { date, time, place }]);
        setDate('');
        setTime('');
        setPlace('');
      } else {
        setMessage(data.message || 'Ошибка');
      }
    } catch (err) {
      setMessage('Ошибка сервера');
    }
  };

  const handleCancel = async (index) => {
    setMessage('');

    try {
      const res = await fetch(`http://localhost:5000/api/cancel-booking/${user.id}/${index}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Запись отменена');
        const newBookings = bookings.filter((_, i) => i !== index);
        setBookings(newBookings);
      } else {
        setMessage(data.message || 'Ошибка');
      }
    } catch (err) {
      setMessage('Ошибка сервера');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Запись на практику</h1>

        <form onSubmit={handleSubmit} className="space-y-6 mb-12 max-w-md mx-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Дата</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => { setDate(e.target.value); validateDate(e.target.value); }} 
              className="w-full p-4 border rounded-lg" 
              required 
              min={new Date().toISOString().split('T')[0]}  // Только будущие даты
            />
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Время</label>
            <select 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
              className="w-full p-4 border rounded-lg" 
              required
            >
              <option value="">Выберите время</option>
              {times.map((t, i) => <option key={i} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Адрес</label>
            <select value={place} onChange={(e) => setPlace(e.target.value)} className="w-full p-4 border rounded-lg" required>
              <option value="">Выберите адрес</option>
              <option value="Атриум">Атриум</option>
              <option value="БК">БК</option>
            </select>
          </div>
          <button className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition">
            Записаться
          </button>
        </form>

        {message && <p className="text-center text-lg mb-8">{message}</p>}

        <h2 className="text-2xl font-bold mb-6 text-center">Имеющиеся записи</h2>
        <table className="w-full max-w-md mx-auto border-collapse bg-white shadow-md rounded-2xl overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">Дата</th>
              <th className="p-4 text-left">Время</th>
              <th className="p-4 text-left">Адрес</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-8 text-gray-500">Нет записей</td>
              </tr>
            ) : (
              bookings.map((b, i) => (
                <tr key={i} className="border-b">
                  <td className="p-4">{b.date}</td>
                  <td className="p-4">{b.time}</td>
                  <td className="p-4">{b.place}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleCancel(i)}
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

      <BottomNav />
    </div>
  );
}