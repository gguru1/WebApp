// models/User.js - User Model for PostgreSQL using Sequelize

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');

const User = sequelize.define('users', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'First name is required' }
        }
    },
    last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Last name is required' }
        }
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
            msg: 'Username already exists'
        },
        validate: {
            notEmpty: { msg: 'Username is required' },
            len: {
                args: [3, 50],
                msg: 'Username must be between 3 and 50 characters'
            }
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
            msg: 'Email already exists'
        },
        validate: {
            isEmail: { msg: 'Please provide a valid email' },
            notEmpty: { msg: 'Email is required' }
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Password is required' },
            len: {
                args: [6, 255],
                msg: 'Password must be at least 6 characters'
            }
        }
    },
    role: {
        type: DataTypes.ENUM('admin', 'patient', 'doctor'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['admin', 'patient', 'doctor']],
                msg: 'Role must be admin, patient, or doctor'
            }
        }
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true
    },
    last_password_change: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Hook: Hash password before creating user
User.beforeCreate(async (user) => {
    if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

// Hook: Hash password before updating if password was changed
User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.last_password_change = new Date();
    }
});

// Instance method: Compare password
User.prototype.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method: Get user without password
User.prototype.toSafeObject = function() {
    const user = this.toJSON();
    delete user.password;
    return user;
};

// Virtual: Full name
User.prototype.getFullName = function() {
    return `${this.first_name} ${this.last_name}`;
};

module.exports = User;