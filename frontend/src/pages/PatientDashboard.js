import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import PatientLayout from "../components/patient/PatientLayout";
import AppointmentCard from "../components/patient/AppointmentCard";
import CancelAppointmentModal from "../components/patient/CancelAppointmentModal";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = authService.getToken();
      // Use the upcoming appointments endpoint for patients
      const response = await fetch('/api/appointments/upcoming', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      
      // Transform the API response to match the component's expected format
      const transformedAppointments = data.appointments.map(appt => ({
        id: appt.appointment_id,
        doctorName: `Dr. ${appt.doctor.first_name} ${appt.doctor.last_name}`,
        date: appt.date,
        start_time: appt.start_time,
        end_time: appt.end_time,
        reason: appt.reason || 'General Consultation',
        status: appt.status
      }));
      
      setAppointments(transformedAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Unable to load appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      const token = authService.getToken();
      // Use DELETE endpoint which changes status to 'cancelled'
      const response = await fetch(`/api/appointments/${selectedAppointment.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel appointment');
      }

      const data = await response.json();
      
      // Remove the cancelled appointment from state
      setAppointments((prev) =>
        prev.filter((appt) => appt.id !== selectedAppointment.id)
      );
      
      setShowModal(false);
      setSelectedAppointment(null);
      
      // Optional: Show success message
      console.log(data.message);
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert(err.message || 'Unable to cancel appointment. Please try again.');
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  if (loading) {
    return (
      <PatientLayout>
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your appointments...</p>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      {/* Header Section */}
      <div className="bg-info text-white rounded shadow-sm p-4 mb-4">
        <h2 className="mb-2">
          <i className="fas fa-user me-2"></i>
          Welcome, {user?.firstName || user?.first_name || user?.username || "Patient"}
        </h2>
        <p className="mb-0">
          Here you can manage your upcoming appointments and account settings.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

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