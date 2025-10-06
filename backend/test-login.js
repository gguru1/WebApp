const dotenv = require('dotenv');
dotenv.config(); // Load .env FIRST

const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/db');
const User = require('./models/User');

async function testLogin() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database');

        // Find the admin user
        const user = await User.findOne({ where: { username: 'admin' } });
        
        if (!user) {
            console.log('❌ User not found!');
            return;
        }

        console.log('✅ User found:', user.username);
        console.log('📝 Stored password:', user.password);
        console.log('📝 Password length:', user.password.length);
        console.log('📝 Is bcrypt hash?', user.password.startsWith('$2'));

        // Test password comparison
        console.log('\n--- Testing comparePassword method ---');
        const isMatch = await user.comparePassword('admin123');
        console.log('comparePassword result:', isMatch);

        // Manual bcrypt test
        console.log('\n--- Testing manual bcrypt.compare ---');
        const manualMatch = await bcrypt.compare('admin123', user.password);
        console.log('Manual bcrypt result:', manualMatch);

        // Test hashing
        console.log('\n--- Testing new hash ---');
        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash('admin123', salt);
        console.log('New hash:', newHash);
        const testMatch = await bcrypt.compare('admin123', newHash);
        console.log('New hash match:', testMatch);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testLogin();