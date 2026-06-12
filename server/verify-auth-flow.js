// Native fetch is available in Node 18+
require('dotenv').config();

const API_BASE_URL = 'http://localhost:5000/api';

async function verifyAuthSystem() {
    console.log('🧪 Verifying Secure Auth System...\n');

    const credentials = {
        email: process.env.ADMIN_EMAIL || 'admin@tamalarabiya.com',
        password: process.env.ADMIN_PASSWORD || 'TamAdmin@2026!'
    };

    console.log(`📡 Attempting login with: ${credentials.email}`);

    try {
        const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (!loginRes.ok) {
            const error = await loginRes.json();
            console.error('❌ Login failed:', error.message);
            return;
        }

        const { token, user } = await loginRes.json();
        console.log('✅ Login successful!');
        console.log(`🔑 Token received: ${token.substring(0, 20)}...`);
        console.log(`👤 User: ${user.email} (Role: ${user.role})`);

        // Test protected route
        console.log('\n📡 Testing protected route (/api/auth/verify)...');
        const verifyRes = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (verifyRes.ok) {
            console.log('✅ Protected route access granted!');
        } else {
            console.log('❌ Protected route access DENIED');
        }

        // Test unauthorized access
        console.log('\n📡 Testing unauthorized access to Image API (POST)...');
        const unauthorizedRes = await fetch(`${API_BASE_URL}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ alt: 'Test' })
        });

        if (unauthorizedRes.status === 401) {
            console.log('✅ Expected: Unauthorized access rejected');
        } else {
            console.log(`⚠️ Unexpected status: ${unauthorizedRes.status}`);
        }

    } catch (error) {
        console.error('❌ Error during verification:', error.message);
    }
}

// Since node-fetch might not be installed globally or in local, 
// we'll assume the environment has fetch available or we use a small script that works with standard http
verifyAuthSystem();
