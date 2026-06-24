/**
 * Seed missing page content only — does NOT overwrite existing CMS text.
 * Run: npm run seed:page-content  (from server folder)
 */
require('dotenv').config();
const connectDB = require('../src/config/db');
const PageContent = require('../src/models/PageContent');
const { PAGE_CONTENT_DEFAULTS } = require('../src/config/pageContentDefaults');

const FILL_IF_EMPTY = [
  'introTitle',
  'introTitleEn',
  'introDescription',
  'introDescriptionEn',
  'ctaTitle',
  'ctaTitleEn',
  'ctaDescription',
  'ctaDescriptionEn',
  'ctaButtonText',
  'ctaButtonTextEn',
];

async function seed() {
  await connectDB();

  for (const [page, defaults] of Object.entries(PAGE_CONTENT_DEFAULTS)) {
    let doc = await PageContent.findOne({ page });

    if (!doc) {
      doc = await PageContent.create(defaults);
      console.log(`✅ ${page}: created with ${(doc.workAreaSections || []).length} work area sections`);
      continue;
    }

    let changed = false;

    for (const field of FILL_IF_EMPTY) {
      if (!doc[field] && defaults[field]) {
        doc[field] = defaults[field];
        changed = true;
      }
    }

    if (!doc.serviceTypes?.length && defaults.serviceTypes?.length) {
      doc.serviceTypes = defaults.serviceTypes;
      doc.markModified('serviceTypes');
      changed = true;
    }

    if (!doc.workAreaSections?.length && defaults.workAreaSections?.length) {
      doc.workAreaSections = defaults.workAreaSections;
      doc.markModified('workAreaSections');
      changed = true;
    }

    if (changed) {
      await doc.save();
      console.log(`✅ ${page}: filled missing fields (kept existing edits)`);
    } else {
      console.log(`⏭️  ${page}: already has content — nothing overwritten`);
    }
  }

  console.log('Done — page content checked in MongoDB.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
