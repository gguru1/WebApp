// components/shared/ChangePasswordModal.js - Change Password Modal

import React, { useState } from 'react';
import api from '../../services/api';
import authService from '../../services/authService';
import { validatePasswordChange } from '../../utils/validators';

const ChangePasswordModal = ({ onClose, onPasswordChanged }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const currentUser = authService.getCurrentUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validatePasswordChange(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      // Use auth endpoint instead of user endpoint
      const response = await api.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      alert('Password changed successfully!');
      onPasswordChanged();
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.message?.includes('current password')) {
        setErrors({ currentPassword: 'Current password is incorrect' });
      } else {
        alert(error.message || 'Failed to change password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <i className="fas fa-key me-2"></i>
            Change Password
          </h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              Password must be at least 6 characters long.
            </div>

            <div className="form-group">
              <label>
                Current Password <span className="required">*</span>
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                placeholder="Enter current password"
                autoComplete="current-password"
              />
              {errors.currentPassword && (
                <div className="invalid-feedback">{errors.currentPassword}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                New Password <span className="required">*</span>
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                placeholder="Enter new password"
                autoComplete="new-password"
              />
              {errors.newPassword && (
                <div className="invalid-feedback">{errors.newPassword}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                Confirm New Password <span className="required">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Changing...
                </>
              ) : (
                <>
                  <i className="fas fa-check me-2"></i>
                  Change Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;