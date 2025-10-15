// controllers/appointmentController.js - Appointment Management Controller

const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { Op } = require('sequelize');

// @desc    Get all appointments (admin only)
// @route   GET /api/appointments
// @access  Private/Admin
exports.getAllAppointments = async (req, res) => {
    try {
        const { status, date, doctorId, patientId } = req.query;
        
        // Build query filters
        const whereClause = {};
        if (status) whereClause.status = status;
        if (date) whereClause.date = date;
        if (doctorId) whereClause.doctor_id = doctorId;
        if (patientId) whereClause.patient_id = patientId;

        const appointments = await Appointment.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                },
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                }
            ],
            order: [['date', 'DESC'], ['start_time', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: appointments.length,
            appointments
        });
    } catch (error) {
        console.error('Get all appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
};

// @desc    Get patient appointments
// @route   GET /api/appointments/patient/:patientId
// @access  Private
exports.getPatientAppointments = async (req, res) => {
    try {
        const { patientId } = req.params;
        
        // Check if user is accessing their own appointments or is admin
        if (req.user.role !== 'admin' && req.user.user_id !== parseInt(patientId)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access these appointments'
            });
        }

        const appointments = await Appointment.findAll({
            where: { patient_id: patientId },
            include: [
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                }
            ],
            order: [['date', 'DESC'], ['start_time', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: appointments.length,
            appointments
        });
    } catch (error) {
        console.error('Get patient appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching patient appointments',
            error: error.message
        });
    }
};

// @desc    Get doctor appointments
// @route   GET /api/appointments/doctor/:doctorId
// @access  Private
exports.getDoctorAppointments = async (req, res) => {
    try {
        const { doctorId } = req.params;
        
        // Check if user is accessing their own appointments or is admin
        if (req.user.role !== 'admin' && req.user.user_id !== parseInt(doctorId)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access these appointments'
            });
        }

        const appointments = await Appointment.findAll({
            where: { doctor_id: doctorId },
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                }
            ],
            order: [['date', 'DESC'], ['start_time', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: appointments.length,
            appointments
        });
    } catch (error) {
        console.error('Get doctor appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching doctor appointments',
            error: error.message
        });
    }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            where: { appointment_id: req.params.id },
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                },
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                }
            ]
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check authorization
        const isAuthorized = 
            req.user.role === 'admin' ||
            req.user.user_id === appointment.patient_id ||
            req.user.user_id === appointment.doctor_id;

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this appointment'
            });
        }

        res.status(200).json({
            success: true,
            appointment
        });
    } catch (error) {
        console.error('Get appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointment',
            error: error.message
        });
    }
};

// @desc    Get today's appointments
// @route   GET /api/appointments/today
// @access  Private
exports.getTodayAppointments = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        const whereClause = { date: today };
        
        // If user is patient or doctor, filter by their ID
        if (req.user.role === 'patient') {
            whereClause.patient_id = req.user.user_id;
        } else if (req.user.role === 'doctor') {
            whereClause.doctor_id = req.user.user_id;
        }

        const appointments = await Appointment.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                },
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                }
            ],
            order: [['start_time', 'ASC']]
        });

        res.status(200).json({
            success: true,
            count: appointments.length,
            appointments
        });
    } catch (error) {
        console.error('Get today appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching today\'s appointments',
            error: error.message
        });
    }
};

// @desc    Get upcoming appointments
// @route   GET /api/appointments/upcoming
// @access  Private
exports.getUpcomingAppointments = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        const whereClause = {
            date: { [Op.gte]: today },
            status: 'scheduled'
        };
        
        // If user is patient or doctor, filter by their ID
        if (req.user.role === 'patient') {
            whereClause.patient_id = req.user.user_id;
        } else if (req.user.role === 'doctor') {
            whereClause.doctor_id = req.user.user_id;
        }

        const appointments = await Appointment.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                },
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                }
            ],
            order: [['date', 'ASC'], ['start_time', 'ASC']],
            limit: 10
        });

        res.status(200).json({
            success: true,
            count: appointments.length,
            appointments
        });
    } catch (error) {
        console.error('Get upcoming appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching upcoming appointments',
            error: error.message
        });
    }
};

// @desc    Get appointment history
// @route   GET /api/appointments/history
// @access  Private
exports.getAppointmentHistory = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        const whereClause = {
            [Op.or]: [
                { date: { [Op.lt]: today } },
                { status: { [Op.in]: ['completed', 'cancelled', 'no-show'] } }
            ]
        };
        
        // If user is patient or doctor, filter by their ID
        if (req.user.role === 'patient') {
            whereClause.patient_id = req.user.user_id;
        } else if (req.user.role === 'doctor') {
            whereClause.doctor_id = req.user.user_id;
        }

        const appointments = await Appointment.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                },
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                }
            ],
            order: [['date', 'DESC'], ['start_time', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: appointments.length,
            appointments
        });
    } catch (error) {
        console.error('Get appointment history error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointment history',
            error: error.message
        });
    }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private/Admin
exports.createAppointment = async (req, res) => {
    try {
        const { date, start_time, end_time, patient_id, doctor_id, reason, notes } = req.body;

        // Validate required fields
        if (!date || !start_time || !end_time || !patient_id || !doctor_id) {
            return res.status(400).json({
                success: false,
                message: 'Please provide date, start time, end time, patient, and doctor'
            });
        }

        // Validate patient exists and is a patient
        const patient = await User.findOne({
            where: { user_id: patient_id, role: 'patient' }
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        // Validate doctor exists and is a doctor
        const doctor = await User.findOne({
            where: { user_id: doctor_id, role: 'doctor' }
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Check for time conflicts with existing appointments
        const conflict = await Appointment.findOne({
            where: {
                doctor_id,
                date,
                status: 'scheduled',
                [Op.or]: [
                    {
                        start_time: { [Op.between]: [start_time, end_time] }
                    },
                    {
                        end_time: { [Op.between]: [start_time, end_time] }
                    },
                    {
                        [Op.and]: [
                            { start_time: { [Op.lte]: start_time } },
                            { end_time: { [Op.gte]: end_time } }
                        ]
                    }
                ]
            }
        });

        if (conflict) {
            return res.status(400).json({
                success: false,
                message: 'Doctor already has an appointment at this time'
            });
        }

        // Create appointment
        const appointment = await Appointment.create({
            date,
            start_time,
            end_time,
            patient_id,
            doctor_id,
            reason: reason || null,
            notes: notes || null,
            status: 'scheduled'
        });

        // Fetch the created appointment with user details
        const createdAppointment = await Appointment.findOne({
            where: { appointment_id: appointment.appointment_id },
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                },
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            appointment: createdAppointment
        });
    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating appointment',
            error: error.message
        });
    }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
    try {
        const { date, start_time, end_time, status, reason, notes } = req.body;

        const appointment = await Appointment.findOne({
            where: { appointment_id: req.params.id }
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check authorization
        const isAuthorized = 
            req.user.role === 'admin' ||
            req.user.user_id === appointment.doctor_id;

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this appointment'
            });
        }

        // Update fields
        if (date) appointment.date = date;
        if (start_time) appointment.start_time = start_time;
        if (end_time) appointment.end_time = end_time;
        if (status) appointment.status = status;
        if (reason) appointment.reason = reason;
        if (notes !== undefined) appointment.notes = notes;

        await appointment.save();

        // Fetch updated appointment with user details
        const updatedAppointment = await Appointment.findOne({
            where: { appointment_id: appointment.appointment_id },
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                },
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: 'Appointment updated successfully',
            appointment: updatedAppointment
        });
    } catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating appointment',
            error: error.message
        });
    }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            where: { appointment_id: req.params.id }
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check authorization
        const isAuthorized = 
            req.user.role === 'admin' ||
            req.user.user_id === appointment.patient_id ||
            req.user.user_id === appointment.doctor_id;

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this appointment'
            });
        }

        // Update status to cancelled instead of deleting
        appointment.status = 'cancelled';
        await appointment.save();

        res.status(200).json({
            success: true,
            message: 'Appointment cancelled successfully',
            appointment
        });
    } catch (error) {
        console.error('Cancel appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling appointment',
            error: error.message
        });
    }
};