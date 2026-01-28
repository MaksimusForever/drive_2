import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Contacts() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container py-8">
        <Breadcrumbs paths={[{ name: 'Главная', link: '/' }, { name: 'Контакты' }]} />
        <h1>Контакты</h1>
        <p>Адрес: Москва, ул. Ленина, 10</p>
        <p>Тел: +7 (495) 123-45-67</p>
        <h2 className="mt-8">Форма обратной связи</h2>
        <form className="mt-4 max-w-md">
          <label className="label">Имя</label>
          <input className="input" placeholder="Ваше имя" />
          <label className="label mt-4">Email</label>
          <input className="input" type="email" placeholder="Email" />
          <label className="label mt-4">Сообщение</label>
          <textarea className="input h-32" placeholder="Ваше сообщение"></textarea>
          <button className="btn btn-primary mt-4">Отправить</button>
        </form>
      </main>
      <Footer />
    </div>
  );
}