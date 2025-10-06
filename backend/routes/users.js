// routes/users.js - User Management Routes for PostgreSQL

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
        
        const users = await User.findAll({
            where: { role },
            attributes: { exclude: ['password'] }
        });
        
        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
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
        
        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ username }, { email }]
            }
        });
        
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this username or email already exists'
            });
        }
        
        // Create user
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
        res.status(400).json({
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
        res.status(400).json({
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
        
        await user.destroy();
        
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
});

module.exports = router;