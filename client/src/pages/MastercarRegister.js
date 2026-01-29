import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function MastercarRegister() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    password: '',
    address: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (user?.status !== 'staff') {
    return <div className="text-center py-20 text-red-600 text-2xl">Доступ запрещён</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const submitForm = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      middleName: form.middleName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password.trim(),
      address: form.address.trim()
    };

    if (!submitForm.firstName || !submitForm.lastName || !submitForm.email || !submitForm.phone || !submitForm.password) {
      setMessage('Заполните все обязательные поля');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register-mastercar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submitForm)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Инструктор успешно зарегистрирован');
        setForm({
          firstName: '',
          lastName: '',
          middleName: '',
          email: '',
          phone: '',
          password: '',
          address: ''
        });
      } else {
        setMessage(data.message || 'Ошибка регистрации');
      }
    } catch (err) {
      setMessage('Ошибка сервера');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Регистрация инструктора</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Имя"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Фамилия"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Отчество"
                value={form.middleName}
                onChange={(e) => setForm({ ...form, middleName: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
              required
            />

            <input
              type="tel"
              placeholder="Телефон"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
              required
            />

            <input
              type="password"
              placeholder="Пароль"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
              required
            />

            <input
              type="text"
              placeholder="Адрес проживания"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:border-blue-600 focus:outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Регистрация...' : 'Зарегистрировать инструктора'}
            </button>
          </form>

          {message && (
            <p className={`text-center mt-6 text-xl font-medium ${message.includes('успешно') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}