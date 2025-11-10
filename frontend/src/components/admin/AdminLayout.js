// components/admin/AdminLayout.js - Admin Dashboard Layout

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import '../../assets/AdminDashboard.css';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarShow, setSidebarShow] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleSidebarMobile = () => {
    setSidebarShow(!sidebarShow);
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        show={sidebarShow}
        onClose={() => setSidebarShow(false)}
      />
      
      <div className={`admin-main ${sidebarCollapsed ? 'expanded' : ''}`}>
        <AdminNavbar 
          onToggleSidebar={toggleSidebar}
          onToggleSidebarMobile={toggleSidebarMobile}
        />
        
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;