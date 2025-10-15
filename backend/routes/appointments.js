// routes/appointments.js - Appointment Routes

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
    createAppointment,
    updateAppointment,
    cancelAppointment
} = require('../controllers/appointmentController');

// Public routes (none - all require authentication)

// Protected routes - require authentication
// Special routes (must come before /:id route)
router.get('/today', protect, getTodayAppointments);
router.get('/upcoming', protect, getUpcomingAppointments);
router.get('/history', protect, getAppointmentHistory);
router.get('/patient/:patientId', protect, getPatientAppointments);
router.get('/doctor/:doctorId', protect, getDoctorAppointments);

// CRUD routes
router.get('/', protect, authorize('admin'), getAllAppointments);
router.get('/:id', protect, getAppointment);
router.post('/', protect, authorize('admin'), createAppointment);
router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, cancelAppointment);

module.exports = router;