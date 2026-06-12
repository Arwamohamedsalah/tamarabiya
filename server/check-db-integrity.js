const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tam-db')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

const Image = require('./src/models/Image');

async function checkDatabaseIntegrity() {
    console.log('\n🔍 Checking database for invalid section values...\n');

    const validSections = ['hero', 'services', 'gallery', 'projects', 'header', 'content'];

    try {
        // Get all images
        const allImages = await Image.find({});
        console.log(`📊 Total images in database: ${allImages.length}`);

        // Check for invalid sections
        const invalidImages = allImages.filter(img => !validSections.includes(img.section));

        if (invalidImages.length === 0) {
            console.log('✅ All images have valid section values!');
        } else {
            console.log(`⚠️  Found ${invalidImages.length} images with invalid section values:\n`);

            invalidImages.forEach(img => {
                console.log(`  - ID: ${img._id}`);
                console.log(`    Section: "${img.section}" (INVALID)`);
                console.log(`    Page: ${img.page}`);
                console.log(`    Alt: ${img.alt || 'N/A'}`);
                console.log('');
            });

            console.log('\n💡 Recommendation: Update these images with valid section values:');
            console.log('   Valid sections:', validSections.join(', '));
        }

        // Group by section
        console.log('\n📈 Images grouped by section:');
        const grouped = allImages.reduce((acc, img) => {
            acc[img.section] = (acc[img.section] || 0) + 1;
            return acc;
        }, {});

        Object.entries(grouped).forEach(([section, count]) => {
            const isValid = validSections.includes(section);
            const status = isValid ? '✅' : '❌';
            console.log(`  ${status} ${section}: ${count} images`);
        });

    } catch (error) {
        console.error('❌ Error checking database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
    }
}

// Run the check
checkDatabaseIntegrity();
