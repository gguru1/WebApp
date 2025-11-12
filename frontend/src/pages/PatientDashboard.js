import React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import PatientLayout from "../components/patient/PatientLayout";
import AppointmentCard from "../components/patient/AppointmentCard";
import CancelAppointmentModal from "../components/patient/CancelAppointmentModal";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  // Placeholder appointment data will be replaced with API data later
  const [appointments, setAppointments] = React.useState([
    {
      id: 1,
      doctorName: "Dr. Emily Carter",
      date: "2025-11-15",
      start_time: "9:30 AM",
      end_time: "10:00 AM",
      reason: "Follow-up Consultation",
    },
    {
      id: 2,
      doctorName: "Dr. James Wilson",
      date: "2025-12-02",
      start_time: "2:00 PM",
      end_time: "2:30 PM",
      reason: "Physical Therapy",
    },
  ]);

  const [selectedAppointment, setSelectedAppointment] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleConfirmCancel = () => {
    // TODO: connect with cancel API
    console.log("Cancelled appointment:", selectedAppointment);
    setAppointments((prev) =>
      prev.filter((appt) => appt.id !== selectedAppointment.id)
    );
    setShowModal(false);
  };

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <PatientLayout>
      {/* Header Section */}
      <div className="bg-info text-white rounded shadow-sm p-4 mb-4">
        <h2 className="mb-2">
          <i className="fas fa-user me-2"></i>
          Welcome, {user?.firstName || user?.username || "Patient"}
        </h2>
        <p className="mb-0">
          Here you can manage your upcoming appointments and account settings.
        </p>
      </div>

      {/* Dashboard Summary */}
      <div className="row text-center mb-4">
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <i className="fas fa-calendar-check fa-2x text-info mb-2"></i>
              <h5 className="card-title">Next Appointment</h5>
              <p className="card-text">
                {appointments.length > 0
                  ? `${appointments[0].date} with ${appointments[0].doctorName}`
                  : "No appointments scheduled"}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <i className="fas fa-list fa-2x text-info mb-2"></i>
              <h5 className="card-title">Upcoming Visits</h5>
              <p className="card-text">{appointments.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <i className="fas fa-user-cog fa-2x text-info mb-2"></i>
              <h5 className="card-title">Profile Settings</h5>
              <button
                onClick={() => navigate("/profile")}
                className="btn btn-info btn-sm text-white"
              >
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment List */}
      <h4 className="text-info mb-3">
        <i className="fas fa-calendar-day me-2"></i>
        Your Appointments
      </h4>

      {appointments.length > 0 ? (
        <div className="row">
          {appointments.map((appt) => (
            <div key={appt.id} className="col-md-6 mb-3">
              <AppointmentCard
                appointment={appt}
                onCancel={() => handleCancelClick(appt)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          You currently have no upcoming appointments.
        </div>
      )}

      {/* Cancel Modal */}
      <CancelAppointmentModal
        show={showModal}
        appointment={selectedAppointment}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmCancel}
      />
    </PatientLayout>
  );
};

export default PatientDashboard;