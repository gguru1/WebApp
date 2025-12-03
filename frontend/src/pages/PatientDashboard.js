// pages/PatientDashboard.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PatientHome from '../components/patient/PatientHome';
import PatientAppointments from '../components/patient/PatientAppointments';
import PatientSettings from '../components/patient/PatientSettings';

const PatientDashboard = () => {
  return (
    <Routes>
      <Route index element={<PatientHome />} />
      <Route path="appointments" element={<PatientAppointments />} />
      <Route path="settings" element={<PatientSettings />} />
    </Routes>
  );
};

export default PatientDashboard;