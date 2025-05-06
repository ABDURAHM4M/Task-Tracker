// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';

// Auth wrapper
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route path="/tasks" element={<RequireAuth><Tasks /></RequireAuth>} />
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
