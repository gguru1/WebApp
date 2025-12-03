// components/admin/EditUserModal.js - Edit User Modal

import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import { validateUserForm } from '../../utils/validators';

const EditUserModal = ({ user, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    role: 'patient'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        role: user.role || 'patient'
      });
    }
  }, [user]);

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
    
    // Validate form (excluding password for edit)
    const validation = validateUserForm({ ...formData, password: 'dummy123' });
    if (!validation.isValid) {
      // Remove password error since we're not updating it
      const { password, ...otherErrors } = validation.errors;
      if (Object.keys(otherErrors).length > 0) {
        setErrors(otherErrors);
        return;
      }
    }

    setLoading(true);
    try {
      // Convert field names to match backend (snake_case)
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        role: formData.role
      };
      
      await userService.updateUser(user.user_id, userData);
      alert('User updated successfully!');
      onUserUpdated();
    } catch (error) {
      console.error('Error updating user:', error);
      alert(error.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <i className="fas fa-user-edit me-2"></i>
            Edit User
          </h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    First Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <div className="invalid-feedback">{errors.firstName}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Last Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <div className="invalid-feedback">{errors.lastName}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>
                Username <span className="required">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                placeholder="Enter username"
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Enter email"
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                Role <span className="required">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`form-control ${errors.role ? 'is-invalid' : ''}`}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <div className="invalid-feedback">{errors.role}</div>
              )}
            </div>

            <div className="alert alert-info mt-3">
              <i className="fas fa-info-circle me-2"></i>
              To change password, use the Change Password feature.
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
                  Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>
                  Update User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;