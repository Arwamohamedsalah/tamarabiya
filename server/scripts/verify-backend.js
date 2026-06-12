
const http = require('http');

async function testBackend() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('🚀 Starting Backend Verification...');

  // 1. Health Check
  try {
    const healthRes = await fetch(`${baseUrl}/health`);
    if (healthRes.ok) {
      console.log('✅ Health Check: OK');
    } else {
      console.error('❌ Health Check: FAILED', healthRes.status);
    }
  } catch (err) {
    console.error('❌ Health Check: ERROR - Is the server running?');
    console.error(err);
    process.exit(1);
  }

  // 2. Database Connection & Read (Get Categories)
  try {
    const res = await fetch(`${baseUrl}/categories`);
    if (res.ok) {
      const data = await res.json();
      console.log(`✅ Get Categories: OK (Found ${data.length} categories)`);
    } else {
      console.error('❌ Get Categories: FAILED', res.status);
    }
  } catch (err) {
    console.error('❌ Get Categories: ERROR', err);
  }

  // 3. Database Write (Create Category)
  let createdId = null;
  const testCategory = {
    name: 'Test Category Integration',
    slug: 'test-category-integration-' + Date.now(),
    description: 'Automated test category',
    order: 999,
    isActive: false
  };

  try {
    const res = await fetch(`${baseUrl}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCategory)
    });

    if (res.status === 201) {
      const data = await res.json();
      createdId = data._id;
      console.log('✅ Create Category: OK');
    } else {
      console.error('❌ Create Category: FAILED', res.status, await res.text());
    }
  } catch (err) {
    console.error('❌ Create Category: ERROR', err);
  }

  // 4. Cleanup (Delete Category)
  if (createdId) {
    try {
      const res = await fetch(`${baseUrl}/categories/${createdId}`, {
        method: 'DELETE'
      });
      if (res.status === 204) {
        console.log('✅ Delete Category: OK');
      } else {
        console.error('❌ Delete Category: FAILED', res.status);
      }
    } catch (err) {
      console.error('❌ Delete Category: ERROR', err);
    }
  }

  console.log('🏁 Verification Complete.');
}

// Simple fetch polyfill for older node if needed (just in case, but node 18 has it)
if (!global.fetch) {
  console.log("⚠️  Fetch not available, skipping test or use Node 18+");
} else {
  testBackend();
}
