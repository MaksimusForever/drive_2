import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Instructors from './pages/Instructors';
import About from './pages/About';
import Profile from './pages/Profile';
import AuthPage from './pages/AuthPage';
import StaffRegister from './pages/StaffRegister';
import EditorStudent from './pages/EditorStudent';
import BookingPage from './pages/BookingPage';
import Payments from './pages/Payments';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/staff-register" element={<ProtectedRoute><StaffRegister /></ProtectedRoute>} />
        <Route path="/editor-student" element={<ProtectedRoute><EditorStudent /></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;