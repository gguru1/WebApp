// middleware/auth.js - JWT Authentication Middleware for PostgreSQL

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route. Please login.'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token (exclude password)
        req.user = await User.findOne({
            where: { user_id: decoded.userId },
            attributes: { exclude: ['password'] }
        });

        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed',
            error: error.message
        });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

// Optional: Check if user owns the resource or is admin
exports.checkOwnership = (resourceUserIdField = 'user_id') => {
    return (req, res, next) => {
        // Admin can access all resources
        if (req.user.role === 'admin') {
            return next();
        }

        // Check if user owns the resource
        const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
        
        if (resourceUserId && parseInt(resourceUserId) !== req.user.user_id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this resource'
            });
        }

        next();
    };
};