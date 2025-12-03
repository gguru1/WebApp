// components/doctor/DoctorNavbar.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { getInitials } from '../../utils/helpers';

const DoctorNavbar = ({ onToggleSidebarMobile }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
      navigate('/login');
    }
  };

  return (
    <nav className="admin-navbar">
      <button className="navbar-toggle" onClick={onToggleSidebarMobile}>
        <i className="fas fa-bars"></i>
      </button>

      <div className="navbar-search">
        <input 
          type="text" 
          placeholder="Search appointments..." 
          className="form-control"
        />
      </div>

      <div className="navbar-user">
        <div className="user-info">
          <div className="user-name">
             {user?.first_name || user?.firstName} {user?.last_name || user?.lastName}
          </div>
          <div className="user-role">{user?.role}</div>
        </div>
        
        <div className="user-avatar">
          {getInitials(user?.first_name || user?.firstName, user?.last_name || user?.lastName)}
        </div>
        
        <button 
          className="btn btn-sm btn-outline-danger"
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt me-1"></i>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default DoctorNavbar;