import React from "react";

const AppointmentCard = ({ appointment, onCancel }) => {
  return (
    <div className="card shadow-sm border-0 mb-3">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title mb-1 text-info">
            Appointment with Dr. {appointment.doctorName}
          </h5>
          <p className="card-text mb-1">
            <strong>Date:</strong> {appointment.date} &nbsp; | &nbsp;
            <strong>Time:</strong> {appointment.start_time} - {appointment.end_time}
          </p>
          <p className="card-text text-muted mb-0">
            <strong>Reason:</strong> {appointment.reason}
          </p>
        </div>
        <button
          onClick={() => onCancel(appointment)}
          className="btn btn-outline-danger btn-sm"
        >
          <i className="fas fa-times me-1"></i> Cancel
        </button>
      </div>
    </div>
  );
};

export default AppointmentCard;