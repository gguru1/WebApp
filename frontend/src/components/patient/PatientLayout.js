// components/patient/PatientLayout.js

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import PatientNavbar from './PatientNavbar';
import PatientSidebar from './PatientSidebar';
import '../../assets/PatientDashboard.css';

const PatientLayout = () => {
  const [sidebarShow, setSidebarShow] = useState(false);

  return (
    <div className="patient-dashboard">
      <PatientSidebar 
        show={sidebarShow}
        onClose={() => setSidebarShow(false)}
      />
      
      <div className="patient-main">
        <PatientNavbar 
          onToggleSidebarMobile={() => setSidebarShow(!sidebarShow)}
        />
        
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PatientLayout;