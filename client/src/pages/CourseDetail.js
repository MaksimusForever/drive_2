import React from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function CourseDetail() {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '100px', backgroundColor: '#fff' }}>
      <Header />

      {/* Hero */}
      <div
        style={{
          position: 'relative',
          height: '400px',
          backgroundImage: 'ur[](https://images.pexels.com/photos/29136672/pexels-photo-29136672/free-photo-of-luxurious-car-interior-with-digital-dashboard.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 20px',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'inline-block',
            background: '#2563eb',
            padding: '8px 24px',
            borderRadius: '30px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
          }}>
            ПОПУЛЯРНЫЙ
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '16px' }}>Категория B</h1>
          <p style={{ fontSize: '20px', marginBottom: '24px' }}>Автоматическая коробка передач</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: '30px' }}>3 месяца</span>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: '30px' }}>АКПП</span>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: '30px' }}>Теория онлайн</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '48px' }}>
          Полный курс обучения вождению на легковых автомобилях с автоматической коробкой передач. 
          Включает 134 часа теории и 56 часов практики в реальных городских условиях.
        </p>

        <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px' }}>Этапы обучения</h2>
        <div style={{ display: 'grid', gap: '32px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: '#2563eb', 
              color: 'white', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: '700', 
              fontSize: '20px' 
            }}>1</div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '600' }}>Запись в группу</h3>
              <p style={{ color: '#64748b' }}>Оформление документов и выбор графика. Доступно онлайн.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', background: '#2563eb', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '20px' }}>2</div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '600' }}>Теория</h3>
              <p style={{ color: '#64748b' }}>ПДД, устройство автомобиля, первая помощь.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', background: '#2563eb', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '20px' }}>3</div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '600' }}>Практика</h3>
              <p style={{ color: '#64748b' }}>Вождение на автодроме и в городе с инструктором.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', background: '#2563eb', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '20px' }}>4</div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '600' }}>Получение прав</h3>
              <p style={{ color: '#64748b' }}>Сдача экзамена в ГИБДД и выдача удостоверения.</p>
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '32px', fontWeight: '700', margin: '48px 0 32px' }}>Ваш инструктор</h2>
        <div style={{ display: 'flex', gap: '24px', background: 'white', padding: '24px', borderRadius: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          <img
            src="https://www.shutterstock.com/image-photo/driving-instructor-teaching-his-student-260nw-781124311.jpg"
            alt="Инструктор"
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: '600' }}>Алексей Иванов</h3>
            <p style={{ color: '#64748b' }}>Стаж 12 лет • Toyota Camry</p>
            <p style={{ color: '#f59e0b', fontSize: '24px', margin: '12px 0' }}>★★★★★ 5.0</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '30px', fontSize: '14px' }}>Спокойный</span>
              <span style={{ background: '#f59e0b', color: 'white', padding: '8px 16px', borderRadius: '30px', fontSize: '14px' }}>Профи</span>
            </div>
          </div>
        </div>

        <div style={{ position: 'fixed', bottom: '80px', left: '20px', right: '20px', zIndex: 100 }}>
          <button style={{
            width: '100%',
            background: '#2563eb',
            color: 'white',
            padding: '20px',
            borderRadius: '50px',
            fontSize: '20px',
            fontWeight: '600',
            border: 'none',
            boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
          }}>
            29 900 ₽ Записаться →
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}