// API Endpoint Tests for Enum Validation
// Run this script to test the Image API endpoints

const API_BASE_URL = 'http://localhost:5000/api';

async function testEnumValidation() {
    console.log('🧪 Testing API Endpoints - Enum Validation\n');
    console.log('='.repeat(50));

    // Test 1: Try to create an image with VALID section
    console.log('\n📝 Test 1: Creating image with VALID section (hero)...');
    try {
        const validResponse = await fetch(`${API_BASE_URL}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                file: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                alt: 'Test Image - Valid Section',
                page: 'home',
                section: 'hero', // VALID
            }),
        });

        if (validResponse.ok) {
            const data = await validResponse.json();
            console.log('✅ SUCCESS: Image created with valid section');
            console.log(`   Image ID: ${data._id}`);
            console.log(`   Section: ${data.section}`);
        } else {
            const error = await validResponse.text();
            console.log('❌ FAILED:', error);
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
    }

    // Test 2: Try to create an image with INVALID section
    console.log('\n📝 Test 2: Creating image with INVALID section (invalid-section)...');
    try {
        const invalidResponse = await fetch(`${API_BASE_URL}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                file: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                alt: 'Test Image - Invalid Section',
                page: 'home',
                section: 'invalid-section', // INVALID
            }),
        });

        if (invalidResponse.ok) {
            console.log('❌ UNEXPECTED: Image was created with invalid section (enum validation not working!)');
        } else {
            const error = await invalidResponse.text();
            console.log('✅ EXPECTED: Request rejected (enum validation working!)');
            console.log(`   Error: ${error}`);
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
    }

    // Test 3: Get all images
    console.log('\n📝 Test 3: Fetching all images...');
    try {
        const getResponse = await fetch(`${API_BASE_URL}/images`);
        if (getResponse.ok) {
            const images = await getResponse.json();
            console.log(`✅ SUCCESS: Retrieved ${images.length} images`);

            // Check section distribution
            const sectionCounts = images.reduce((acc, img) => {
                acc[img.section] = (acc[img.section] || 0) + 1;
                return acc;
            }, {});

            console.log('\n   Section distribution:');
            Object.entries(sectionCounts).forEach(([section, count]) => {
                console.log(`   - ${section}: ${count} images`);
            });
        } else {
            console.log('❌ FAILED to fetch images');
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Tests completed!\n');
}

// Run tests
testEnumValidation().catch(console.error);
