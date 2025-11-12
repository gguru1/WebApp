// components/doctor/DoctorSidebar.js

import React from 'react';
import { NavLink } from 'react-router-dom';

const DoctorSidebar = ({ show, onClose }) => {
  const menuItems = [
    {
      path: '/doctor',
      icon: 'fas fa-calendar-alt',
      label: 'My Appointments',
      exact: true
    },
    {
      path: '/doctor/patients',
      icon: 'fas fa-users',
      label: 'Patients'
    },
    {
      path: '/doctor/settings',
      icon: 'fas fa-cog',
      label: 'Settings'
    }
  ];

  return (
    <aside className={`admin-sidebar doctor-sidebar ${show ? 'show' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <i className="fas fa-user-md"></i>
        </div>
        <h4>Doctor Portal</h4>
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

export default DoctorSidebar;