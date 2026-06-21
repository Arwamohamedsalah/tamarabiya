/**
 * Verify backend routes after deploy.
 * Usage:
 *   node server/scripts/verify-backend.js
 *   API_BASE=https://www.tamarabiya.com/api node server/scripts/verify-backend.js
 */
const baseUrl = (process.env.API_BASE || 'http://localhost:5000/api').replace(/\/$/, '');

const REQUIRED_ROUTES = [
  { name: 'Health', path: '/health', expect: [200] },
  { name: 'Site settings', path: '/site-settings', expect: [200] },
  { name: 'Categories', path: '/categories', expect: [200] },
  { name: 'Images', path: '/images', expect: [200] },
  { name: 'Contact (POST validation)', path: '/contact', method: 'POST', body: {}, expect: [400] },
];

async function checkRoute({ name, path, method = 'GET', body, expect }) {
  const url = `${baseUrl}${path}`;
  const options = {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const res = await fetch(url, options);
    if (expect.includes(res.status)) {
      console.log(`✅ ${name}: ${res.status}`);
      return true;
    }
    console.error(`❌ ${name}: expected ${expect.join('|')}, got ${res.status} (${url})`);
    return false;
  } catch (err) {
    console.error(`❌ ${name}: ${err.message} (${url})`);
    return false;
  }
}

async function main() {
  if (!global.fetch) {
    console.error('Node 18+ required (fetch API).');
    process.exit(1);
  }

  console.log(`🔍 Verifying API at ${baseUrl}`);

  const results = await Promise.all(REQUIRED_ROUTES.map(checkRoute));
  const failed = results.filter((ok) => !ok).length;

  if (failed > 0) {
    console.error(`\n❌ ${failed} check(s) failed. Run: pm2 logs tam-backend --lines 50`);
    process.exit(1);
  }

  console.log('\n✅ All API checks passed.');
}

main();
