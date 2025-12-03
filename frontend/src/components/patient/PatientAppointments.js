// components/patient/PatientAppointments.js

import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/appointmentService';
import authService from '../../services/authService';
import { formatDateShort, formatTime } from '../../utils/helpers';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      console.log('Loading patient appointments for user:', currentUser.user_id || currentUser.id);
      const data = await appointmentService.getPatientAppointments(currentUser.user_id || currentUser.id);
      const appointmentsList = data.appointments || data || [];
      console.log('Patient appointments loaded:', appointmentsList);
      setAppointments(appointmentsList);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await appointmentService.cancelAppointment(id);
      alert('Appointment cancelled successfully!');
      loadAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment');
    }
  };

  const upcomingAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    return aptDate >= today && apt.status !== 'cancelled';
  });

  const pastAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    return aptDate < today || apt.status === 'cancelled' || apt.status === 'completed';
  });

  if (loading) {
    return <div className="text-center py-5">
      <div className="spinner-border text-primary"></div>
    </div>;
  }

  return (
    <>
      <div className="page-header">
        <h2>My Appointments</h2>
        <p>View and manage your appointments</p>
      </div>

      <div className="mb-4">
        <h4>Upcoming Appointments</h4>
        {upcomingAppointments.length === 0 ? (
          <div className="card text-center py-5">
            <div className="card-body">
              <h5>No upcoming appointments</h5>
              <div className="alert alert-info mt-3">
                <strong>Note:</strong> To book an appointment, please contact the clinic clerk or admin.
              </div>
            </div>
          </div>
        ) : (
          upcomingAppointments.map((appointment) => (
            <div key={appointment.appointment_id} className="appointment-card">
              <div className="row align-items-center">
                <div className="col-md-3">
                  <div className="appointment-time">
                    {formatTime(appointment.start_time)}
                  </div>
                  <div className="text-muted">
                    {formatDateShort(appointment.date)}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="appointment-patient">
                    Dr. {appointment.doctor?.first_name} {appointment.doctor?.last_name}
                  </div>
                  <div className="text-muted">
                    {appointment.reason || 'General Consultation'}
                  </div>
                </div>

                <div className="col-md-2">
                  <span className={`appointment-status status-${appointment.status || 'scheduled'}`}>
                    {appointment.status || 'scheduled'}
                  </span>
                </div>

                <div className="col-md-3 text-end">
                  {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleCancelAppointment(appointment.appointment_id)}
                    >
                      <i className="fas fa-times"></i> Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div>
        <h4>Past & Cannel Appointments</h4>
        {pastAppointments.length === 0 ? (
          <div className="card text-center py-4">
            <div className="card-body">
              <p className="text-muted">No past appointments</p>
            </div>
          </div>
        ) : (
          pastAppointments.map((appointment) => (
            <div key={appointment.appointment_id} className="appointment-card" style={{opacity: 0.7}}>
              <div className="row align-items-center">
                <div className="col-md-3">
                  <div className="text-muted">
                    {formatDateShort(appointment.date)} at {formatTime(appointment.start_time)}
                  </div>
                </div>

                <div className="col-md-5">
                  <div>
                    Dr. {appointment.doctor?.first_name} {appointment.doctor?.last_name}
                  </div>
                  <div className="text-muted">
                    {appointment.reason || 'General Consultation'}
                  </div>
                </div>

                <div className="col-md-4 text-end">
                  <span className={`appointment-status status-${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default PatientAppointments;