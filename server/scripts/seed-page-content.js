/**
 * Upsert service page content from PDF/company profile defaults.
 * Run: node scripts/seed-page-content.js  (from server folder)
 */
require('dotenv').config();
const connectDB = require('../src/config/db');
const PageContent = require('../src/models/PageContent');
const { PAGE_CONTENT_DEFAULTS } = require('../src/config/pageContentDefaults');

async function seed() {
  await connectDB();

  for (const [page, data] of Object.entries(PAGE_CONTENT_DEFAULTS)) {
    const updated = await PageContent.findOneAndUpdate({ page }, data, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    console.log(`✅ ${page}: ${updated.serviceTypes.length} service areas`);
  }

  console.log('Done — page content updated in MongoDB.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
