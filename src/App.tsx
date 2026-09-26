import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ResidentDashboard } from './pages/ResidentDashboard';
import { WardenDashboard } from './pages/WardenDashboard';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Landing Page FIRST as specified */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Resident Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="resident">
                <ResidentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Warden Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="warden">
                <WardenDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback to Public Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
