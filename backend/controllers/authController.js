// controllers/authController.js - Authentication Controller for PostgreSQL

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Op } = require('sequelize');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username and password'
            });
        }

        // Check if user exists (find by username or email)
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username.toLowerCase() },
                    { email: username.toLowerCase() }
                ]
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        user.last_login = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user.user_id);

        // Send response (exclude password)
        const userResponse = user.toSafeObject();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { user_id: req.user.user_id },
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Get user with password
        const user = await User.findOne({
            where: { user_id: req.user.user_id }
        });

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password (will be hashed by beforeUpdate hook)
        user.password = newPassword;
        await user.save();

        // Generate new token
        const token = generateToken(user.user_id);

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
            token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
};

// @desc    Logout user (client-side will clear token)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};