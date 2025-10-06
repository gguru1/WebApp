// models/Appointment.js - Appointment Model for PostgreSQL using Sequelize

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Appointment = sequelize.define('appointments', {
    appointment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: { msg: 'Please provide a valid date' },
            notEmpty: { msg: 'Appointment date is required' }
        }
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Start time is required' }
        }
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'End time is required' }
        }
    },
    patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'cancelled', 'completed', 'no-show'),
        defaultValue: 'scheduled'
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    last_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'appointments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Hook: Update last_updated before save
Appointment.beforeSave(async (appointment) => {
    appointment.last_updated = new Date();
});

// Hook: Validate end time is after start time
Appointment.beforeValidate(async (appointment) => {
    if (appointment.start_time && appointment.end_time) {
        const start = appointment.start_time.split(':');
        const end = appointment.end_time.split(':');
        const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
        const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
        
        if (endMinutes <= startMinutes) {
            throw new Error('End time must be after start time');
        }
    }
});

// Define associations
Appointment.belongsTo(User, {
    as: 'patient',
    foreignKey: 'patient_id',
    targetKey: 'user_id'
});

Appointment.belongsTo(User, {
    as: 'doctor',
    foreignKey: 'doctor_id',
    targetKey: 'user_id'
});

User.hasMany(Appointment, {
    as: 'patientAppointments',
    foreignKey: 'patient_id',
    sourceKey: 'user_id'
});

User.hasMany(Appointment, {
    as: 'doctorAppointments',
    foreignKey: 'doctor_id',
    sourceKey: 'user_id'
});

module.exports = Appointment;