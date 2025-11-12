import React from "react";

const CancelAppointmentModal = ({ show, onClose, onConfirm, appointment }) => {
  if (!appointment) return null;

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: show ? "rgba(0,0,0,0.5)" : "transparent" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Cancel Appointment
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>
              Are you sure you want to cancel your appointment with{" "}
              <strong>Dr. {appointment.doctorName}</strong> on{" "}
              <strong>{appointment.date}</strong>?
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              No, Keep Appointment
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onConfirm(appointment)}
            >
              Yes, Cancel Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelAppointmentModal;