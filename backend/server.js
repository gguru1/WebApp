// server.js - Main Express Server for UG HealthConnect with PostgreSQL

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Load environment variables
console.log('DATABASE_URL:', process.env.DATABASE_URL); // Add this test line

// Connect to PostgreSQL
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/appointments', require('./routes/appointments'));

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'UG HealthConnect API',
        version: '1.0.0',
        database: 'PostgreSQL',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users'
        }
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        database: 'PostgreSQL Connected'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(` Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    console.log(` API available at http://localhost:${PORT}/api`);
    console.log(` Database: PostgreSQL`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(' Unhandled Rejection:', err.message);
    // Close server & exit process
    server.close(() => process.exit(1));
});