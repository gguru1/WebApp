// components/admin/CreateAppointmentModal.js - Create Appointment Modal

import React, { useState, useEffect } from 'react';
import appointmentService from '../../services/appointmentService';
import userService from '../../services/userService';
import { validateAppointmentForm } from '../../utils/validators';

const CreateAppointmentModal = ({ onClose, onAppointmentCreated }) => {
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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

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
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateAppointmentForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      // Convert field names to match backend (snake_case)
      const appointmentData = {
        patient_id: parseInt(formData.patientId),
        doctor_id: parseInt(formData.doctorId),
        date: formData.date,
        start_time: formData.startTime,
        end_time: formData.endTime,
        reason: formData.reason,
        status: formData.status
      };

      await appointmentService.createAppointment(appointmentData);
      alert('Appointment created successfully!');
      onAppointmentCreated();
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert(error.message || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <i className="fas fa-calendar-plus me-2"></i>
            Create New Appointment
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
                  <label>
                    Patient <span className="required">*</span>
                  </label>
                  <select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    className={`form-control ${errors.patientId ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.user_id} value={patient.user_id}>
                        {patient.first_name} {patient.last_name}
                      </option>
                    ))}
                  </select>
                  {errors.patientId && (
                    <div className="invalid-feedback">{errors.patientId}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Doctor <span className="required">*</span>
                  </label>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    className={`form-control ${errors.doctorId ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.user_id} value={doctor.user_id}>
                        Dr. {doctor.first_name} {doctor.last_name}
                      </option>
                    ))}
                  </select>
                  {errors.doctorId && (
                    <div className="invalid-feedback">{errors.doctorId}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>
                Date <span className="required">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.date && (
                <div className="invalid-feedback">{errors.date}</div>
              )}
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Start Time <span className="required">*</span>
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className={`form-control ${errors.startTime ? 'is-invalid' : ''}`}
                  />
                  {errors.startTime && (
                    <div className="invalid-feedback">{errors.startTime}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    End Time <span className="required">*</span>
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className={`form-control ${errors.endTime ? 'is-invalid' : ''}`}
                  />
                  {errors.endTime && (
                    <div className="invalid-feedback">{errors.endTime}</div>
                  )}
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
                placeholder="Enter reason for appointment"
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
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>
                  Create Appointment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointmentModal;