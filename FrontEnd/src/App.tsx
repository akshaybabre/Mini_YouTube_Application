import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLoginForm from './components/AdminLoginForm';
import LoginForm from './components/UserLoginForm';
import SignupForm from './components/UserSignupForm';
import LandingPage from './pages/LandingPage';
import { AuthProvider, useAuth } from './services/AuthContext';
import UserDashPage from './pages/UserDashPage';
import AdminDash from './pages/AdminDashPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-gray-600 text-lg font-medium">Loading...</span>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/" replace />;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  return adminToken ? <>{children}</> : <Navigate to="/admin" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin" element={<AdminLoginForm />} />
        <Route
          path="/userDash"
          element={
            <ProtectedRoute>
              <UserDashPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminDash"
          element={
            <AdminProtectedRoute>
              <AdminDash />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;