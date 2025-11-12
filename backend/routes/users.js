// routes/users.js - Fixed User Management Routes for PostgreSQL

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const { Op } = require('sequelize');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['user_id', 'ASC']]
        });
        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// @desc    Get users by role
// @route   GET /api/users/role/:role
// @access  Private/Admin
router.get('/role/:role', protect, authorize('admin'), async (req, res) => {
    try {
        const { role } = req.params;
        
        // Validate role
        if (!['admin', 'patient', 'doctor'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be admin, patient, or doctor'
            });
        }
        
        const users = await User.findAll({
            where: { role },
            attributes: { exclude: ['password'] },
            order: [['user_id', 'ASC']]
        });
        
        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Get users by role error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users by role',
            error: error.message
        });
    }
});

// @desc    Get single user by ID
// @route   GET /api/users/:userId
// @access  Private/Admin
router.get('/:userId', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findOne({
            where: { user_id: req.params.userId },
            attributes: { exclude: ['password'] }
        });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
});

// @desc    Create new user
// @route   POST /api/users
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const { first_name, last_name, username, email, password, role } = req.body;
        
        // Validate required fields
        if (!first_name || !last_name || !username || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: first_name, last_name, username, email, password, role'
            });
        }

        // Validate role
        if (!['admin', 'patient', 'doctor'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be admin, patient, or doctor'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Validate username length
        if (username.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Username must be at least 3 characters long'
            });
        }
        
        // Check if user already exists (username or email)
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username.toLowerCase() },
                    { email: email.toLowerCase() }
                ]
            }
        });
        
        if (existingUser) {
            if (existingUser.username === username.toLowerCase()) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already exists'
                });
            }
            if (existingUser.email === email.toLowerCase()) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
        }
        
        // Create user (password will be hashed by beforeCreate hook)
        const user = await User.create({
            first_name,
            last_name,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password,
            role
        });
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: user.toSafeObject()
        });
    } catch (error) {
        console.error('Create user error:', error);
        
        // Handle Sequelize validation errors
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors.map(e => e.message)
            });
        }
        
        // Handle unique constraint errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Username or email already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
});

// @desc    Update user
// @route   PUT /api/users/:userId
// @access  Private/Admin
router.put('/:userId', protect, authorize('admin'), async (req, res) => {
    try {
        const { first_name, last_name, email, role } = req.body;
        
        const user = await User.findOne({
            where: { user_id: req.params.userId }
        });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent updating username (it's unique and shouldn't change)
        // Prevent updating password through this route (use change-password)
        
        // Validate email if provided
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid email address'
                });
            }

            // Check if email already exists for another user
            const existingEmail = await User.findOne({
                where: {
                    email: email.toLowerCase(),
                    user_id: { [Op.ne]: req.params.userId }
                }
            });

            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
        }

        // Validate role if provided
        if (role && !['admin', 'patient', 'doctor'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be admin, patient, or doctor'
            });
        }
        
        // Update fields
        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (email) user.email = email.toLowerCase();
        if (role) user.role = role;
        
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: user.toSafeObject()
        });
    } catch (error) {
        console.error('Update user error:', error);
        
        // Handle Sequelize validation errors
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors.map(e => e.message)
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
});

// @desc    Delete user
// @route   DELETE /api/users/:userId
// @access  Private/Admin
router.delete('/:userId', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findOne({
            where: { user_id: req.params.userId }
        });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from deleting themselves
        if (user.user_id === req.user.user_id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        // Check if user has appointments
        const Appointment = require('../models/Appointment');
        const userAppointments = await Appointment.count({
            where: {
                [Op.or]: [
                    { patient_id: req.params.userId },
                    { doctor_id: req.params.userId }
                ]
            }
        });

        if (userAppointments > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete user. User has ${userAppointments} appointment(s). Please cancel or delete appointments first.`
            });
        }
        
        await user.destroy();
        
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
});

module.exports = router;