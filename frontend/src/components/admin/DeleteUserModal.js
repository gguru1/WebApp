// components/admin/DeleteUserModal.js - Delete User Confirmation Modal

import React, { useState } from 'react';
import userService from '../../services/userService';
import authService from '../../services/authService';

const DeleteUserModal = ({ user, onClose, onUserDeleted }) => {
  const [loading, setLoading] = useState(false);
  const currentUser = authService.getCurrentUser();

  const handleDelete = async () => {
    // Prevent admin from deleting themselves
    if (user.id === currentUser.id) {
      alert('You cannot delete your own account!');
      return;
    }

    if (!window.confirm(`Are you absolutely sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      return;
    }

    setLoading(true);
    try {
      await userService.deleteUser(user.user_id);
      alert('User deleted successfully!');
      onUserDeleted();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const canDelete = user.id !== currentUser.id;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <i className="fas fa-exclamation-triangle me-2 text-danger"></i>
            Delete User
          </h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          {!canDelete ? (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-circle me-2"></i>
              <strong>Cannot Delete:</strong> You cannot delete your own account!
            </div>
          ) : (
            <>
              <div className="alert alert-warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <strong>Warning:</strong> This action cannot be undone!
              </div>

              <p className="mb-3">
                Are you sure you want to delete the following user?
              </p>

              <div className="card bg-light">
                <div className="card-body">
                  <div className="row">
                    <div className="col-6">
                      <strong>Name:</strong>
                    </div>
                    <div className="col-6">
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-6">
                      <strong>Username:</strong>
                    </div>
                    <div className="col-6">
                      {user.username}
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-6">
                      <strong>Email:</strong>
                    </div>
                    <div className="col-6">
                      {user.email}
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-6">
                      <strong>Role:</strong>
                    </div>
                    <div className="col-6">
                      <span className="badge badge-primary">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-danger">
                <strong>Note:</strong> All associated data for this user will be permanently deleted.
              </p>
            </>
          )}
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
          {canDelete && (
            <button 
              type="button" 
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Deleting...
                </>
              ) : (
                <>
                  <i className="fas fa-trash me-2"></i>
                  Delete User
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;