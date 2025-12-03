// components/doctor/AppointmentDetailModal.js

import React from 'react';
import { formatDateShort, formatTime } from '../../utils/helpers';

const AppointmentDetailModal = ({ appointment, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <i className="fas fa-calendar-alt me-2"></i>
            Appointment Details
          </h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="card bg-light">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-5">
                  <strong>Date:</strong>
                </div>
                <div className="col-7">
                  {formatDateShort(appointment.date)}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-5">
                  <strong>Start Time:</strong>
                </div>
                <div className="col-7">
                  {formatTime(appointment.start_time)}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-5">
                  <strong>End Time:</strong>
                </div>
                <div className="col-7">
                  {formatTime(appointment.end_time)}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-5">
                  <strong>Patient Name:</strong>
                </div>
                <div className="col-7">
                  {appointment.patient?.first_name} {appointment.patient?.last_name}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-5">
                  <strong>Patient Email:</strong>
                </div>
                <div className="col-7">
                  {appointment.patient?.email || 'N/A'}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-5">
                  <strong>Status:</strong>
                </div>
                <div className="col-7">
                  <span className={`appointment-status status-${appointment.status || 'scheduled'}`}>
                    {appointment.status || 'scheduled'}
                  </span>
                </div>
              </div>

              {appointment.reason && (
                <div className="row mb-3">
                  <div className="col-12">
                    <strong>Reason / Message:</strong>
                    <div className="mt-2 p-3" style={{background: 'white', borderRadius: '8px', border: '1px solid #dee2e6'}}>
                      {appointment.reason}
                    </div>
                  </div>
                </div>
              )}

              {appointment.notes && (
                <div className="row mb-3">
                  <div className="col-12">
                    <strong>Notes:</strong>
                    <div className="mt-2 p-3" style={{background: 'white', borderRadius: '8px', border: '1px solid #dee2e6'}}>
                      {appointment.notes}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailModal;