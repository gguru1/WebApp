// pages/DoctorDashboard.js - Doctor Dashboard (Placeholder)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Navigation Bar */}
      <nav className="navbar navbar-dark bg-success shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <i className="fas fa-stethoscope me-2"></i>
            Doctor Dashboard
          </span>
          <div>
            <span className="text-white me-3">
              Welcome, Dr. {user?.firstName || user?.username}
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
            <div className="alert alert-success">
              <h4 className="alert-heading">
                <i className="fas fa-info-circle me-2"></i>
                Doctor Dashboard - Coming Soon
              </h4>
              <p>
                This is a placeholder for the Doctor Dashboard. Full functionality will be implemented in Epic 3.
              </p>
              <hr />
              <p className="mb-0">
                <strong>Features to be implemented:</strong>
              </p>
              <ul>
                <li>View daily appointment schedule</li>
                <li>Access weekly schedule overview</li>
                <li>Review monthly appointments</li>
                <li>Patient information at a glance</li>
                <li>Secure password management</li>
              </ul>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => navigate('/')} 
                className="btn btn-success"
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

export default DoctorDashboard;