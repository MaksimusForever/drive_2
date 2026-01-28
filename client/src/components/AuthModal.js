import React, { useState } from 'react';
import { X } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';  // ← ИСПРАВЛЕННЫЙ ИМПОРТ

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setSuccess('');
    const endpoint = isLogin ? '/api/login' : '/api/register';
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        const decoded = jwtDecode(data.token);  // ← работает с named import
        setSuccess(`Добро пожаловать, ${decoded.email}!`);
        setTimeout(onClose, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Ошибка сервера');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="close-btn"><X size={24} /></button>
        <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
        <div className="flex gap-2 mb-4">
          <button className={isLogin ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => setIsLogin(true)}>Вход</button>
          <button className={!isLogin ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => setIsLogin(false)}>Регистрация</button>
        </div>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input className="input" name="name" placeholder="Имя" onChange={handleChange} required />
          )}
          <input className="input" name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input className="input" name="phone" type="tel" placeholder="Телефон" onChange={handleChange} required />
          <input className="input" name="password" type="password" placeholder="Пароль" onChange={handleChange} required />
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <button type="submit" className="btn btn-primary w-full mt-4">
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </div>
  );
}