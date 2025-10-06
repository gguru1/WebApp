// config/db.js - Supabase PostgreSQL Database Connection using Sequelize

const { Sequelize } = require('sequelize');

// Initialize Sequelize with Supabase PostgreSQL using connection string
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Required for Supabase
        }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: true,
        underscored: true, // Use snake_case for automatically added attributes
        freezeTableName: true // Prevent pluralization of table names
    }
});

// Test database connection
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(' Supabase PostgreSQL Database Connected Successfully');
        console.log(' Connection: Supabase Cloud Database');
        
        // Sync all models (creates tables if they don't exist)
        // IMPORTANT: Use { alter: true } in development only
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log(' All models synchronized with database');
        }
        
    } catch (error) {
        console.error(' Unable to connect to Supabase PostgreSQL:', error.message);
        console.error(' Check your DATABASE_URL in .env file');
        process.exit(1);
    }
};

// Export sequelize instance and connectDB function
module.exports = { sequelize, connectDB };