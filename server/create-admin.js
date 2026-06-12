require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

async function createAdminUser() {
    try {
        await connectDB();

        // Get admin credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@tam.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('ℹ️  Admin user already exists');
            console.log(`   Email: ${adminEmail}`);
            console.log('\n💡 To update password, delete the user from database and run this script again');
        } else {
            // Create new admin user
            const admin = await User.create({
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                isActive: true,
            });

            console.log('\n✅ Admin user created successfully!');
            console.log(`   Email: ${adminEmail}`);
            console.log(`   Password: ${adminPassword}`);
            console.log('\n⚠️  IMPORTANT: Change the default password in production!');
            console.log('   Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file');
        }

    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    }
}

// Run the script
createAdminUser();
