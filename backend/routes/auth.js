// routes/auth.js - Authentication Routes

const express = require('express');
const router = express.Router();
const { login, getMe, changePassword, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);
router.post('/logout', protect, logout);

module.exports = router;