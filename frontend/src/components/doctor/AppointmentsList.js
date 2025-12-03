// components/doctor/AppointmentsList.js

import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/appointmentService';
import authService from '../../services/authService';
import { formatDateShort, formatTime } from '../../utils/helpers';
import AppointmentDetailModal from './AppointmentDetailModal';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('today');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
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
      const data = await appointmentService.getDoctorAppointments(currentUser.user_id || currentUser.id);
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
    } else if (filter === 'past') {
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.date);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate < today;
      });
    }

    setFilteredAppointments(filtered);
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
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
        <p>View your patient appointments</p>
      </div>

      <div className="filter-tabs">
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
        <button 
          className={`filter-tab ${filter === 'past' ? 'active' : ''}`}
          onClick={() => setFilter('past')}
        >
          Past
        </button>
      </div>

      <div className="data-table-container">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Patient Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No appointments found
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.appointment_id}>
                    <td>{formatDateShort(appointment.date)}</td>
                    <td>{formatTime(appointment.start_time)}</td>
                    <td>{formatTime(appointment.end_time)}</td>
                    <td>
                      {appointment.patient?.first_name} {appointment.patient?.last_name}
                    </td>
                    <td>
                      <span className={`appointment-status status-${appointment.status || 'scheduled'}`}>
                        {appointment.status || 'scheduled'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-info"
                        onClick={() => handleViewDetails(appointment)}
                      >
                        <i className="fas fa-eye me-1"></i> View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-muted">
          Showing {filteredAppointments.length} of {appointments.length} appointments
        </div>
      </div>

      {showDetailModal && selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedAppointment(null);
          }}
        />
      )}
    </>
  );
};

export default AppointmentsList;