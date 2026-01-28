const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// === Проверка JWT_SECRET ===
const SECRET_KEY = process.env.JWT_SECRET?.trim();
if (!SECRET_KEY) {
  console.error('ОШИБКА: JWT_SECRET не задан или пустой в .env файле!');
  process.exit(1);
}
console.log(`JWT_SECRET загружен (длина: ${SECRET_KEY.length})`);

const AUTH_MODE = process.env.AUTH_MODE || 'file';
console.log(`Режим авторизации: ${AUTH_MODE}`);

app.use(cors());
app.use(express.json());

// Хранилище пользователей (file-режим)
let UserModel;

if (AUTH_MODE === 'file') {
  const filePath = path.join(__dirname, 'users.json');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
  }

  const loadUsers = () => {
    const data = fs.readFileSync(filePath, 'utf-8').trim();
    return data ? JSON.parse(data) : [];
  };

  const saveUsers = (users) => {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
  };

  UserModel = {
    findOne: async (query) => {
      const users = loadUsers();
      return users.find(u => 
        (query.email && u.email.toLowerCase() === query.email.toLowerCase()) || 
        (query.phone && u.phone === query.phone) || 
        (query.id && u.id === query.id)
      );
    },
    updateOne: async (query, updates) => {
      const users = loadUsers();
      const index = users.findIndex(u => u.id === query.id);
      if (index === -1) return null;
      users[index] = { ...users[index], ...updates };
      saveUsers(users);
      return users[index];
    },
    create: async (data) => {
      const users = loadUsers();
      const newUser = { id: Date.now().toString(), ...data };
      users.push(newUser);
      saveUsers(users);
      return newUser;
    }
  };
} else {
  console.error('Режим db не реализован');
  process.exit(1);
}

// === Info Students (info_students/id.json) ===
const infoDir = path.join(__dirname, 'info_students');
if (!fs.existsSync(infoDir)) fs.mkdirSync(infoDir);

const loadStudentInfo = (id) => {
  const filePath = path.join(infoDir, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const saveStudentInfo = (id, info) => {
  const filePath = path.join(infoDir, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(info, null, 2));
};

// Вход
app.post('/api/login', async (req, res) => {
  console.log('Попытка входа:', req.body);
  try {
    const { email, phone, password } = req.body;
    if (!password || (!email && !phone)) return res.status(400).json({ message: 'Укажите email или телефон и пароль' });

    const query = email ? { email: email.toLowerCase() } : { phone };
    const user = await UserModel.findOne(query);
    if (!user) return res.status(400).json({ message: 'Неверный логин или пароль' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Неверный логин или пароль' });

    const token = jwt.sign({ id: user.id, email: user.email, status: user.status }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: 'Вход успешен', token });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Регистрация учеников (только staff)
app.post('/api/staff-register', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Нет токена' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.status !== 'staff') return res.status(403).json({ message: 'Доступ запрещён' });

    const { firstName, lastName, middleName, email, phone, password, address, group } = req.body;
    if (!email || !phone || !password || !firstName || !lastName || !group) return res.status(400).json({ message: 'Заполните все обязательные поля' });

    if (!validator.isEmail(email)) return res.status(400).json({ message: 'Неверный email' });

    const existing = await UserModel.findOne({ email: email.toLowerCase() }) || await UserModel.findOne({ phone });
    if (existing) return res.status(400).json({ message: 'Пользователь с таким email или телефоном уже существует' });

    const hashed = await bcrypt.hash(password, 12);
    const fullName = `${lastName} ${firstName} ${middleName || ''}`.trim();

    const newUser = await UserModel.create({
      email: email.toLowerCase(),
      phone,
      password: hashed,
      fullName,
      address,
      group,
      status: 'student'
    });

    // Создаём info_students/id.json
    const initialInfo = {
      payment: 0,
      theoryProgress: 0,
      practiceProgress: 0,
      instructor: { id: '', fullName: '', photo: '' },
      payments: [],
      booking: []
    };
    saveStudentInfo(newUser.id, initialInfo);

    res.json({ message: 'Ученик зарегистрирован' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить список групп
app.get('/api/groups', (req, res) => {
  try {
    const groupsPath = path.join(__dirname, '../groups.json');
    if (!fs.existsSync(groupsPath)) {
      console.error('groups.json не найден по пути:', groupsPath);
      return res.status(500).json({ message: 'groups.json не найден' });
    }
    const groups = JSON.parse(fs.readFileSync(groupsPath, 'utf8'));
    res.json(groups);
  } catch (err) {
    console.error('Ошибка чтения groups.json:', err);
    res.status(500).json({ message: 'Ошибка сервера при чтении групп' });
  }
});

// Получить доступные дни
app.get('/api/days', (req, res) => {
  try {
    const daysPath = path.join(__dirname, '../days.json');
    const days = JSON.parse(fs.readFileSync(daysPath, 'utf8'));
    res.json(days);
  } catch (err) {
    console.error('Ошибка days.json:', err);
    res.status(500).json({ message: 'Ошибка загрузки дней' });
  }
});

// Получить доступное время
app.get('/api/times', (req, res) => {
  try {
    const timesPath = path.join(__dirname, '../times.json');
    const times = JSON.parse(fs.readFileSync(timesPath, 'utf8'));
    res.json(times);
  } catch (err) {
    console.error('Ошибка times.json:', err);
    res.status(500).json({ message: 'Ошибка загрузки времени' });
  }
});

// Поиск ученика по ID (для staff)
app.get('/api/student/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Нет токена' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.status !== 'staff') return res.status(403).json({ message: 'Доступ запрещён' });

    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ message: 'Ученик не найден' });

    const info = loadStudentInfo(req.params.id) || {};
    res.json({ ...user, ...info });
  } catch (err) {
    res.status(401).json({ message: 'Недействительный токен' });
  }
});

// Обновление ученика (для staff)
app.put('/api/update-student/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Нет токена' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.status !== 'staff') return res.status(403).json({ message: 'Доступ запрещён' });

    let updates = req.body;
    if (updates.newPassword && updates.newPassword.trim() !== '') {
      updates.password = await bcrypt.hash(updates.newPassword.trim(), 12);
      delete updates.newPassword;
    } else {
      delete updates.newPassword;
    }

    const updatedUser = await UserModel.updateOne({ id: req.params.id }, updates);
    if (!updatedUser) return res.status(404).json({ message: 'Ученик не найден' });

    res.json({ message: 'Данные обновлены', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Добавить оплату (автоматическая дата)
app.post('/api/add-payment/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Нет токена' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.status !== 'staff') return res.status(403).json({ message: 'Доступ запрещён' });

    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Укажите положительную сумму' });

    let info = loadStudentInfo(req.params.id) || {};
    info.payments = info.payments || [];
    const today = new Date().toISOString().split('T')[0];
    info.payments.push({ date: today, amount });
    info.payment = (info.payment || 0) + amount;

    saveStudentInfo(req.params.id, info);

    res.json({ message: 'Оплата добавлена', user: { ...info } });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Добавить запись на практику
app.post('/api/add-booking/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Нет токена' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    // Разрешаем: staff любого, student — только себя
    if (decoded.status !== 'staff' && decoded.id !== req.params.id) {
      return res.status(403).json({ message: 'Доступ запрещён' });
    }

    const { date, time, place } = req.body;
    if (!date || !time || !place) return res.status(400).json({ message: 'Заполните все поля' });

    let info = loadStudentInfo(req.params.id) || {};
    info.booking = info.booking || [];
    info.booking.push({ date, time, place });

    saveStudentInfo(req.params.id, info);

    res.json({ message: 'Запись добавлена', user: { ...info } });
  } catch (err) {
    console.error('Ошибка add-booking:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Отменить запись на практику
app.delete('/api/cancel-booking/:id/:index', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Нет токена' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.status !== 'staff') return res.status(403).json({ message: 'Доступ запрещён' });

    const index = parseInt(req.params.index);
    let info = loadStudentInfo(req.params.id) || {};
    if (info.booking && info.booking[index]) {
      info.booking.splice(index, 1);
      saveStudentInfo(req.params.id, info);
      res.json({ message: 'Запись отменена', user: { ...info } });
    } else {
      res.status(400).json({ message: 'Запись не найдена' });
    }
  } catch (err) {
    console.error('Ошибка cancel-booking:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить полный профиль (для /profile)
app.get('/api/profile/:id', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Нет токена' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.id !== req.params.id) return res.status(403).json({ message: 'Доступ запрещён' });

    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    const info = loadStudentInfo(req.params.id) || {};
    res.json({ ...user, ...info });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../../client/build/index.html')));
} else {
  app.get('/', (req, res) => res.send('API работает. Frontend: npm run dev'));
}

app.listen(PORT, () => console.log(`Сервер запущен на http://localhost:${PORT}`));