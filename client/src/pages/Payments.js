import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function Payments() {
  const { user } = useAuth();
  const [fullPayment, setFullPayment] = useState(0);
  const [paid, setPaid] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:5000/api/profile/${user.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => {
          setFullPayment(data.full_payment || 0);
          setPaid(data.payment || 0);
          setRemaining(Math.max(0, (data.full_payment || 0) - (data.payment || 0)));  // Исправлено: не отрицательное
          setPayments(data.payments || []);
        })
        .catch(() => {
          setMessage('Ошибка загрузки данных');
        });
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">История платежей</h1>

        <div className="max-w-md mx-auto bg-gray-100 p-6 rounded-2xl mb-12">
          <p className="text-lg mb-2"><strong>Полная сумма:</strong> {fullPayment} руб.</p>
          <p className="text-lg mb-2"><strong>Оплачено:</strong> {paid} руб.</p>
          <p className="text-lg"><strong>Осталось заплатить:</strong> {remaining} руб.</p>
        </div>

        {message && <p className="text-center text-lg mb-8 text-red-600">{message}</p>}

        <h2 className="text-2xl font-bold mb-6 text-center">История платежей</h2>
        <table className="w-full max-w-md mx-auto border-collapse bg-white shadow-md rounded-2xl overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">Дата</th>
              <th className="p-4 text-left">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center p-8 text-gray-500">Нет платежей</td>
              </tr>
            ) : (
              payments.map((p, i) => (
                <tr key={i} className="border-b">
                  <td className="p-4">{p.date}</td>
                  <td className="p-4">{p.amount} руб.</td>
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