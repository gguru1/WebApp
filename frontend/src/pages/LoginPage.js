// pages/LoginPage.js - Login Page Component

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import '../assets/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if already logged in
    if (authService.isAuthenticated()) {
      const role = authService.getUserRole();
      const dashboards = {
        admin: '/admin',
        doctor: '/doctor',
        patient: '/patient'
      };
      navigate(dashboards[role] || '/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData);
      
      // Redirect based on role
      const dashboards = {
        admin: '/admin',
        doctor: '/doctor',
        patient: '/patient'
      };
      
      navigate(dashboards[response.user.role] || '/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    const credentials = {
      admin: { username: 'admin', password: 'admin123' }
    };
    
    if (credentials[role]) {
      setFormData(credentials[role]);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Login Header */}
          <div className="login-header">
            <div className="mb-3">
              <i className="fas fa-user-lock fa-3x"></i>
            </div>
            <h2>Welcome Back</h2>
            <p>Login to access your UG HealthConnect dashboard</p>
          </div>
          
          {/* Login Body */}
          <div className="login-body">
            {/* Error Alert */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError('')}
                  aria-label="Close"
                ></button>
              </div>
            )}
            
            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              {/* Username Input */}
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  <i className="fas fa-user me-1"></i>Username or Email
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-user"></i>
                  </span>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="username" 
                    name="username" 
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username or email"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  <i className="fas fa-lock me-1"></i>Password
                </label>
                <div className="form-floating-custom">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      className="form-control" 
                      id="password" 
                      name="password" 
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                  <i 
                    className={`fas fa-eye${showPassword ? '-slash' : ''} password-toggle`}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>
              </div>
              
              {/* Login Button */}
              <button 
                type="submit" 
                className="btn btn-login" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt me-2"></i>Login
                  </>
                )}
              </button>
            </form>
            
            {/* Demo Credentials */}
            <div className="text-center mt-3 p-3 bg-light rounded">
              <small className="text-muted">
                <strong>Demo Account (for testing):</strong><br />
                <button 
                  className="btn btn-sm btn-outline-primary mt-2"
                  type="button"
                  onClick={() => fillDemoCredentials('admin')}
                >
                  Fill Admin Login
                </button>
              </small>
            </div>
            
            {/* Back to Home */}
            <div className="back-to-home">
              <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                <i className="fas fa-arrow-left me-1"></i>Back to Homepage
              </a>
            </div>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="text-center mt-4 text-white">
          <p className="mb-1">
            <i className="fas fa-shield-alt me-2"></i>
            <strong>Secure Authentication</strong>
          </p>
          <p className="small mb-0" style={{opacity: 0.9}}>
            Your credentials are encrypted and protected with JWT tokens
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;