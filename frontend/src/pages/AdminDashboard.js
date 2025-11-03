// pages/AdminDashboard.js - Admin Dashboard (Placeholder)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Navigation Bar */}
      <nav className="navbar navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <i className="fas fa-user-cog me-2"></i>
            Admin Dashboard
          </span>
          <div>
            <span className="text-white me-3">
              Welcome, {user?.firstName || user?.username}
            </span>
            <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
              <i className="fas fa-sign-out-alt me-1"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-info">
              <h4 className="alert-heading">
                <i className="fas fa-info-circle me-2"></i>
                Admin Dashboard - Coming Soon
              </h4>
              <p>
                This is a placeholder for the Admin Dashboard. Full functionality will be implemented in Epic 3.
              </p>
              <hr />
              <p className="mb-0">
                <strong>Features to be implemented:</strong>
              </p>
              <ul>
                <li>Create and manage user profiles</li>
                <li>Schedule and modify appointments</li>
                <li>Search appointments by patient or doctor</li>
                <li>View comprehensive patient and doctor lists</li>
                <li>Full CRUD operations on all data</li>
              </ul>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => navigate('/')} 
                className="btn btn-primary"
              >
                <i className="fas fa-home me-2"></i>
                Back to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;