// components/patient/PatientSidebar.js

import React from 'react';
import { NavLink } from 'react-router-dom';

const PatientSidebar = ({ show, onClose }) => {
  const menuItems = [
    {
      path: '/patient',
      icon: 'fas fa-home',
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/patient/appointments',
      icon: 'fas fa-calendar-alt',
      label: 'My Appointments'
    },
    {
      path: '/patient/settings',
      icon: 'fas fa-cog',
      label: 'Settings'
    }
  ];

  return (
    <aside className={`admin-sidebar patient-sidebar ${show ? 'show' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <i className="fas fa-user"></i>
        </div>
        <h4>Patient Portal</h4>
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
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default PatientSidebar;