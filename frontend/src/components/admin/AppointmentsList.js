// components/admin/AppointmentsList.js - Admin Appointments Management

import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/appointmentService';
import userService from '../../services/userService';
import { formatDateShort, formatTime, getStatusBadgeColor } from '../../utils/helpers';
import CreateAppointmentModal from './CreateAppointmentModal';
import EditAppointmentModal from './EditAppointmentModal';
import DeleteAppointmentModal from './DeleteAppointmentModal';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, statusFilter, appointments]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      console.log('Loading all appointments...');
      const data = await appointmentService.getAllAppointments();
      const appointmentsList = data.appointments || data || [];
      console.log('Loaded appointments count:', appointmentsList.length);
      console.log('Appointments:', appointmentsList);
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

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.patient?.first_name?.toLowerCase().includes(term) ||
        apt.patient?.last_name?.toLowerCase().includes(term) ||
        apt.doctor?.first_name?.toLowerCase().includes(term) ||
        apt.doctor?.last_name?.toLowerCase().includes(term) ||
        apt.reason?.toLowerCase().includes(term)
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleCreateAppointment = () => {
    setShowCreateModal(true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };

  const handleDeleteAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteModal(true);
  };

  const handleAppointmentCreated = () => {
    setShowCreateModal(false);
    loadAppointments();
  };

  const handleAppointmentUpdated = () => {
    setShowEditModal(false);
    setSelectedAppointment(null);
    loadAppointments();
  };

  const handleAppointmentDeleted = () => {
    setShowDeleteModal(false);
    setSelectedAppointment(null);
    loadAppointments();
  };

  if (loading) {
    return <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status"></div>
    </div>;
  }

  return (
    <>
      <div className="page-header">
        <h2>Appointments Management</h2>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">Dashboard</li>
            <li className="breadcrumb-item active">Appointments</li>
          </ol>
        </nav>
      </div>

      <div className="data-table-container">
        <div className="table-header">
          <h3>All Appointments</h3>
          <div className="table-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
              />
              <i className="fas fa-search"></i>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
              style={{ width: '150px' }}
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
              <option value="no-show">No Show</option>
            </select>

            <button className="btn btn-primary" onClick={handleCreateAppointment}>
              <i className="fas fa-plus me-2"></i>
              New Appointment
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No appointments found
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.appointment_id}>
                    <td>{formatDateShort(appointment.date)}</td>
                    <td>
                      {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                    </td>
                    <td>
                      {appointment.patient?.first_name} {appointment.patient?.last_name}
                    </td>
                    <td>
                      Dr. {appointment.doctor?.first_name} {appointment.doctor?.last_name}
                    </td>
                    <td>{appointment.reason || 'General Consultation'}</td>
                    <td>
                      <span className={`appointment-status status-${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => handleEditAppointment(appointment)}
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteAppointment(appointment)}
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
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

      {showCreateModal && (
        <CreateAppointmentModal
          onClose={() => setShowCreateModal(false)}
          onAppointmentCreated={handleAppointmentCreated}
        />
      )}

      {showEditModal && selectedAppointment && (
        <EditAppointmentModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAppointment(null);
          }}
          onAppointmentUpdated={handleAppointmentUpdated}
        />
      )}

      {showDeleteModal && selectedAppointment && (
        <DeleteAppointmentModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedAppointment(null);
          }}
          onAppointmentDeleted={handleAppointmentDeleted}
        />
      )}
    </>
  );
};

export default AppointmentsList;