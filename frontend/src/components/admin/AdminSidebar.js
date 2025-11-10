// components/admin/AdminSidebar.js - Admin Sidebar Navigation

import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ collapsed, show, onClose }) => {
  const menuItems = [
    {
      path: '/admin',
      icon: 'fas fa-tachometer-alt',
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/admin/users',
      icon: 'fas fa-users',
      label: 'Users'
    },
    {
      path: '/admin/appointments',
      icon: 'fas fa-calendar-alt',
      label: 'Appointments'
    },
    {
      path: '/admin/settings',
      icon: 'fas fa-cog',
      label: 'Settings'
    }
  ];

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${show ? 'show' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <i className="fas fa-heartbeat"></i>
        </div>
        {!collapsed && <h4>UG HealthConnect</h4>}
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => 
              `sidebar-menu-item ${isActive ? 'active' : ''}`
            }
            onClick={() => onClose && onClose()}
          >
            <i className={item.icon}></i>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;