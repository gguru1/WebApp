import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';

// Import Layouts
import AdminLayout from './components/admin/AdminLayout';

// Import Utils
import ProtectedRoute from './utils/ProtectedRoute';
import authService from './services/authService';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes - Admin Only */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="*" element={<AdminDashboard />} />
          </Route>
          
          {/* Protected Routes - Doctor Only */}
          <Route 
            path="/doctor/*" 
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes - Patient Only */}
          <Route 
            path="/patient/*" 
            element={
              <ProtectedRoute requiredRole="patient">
                <PatientDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all - redirect based on auth status */}
          <Route 
            path="*" 
            element={<RedirectHandler />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

// Component to handle redirects based on authentication
const RedirectHandler = () => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (isAuthenticated) {
    const role = authService.getUserRole();
    const dashboards = {
      admin: '/admin',
      doctor: '/doctor',
      patient: '/patient'
    };
    return <Navigate to={dashboards[role] || '/'} replace />;
  }
  
  return <Navigate to="/" replace />;
};

export default App;