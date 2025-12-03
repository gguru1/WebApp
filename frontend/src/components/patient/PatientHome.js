// components/patient/PatientHome.js

import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/appointmentService';
import authService from '../../services/authService';
import { formatDateShort, formatTime } from '../../utils/helpers';

const PatientHome = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadUpcomingAppointments();
  }, []);

  const loadUpcomingAppointments = async () => {
    try {
      setLoading(true);
      console.log('Loading upcoming appointments for user:', currentUser.user_id || currentUser.id);
      const data = await appointmentService.getPatientAppointments(currentUser.user_id || currentUser.id);
      const appointments = data.appointments || data || [];
      console.log('Upcoming appointments loaded:', appointments);
      
      const upcoming = appointments
        .filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate >= new Date() && apt.status !== 'cancelled';
        })
        .slice(0, 3);
      
      setUpcomingAppointments(upcoming);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setUpcomingAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>Welcome, {currentUser?.first_name || currentUser?.firstName}!</h2>
        <p>Your health dashboard</p>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="stat-card info">
            <div className="stat-card-title">Upcoming</div>
            <div className="stat-card-value">{upcomingAppointments.length}</div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
               
                Upcoming Appointments
              </h5>
              
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary"></div>
                </div>
              ) : upcomingAppointments.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No upcoming appointments</p>
                  <div className="alert alert-info">
                    To book an appointment, please contact the clinic clerk or admin.
                  </div>
                </div>
              ) : (
                upcomingAppointments.map((apt) => (
                  <div key={apt.appointment_id} className="appointment-card mb-3">
                    <div className="row align-items-center">
                      <div className="col-md-4">
                        <strong>{formatDateShort(apt.date)}</strong>
                        <div className="text-muted">{formatTime(apt.start_time)}</div>
                      </div>
                      <div className="col-md-8">
                        <div>Dr. {apt.doctor?.first_name} {apt.doctor?.last_name}</div>
                        <div className="text-muted">{apt.reason || 'General Consultation'}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {upcomingAppointments.length > 0 && (
                <div className="text-center mt-3">
                  <a href="/patient/appointments" className="btn btn-outline-primary">
                    View All Appointments
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                Quick Actions
              </h5>
              
              <div className="alert alert-info mb-3">
                <strong>Book Appointment:</strong> Contact clinic Admin.
              </div>
              
              <div className="d-grid gap-2">
                <a href="/patient/appointments" className="btn btn-outline-primary">
                  My History
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientHome;