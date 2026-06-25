/**
 * Sync workAreaSections from PDF defaults into MongoDB.
 * Keeps intro, CTA, serviceTypes and other CMS edits — updates sections layout/text only.
 * Run: node scripts/sync-work-area-sections.js  (from server folder)
 */
require('dotenv').config();
const connectDB = require('../src/config/db');
const PageContent = require('../src/models/PageContent');
const { PAGE_CONTENT_DEFAULTS } = require('../src/config/pageContentDefaults');

async function sync() {
  await connectDB();

  for (const [page, defaults] of Object.entries(PAGE_CONTENT_DEFAULTS)) {
    if (!defaults.workAreaSections?.length) continue;

    let doc = await PageContent.findOne({ page });
    if (!doc) {
      doc = await PageContent.create(defaults);
      console.log(`✅ ${page}: created with ${doc.workAreaSections.length} sections`);
      continue;
    }

    doc.workAreaSections = defaults.workAreaSections;
    doc.markModified('workAreaSections');
    await doc.save();
    console.log(
      `✅ ${page}: saved ${doc.workAreaSections.length} sections → ${doc.workAreaSections.map((s) => s.id).join(', ')}`
    );
  }

  console.log('Done — work area sections synced to MongoDB.');
  process.exit(0);
}

sync().catch((err) => {
  console.error('Sync failed:', err.message);
  process.exit(1);
});
