// services/appointmentService.js - Appointment CRUD operations service

import api from './api';

const appointmentService = {
  // Get all appointments
  getAllAppointments: async () => {
    try {
      const response = await api.get('/appointments');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch appointments' };
    }
  },

  // Get appointment by ID
  getAppointmentById: async (id) => {
    try {
      const response = await api.get(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch appointment' };
    }
  },

  // Create new appointment
  createAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create appointment' };
    }
  },

  // Update appointment
  updateAppointment: async (id, appointmentData) => {
    try {
      const response = await api.put(`/appointments/${id}`, appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update appointment' };
    }
  },

  // Delete appointment (permanent - admin only)
  deleteAppointment: async (id) => {
    try {
      const response = await api.delete(`/appointments/${id}/permanent`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete appointment' };
    }
  },

  // Get appointments by patient ID
  getPatientAppointments: async (patientId) => {
    try {
      const response = await api.get(`/appointments/patient/${patientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch patient appointments' };
    }
  },

  // Get appointments by doctor ID
  getDoctorAppointments: async (doctorId) => {
    try {
      const response = await api.get(`/appointments/doctor/${doctorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch doctor appointments' };
    }
  },

  // Get appointments by date range
  getAppointmentsByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get('/appointments/date-range', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch appointments by date' };
    }
  },

  // Search appointments
  searchAppointments: async (searchTerm) => {
    try {
      const response = await api.get('/appointments/search', {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search appointments' };
    }
  },

  // Cancel appointment
  cancelAppointment: async (id) => {
    try {
      const response = await api.put(`/appointments/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel appointment' };
    }
  }
};

export default appointmentService;