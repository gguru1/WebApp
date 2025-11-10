// components/admin/AdminNavbar.js - Admin Navigation Bar

import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { getInitials } from '../../utils/helpers';

const AdminNavbar = ({ onToggleSidebar, onToggleSidebarMobile }) => {
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
      <button className="navbar-toggle d-lg-none" onClick={onToggleSidebarMobile}>
        <i className="fas fa-bars"></i>
      </button>
      
      <button className="navbar-toggle d-none d-lg-block" onClick={onToggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      <div className="navbar-search">
        <input 
          type="text" 
          placeholder="Search..." 
          className="form-control"
        />
      </div>

      <div className="navbar-user">
        <div className="user-info">
          <div className="user-name">
            {user?.firstName} {user?.lastName}
          </div>
          <div className="user-role">{user?.role}</div>
        </div>
        
        <div className="user-avatar">
          {getInitials(user?.firstName, user?.lastName)}
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

export default AdminNavbar;