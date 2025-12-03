// pages/DoctorDashboard.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppointmentsList from '../components/doctor/AppointmentsList';
import DoctorSettings from '../components/doctor/DoctorSettings';

const DoctorDashboard = () => {
  return (
    <Routes>
      <Route index element={<AppointmentsList />} />
      <Route path="settings" element={<DoctorSettings />} />
    </Routes>
  );
};

export default DoctorDashboard;