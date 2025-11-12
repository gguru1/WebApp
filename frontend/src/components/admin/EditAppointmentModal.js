// components/admin/EditAppointmentModal.js - Edit Appointment Modal

import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/appointmentService';
import userService from '../../services/userService';

const EditAppointmentModal = ({ appointment, onClose, onAppointmentUpdated }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    startTime: '',
    endTime: '',
    reason: '',
    status: 'scheduled'
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
    if (appointment) {
      setFormData({
        patientId: appointment.patient_id || '',
        doctorId: appointment.doctor_id || '',
        date: appointment.date || '',
        startTime: appointment.start_time || '',
        endTime: appointment.end_time || '',
        reason: appointment.reason || '',
        status: appointment.status || 'scheduled'
      });
    }
  }, [appointment]);

  const loadUsers = async () => {
    try {
      const patientsData = await userService.getUsersByRole('patient');
      const doctorsData = await userService.getUsersByRole('doctor');
      setPatients(patientsData.users || patientsData || []);
      setDoctors(doctorsData.users || doctorsData || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const appointmentData = {
        patient_id: parseInt(formData.patientId),
        doctor_id: parseInt(formData.doctorId),
        date: formData.date,
        start_time: formData.startTime,
        end_time: formData.endTime,
        reason: formData.reason,
        status: formData.status
      };

      await appointmentService.updateAppointment(appointment.appointment_id, appointmentData);
      alert('Appointment updated successfully!');
      onAppointmentUpdated();
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert(error.message || 'Failed to update appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <i className="fas fa-edit me-2"></i>
            Edit Appointment
          </h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Patient <span className="required">*</span></label>
                  <select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    className="form-control"
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.user_id} value={patient.user_id}>
                        {patient.first_name} {patient.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Doctor <span className="required">*</span></label>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    className="form-control"
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.user_id} value={doctor.user_id}>
                        Dr. {doctor.first_name} {doctor.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Date <span className="required">*</span></label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Start Time <span className="required">*</span></label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>End Time <span className="required">*</span></label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Reason / Notes</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="form-control"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control"
              >
                <option value="scheduled">Scheduled</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
                <option value="no-show">No Show</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>
                  Update Appointment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAppointmentModal;