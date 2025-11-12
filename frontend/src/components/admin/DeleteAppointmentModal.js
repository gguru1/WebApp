// components/admin/DeleteAppointmentModal.js - Delete Appointment Modal

import React, { useState } from 'react';
import appointmentService from '../../services/appointmentService';
import { formatDateShort, formatTime } from '../../utils/helpers';

const DeleteAppointmentModal = ({ appointment, onClose, onAppointmentDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await appointmentService.deleteAppointment(appointment.appointment_id);
      alert('Appointment deleted successfully!');
      onAppointmentDeleted();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert(error.message || 'Failed to delete appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <i className="fas fa-exclamation-triangle me-2 text-danger"></i>
            Delete Appointment
          </h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="alert alert-warning">
            <i className="fas fa-exclamation-triangle me-2"></i>
            <strong>Warning:</strong> This action cannot be undone!
          </div>

          <p className="mb-3">
            Are you sure you want to delete the following appointment?
          </p>

          <div className="card bg-light">
            <div className="card-body">
              <div className="row mt-2">
                <div className="col-6">
                  <strong>Date:</strong>
                </div>
                <div className="col-6">
                  {formatDateShort(appointment.date)}
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-6">
                  <strong>Time:</strong>
                </div>
                <div className="col-6">
                  {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-6">
                  <strong>Patient:</strong>
                </div>
                <div className="col-6">
                  {appointment.patient?.first_name} {appointment.patient?.last_name}
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-6">
                  <strong>Doctor:</strong>
                </div>
                <div className="col-6">
                  Dr. {appointment.doctor?.first_name} {appointment.doctor?.last_name}
                </div>
              </div>
              {appointment.reason && (
                <div className="row mt-2">
                  <div className="col-6">
                    <strong>Reason:</strong>
                  </div>
                  <div className="col-6">
                    {appointment.reason}
                  </div>
                </div>
              )}
              <div className="row mt-2">
                <div className="col-6">
                  <strong>Status:</strong>
                </div>
                <div className="col-6">
                  <span className="badge badge-primary">
                    {appointment.status}
                  </span>
                </div>
              </div>
            </div>
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
            type="button" 
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Deleting...
              </>
            ) : (
              <>
                <i className="fas fa-trash me-2"></i>
                Delete Appointment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAppointmentModal;