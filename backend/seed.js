// seed.js - Corrected version (no manual hashing)

const dotenv = require('dotenv');
dotenv.config();

const { sequelize } = require('./config/db');
const User = require('./models/User');
const Appointment = require('./models/Appointment');

// Sample users data (plain text passwords - will be hashed by model hook)
const usersData = [
    {
        first_name: 'Admin',
        last_name: 'User',
        username: 'admin',
        email: 'admin@ug.edu.gh',
        password: 'admin123',
        role: 'admin'
    },
    {
        first_name: 'John',
        last_name: 'Doe',
        username: 'patient1',
        email: 'patient1@ug.edu.gh',
        password: 'patient123',
        role: 'patient'
    },
    {
        first_name: 'Jane',
        last_name: 'Smith',
        username: 'patient2',
        email: 'patient2@ug.edu.gh',
        password: 'patient123',
        role: 'patient'
    },
    {
        first_name: 'Michael',
        last_name: 'Brown',
        username: 'patient3',
        email: 'patient3@ug.edu.gh',
        password: 'patient123',
        role: 'patient'
    },
    {
        first_name: 'Dr. David',
        last_name: 'Wilson',
        username: 'doctor1',
        email: 'doctor1@ug.edu.gh',
        password: 'doctor123',
        role: 'doctor'
    },
    {
        first_name: 'Dr. Sarah',
        last_name: 'Johnson',
        username: 'doctor2',
        email: 'doctor2@ug.edu.gh',
        password: 'doctor123',
        role: 'doctor'
    }
];

const appointmentsData = [
    {
        date: '2025-10-10',
        start_time: '09:00',
        end_time: '09:30',
        patient_id: 2,
        doctor_id: 5,
        status: 'scheduled',
        reason: 'Regular checkup'
    },
    {
        date: '2025-10-10',
        start_time: '10:00',
        end_time: '10:30',
        patient_id: 3,
        doctor_id: 5,
        status: 'scheduled',
        reason: 'Follow-up consultation'
    },
    {
        date: '2025-10-11',
        start_time: '14:00',
        end_time: '14:30',
        patient_id: 4,
        doctor_id: 6,
        status: 'scheduled',
        reason: 'Annual physical examination'
    },
    {
        date: '2025-10-08',
        start_time: '11:00',
        end_time: '11:30',
        patient_id: 2,
        doctor_id: 6,
        status: 'completed',
        reason: 'Flu symptoms',
        notes: 'Prescribed medication for flu'
    }
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        await sequelize.authenticate();
        console.log('✅ Connected to Supabase PostgreSQL');

        await sequelize.sync({ force: true });
        console.log('✅ Database tables created');

        console.log('👥 Creating users...');
        
        // Use bulkCreate with individualHooks to trigger beforeCreate hook
        // Passwords will be hashed by the beforeCreate hook
        const createdUsers = await User.bulkCreate(usersData, {
            individualHooks: true
        });
        console.log(`✅ Created ${createdUsers.length} users`);

        console.log('📅 Creating appointments...');
        const createdAppointments = await Appointment.bulkCreate(appointmentsData);
        console.log(`✅ Created ${createdAppointments.length} appointments`);

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📋 Demo Credentials:');
        console.log('Admin:    username: admin    password: admin123');
        console.log('Patient1: username: patient1 password: patient123');
        console.log('Patient2: username: patient2 password: patient123');
        console.log('Patient3: username: patient3 password: patient123');
        console.log('Doctor1:  username: doctor1  password: doctor123');
        console.log('Doctor2:  username: doctor2  password: doctor123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();