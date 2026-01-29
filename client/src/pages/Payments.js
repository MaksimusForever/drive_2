// client/src/pages/Payments.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function Payments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) {
      setError('Не авторизован');
      setLoading(false);
      return;
    }

    fetch(`/api/profile/${user.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(data => setPayments(data.payments || []))
      .catch(err => setError(err.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) return <div className="text-center py-20 text-xl">Загрузка...</div>;
  if (error) return <div className="text-center py-20 text-red-600 text-xl">{error}</div>;

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">История платежей</h2>

          {payments.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">Оплат пока нет</p>
          ) : (
            <div className="space-y-4">
              {payments.map((p, i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-4 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="font-medium">{p.date}</p>
                  </div>
                  <p className="text-green-600 font-bold text-lg">{p.amount} ₽</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}