// routes/appointments.js - Updated Appointment Routes - FIXED ORDER

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAllAppointments,
    getPatientAppointments,
    getDoctorAppointments,
    getAppointment,
    getTodayAppointments,
    getUpcomingAppointments,
    getAppointmentHistory,
    searchAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment
} = require('../controllers/appointmentController');

// Protected routes - require authentication
// Special routes (must come before /:id route)
router.get('/search', protect, authorize('admin'), searchAppointments);
router.get('/today', protect, getTodayAppointments);
router.get('/upcoming', protect, getUpcomingAppointments);
router.get('/history', protect, getAppointmentHistory);
router.get('/patient/:patientId', protect, getPatientAppointments);
router.get('/doctor/:doctorId', protect, getDoctorAppointments);

// CRUD routes
router.get('/', protect, authorize('admin'), getAllAppointments);
router.post('/', protect, authorize('admin'), createAppointment);
router.put('/:id', protect, updateAppointment);

// DELETE ROUTES - ORDER MATTERS!
// IMPORTANT: /permanent MUST come BEFORE /:id
router.delete('/:id/permanent', protect, authorize('admin'), deleteAppointment); // Hard delete (admin only) - MUST BE FIRST
router.delete('/:id', protect, cancelAppointment); // Soft delete (cancel) - MUST BE SECOND

// GET by ID - MUST come after all specific routes
router.get('/:id', protect, getAppointment);

module.exports = router;