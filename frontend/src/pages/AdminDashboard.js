// pages/AdminDashboard.js - Admin Dashboard Main Page

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StatisticsCards from '../components/admin/StatisticsCards';
import UsersList from '../components/admin/UsersList';
import AppointmentsList from '../components/admin/AppointmentsList';
import AdminSettings from '../components/admin/AdminSettings';

const AdminDashboard = () => {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
      <Route path="users" element={<UsersList />} />
      <Route path="appointments" element={<AppointmentsList />} />
      <Route path="settings" element={<AdminSettings />} />
    </Routes>
  );
};

// Dashboard Home Component
const DashboardHome = () => {
  return (
    <>
      <div className="page-header">
        <h2>Dashboard</h2>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active">Dashboard</li>
          </ol>
        </nav>
      </div>

      <StatisticsCards />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-info-circle me-2"></i>
                Welcome to Admin Dashboard
              </h5>
              <p className="card-text">
                Manage users, appointments, and system settings from this central dashboard.
              </p>
              <div className="mt-3">
                <h6>Quick Links:</h6>
                <div className="d-flex gap-2 flex-wrap">
                  <a href="/admin/users" className="btn btn-primary btn-sm">
                    <i className="fas fa-users me-2"></i>
                    Manage Users
                  </a>
                  <a href="/admin/appointments" className="btn btn-success btn-sm">
                    <i className="fas fa-calendar me-2"></i>
                    Manage Appointments
                  </a>
                  <a href="/admin/settings" className="btn btn-info btn-sm">
                    <i className="fas fa-cog me-2"></i>
                    Settings
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;