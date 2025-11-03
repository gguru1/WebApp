// utils/ProtectedRoute.js - Protected Route Component

import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on their actual role
    const redirectPaths = {
      admin: '/admin',
      doctor: '/doctor',
      patient: '/patient'
    };
    
    return <Navigate to={redirectPaths[userRole] || '/'} replace />;
  }

  // User is authenticated and has correct role
  return children;
};

export default ProtectedRoute;