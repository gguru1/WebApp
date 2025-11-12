// components/doctor/DoctorSettings.js

import React, { useState } from 'react';
import ChangePasswordModal from '../shared/ChangePasswordModal';
import authService from '../../services/authService';

const DoctorSettings = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const user = authService.getCurrentUser();

  return (
    <>
      <div className="page-header">
        <h2>Settings</h2>
        <p>Manage your account settings</p>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-user me-2"></i>
                Profile Information
              </h5>
              <div className="mt-3">
                <div className="mb-3">
                  <strong>Name:</strong> Dr. {user?.firstName} {user?.lastName}
                </div>
                <div className="mb-3">
                  <strong>Email:</strong> {user?.email}
                </div>
                <div className="mb-3">
                  <strong>Username:</strong> {user?.username}
                </div>
                <div className="mb-3">
                  <strong>Role:</strong> <span className="badge badge-success">{user?.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-lock me-2"></i>
                Security
              </h5>
              <p className="text-muted">Manage your account security settings</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowPasswordModal(true)}
              >
                <i className="fas fa-key me-2"></i>
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onPasswordChanged={() => {
            setShowPasswordModal(false);
          }}
        />
      )}
    </>
  );
};

export default DoctorSettings;