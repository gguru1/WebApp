// components/doctor/DoctorLayout.js

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DoctorNavbar from './DoctorNavbar';
import DoctorSidebar from './DoctorSidebar';
import '../../assets/DoctorDashboard.css';

const DoctorLayout = () => {
  const [sidebarShow, setSidebarShow] = useState(false);

  return (
    <div className="doctor-dashboard">
      <DoctorSidebar 
        show={sidebarShow}
        onClose={() => setSidebarShow(false)}
      />
      
      <div className="doctor-main">
        <DoctorNavbar 
          onToggleSidebarMobile={() => setSidebarShow(!sidebarShow)}
        />
        
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DoctorLayout;