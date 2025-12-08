// seed.js - Seeding only Admin user

const dotenv = require('dotenv');
dotenv.config();

const { sequelize } = require('./config/db');
const User = require('./models/User');
const Appointment = require('./models/Appointment');

// Only admin user data
const adminData = {
    first_name: 'Admin',
    last_name: 'User',
    username: 'admin',
    email: 'admin@ug.edu.gh',
    password: 'admin123',
    role: 'admin'
};

const seedDatabase = async () => {
    try {
        console.log('Starting database seeding...');

        await sequelize.authenticate();
        console.log('Connected to Supabase PostgreSQL');

        // Drop and recreate tables
        await sequelize.sync({ force: true });
        console.log('Database tables created');

        console.log('Creating admin user...');
        
        // Create admin user with individual hooks for password hashing
        const admin = await User.create(adminData, {
            individualHooks: true
        });
        console.log(`Created admin user: ${admin.username}`);

        console.log('\nDatabase seeding completed successfully!');
        console.log('\nAdmin Credentials:');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('\nNote: All patients, doctors, and appointments should be created through the admin dashboard.');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
