import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function AuthPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token);
        setSuccess('Вход успешен! Перенаправление...');
        setTimeout(() => {
          window.location.href = '/profile';
        }, 1500);
      } else {
        // Точная ошибка от backend
        setError(data.message || 'Неизвестная ошибка сервера');
      }
    } catch (err) {
      console.error('Ошибка сети:', err);
      setError('Нет соединения с сервером. Проверьте backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Вход в аккаунт</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
              required
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Пароль"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
              required
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          {error && (
            <p className="text-center mt-6 text-red-600 text-xl font-medium">
              Ошибка: {error}
            </p>
          )}

          {success && (
            <p className="text-center mt-6 text-green-600 text-xl font-medium">
              {success}
            </p>
          )}

          <p className="text-center mt-8 text-gray-600">
            Нет аккаунта? Обратитесь в офис автошколы.
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}