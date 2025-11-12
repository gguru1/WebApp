// components/doctor/AppointmentsList.js

import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/appointmentService';
import authService from '../../services/authService';
import { formatDateShort, formatTime } from '../../utils/helpers';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, today, week, month
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [filter, appointments]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getDoctorAppointments(currentUser.id);
      const appointmentsList = data.appointments || data || [];
      setAppointments(appointmentsList);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === 'today') {
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.date);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate.getTime() === today.getTime();
      });
    } else if (filter === 'week') {
      const weekLater = new Date(today);
      weekLater.setDate(today.getDate() + 7);
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= today && aptDate <= weekLater;
      });
    } else if (filter === 'month') {
      const monthLater = new Date(today);
      monthLater.setMonth(today.getMonth() + 1);
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= today && aptDate <= monthLater;
      });
    }

    setFilteredAppointments(filtered);
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await appointmentService.updateAppointment(id, { status });
      alert('Appointment status updated!');
      loadAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment');
    }
  };

  if (loading) {
    return <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status"></div>
    </div>;
  }

  return (
    <>
      <div className="page-header">
        <h2>My Appointments</h2>
        <p>Manage your patient appointments</p>
      </div>

      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({appointments.length})
        </button>
        <button 
          className={`filter-tab ${filter === 'today' ? 'active' : ''}`}
          onClick={() => setFilter('today')}
        >
          Today
        </button>
        <button 
          className={`filter-tab ${filter === 'week' ? 'active' : ''}`}
          onClick={() => setFilter('week')}
        >
          This Week
        </button>
        <button 
          className={`filter-tab ${filter === 'month' ? 'active' : ''}`}
          onClick={() => setFilter('month')}
        >
          This Month
        </button>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="card text-center py-5">
          <div className="card-body">
            <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
            <h5>No appointments found</h5>
            <p className="text-muted">No appointments match the selected filter</p>
          </div>
        </div>
      ) : (
        filteredAppointments.map((appointment) => (
          <div key={appointment.id} className="appointment-card">
            <div className="row align-items-center">
              <div className="col-md-3">
                <div className="appointment-time">
                  {formatTime(appointment.startTime)}
                </div>
                <div className="text-muted">
                  {formatDateShort(appointment.date)}
                </div>
              </div>

              <div className="col-md-4">
                <div className="appointment-patient">
                  <i className="fas fa-user me-2"></i>
                  {appointment.Patient?.firstName} {appointment.Patient?.lastName}
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
                {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                  <>
                    <button 
                      className="btn btn-sm btn-success me-2"
                      onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                    >
                      <i className="fas fa-check"></i> Confirm
                    </button>
                    <button 
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                    >
                      <i className="fas fa-check-double"></i> Complete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default AppointmentsList;