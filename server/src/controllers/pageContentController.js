const PageContent = require('../models/PageContent');
const asyncHandler = require('../middleware/asyncHandler');
const { localizePageContent } = require('../utils/localizeContent');
const { PAGE_CONTENT_DEFAULTS } = require('../config/pageContentDefaults');

const ALLOWED_UPDATE_FIELDS = [
  'introTitle',
  'introTitleEn',
  'introDescription',
  'introDescriptionEn',
  'serviceTypes',
  'workAreaSections',
  'ctaTitle',
  'ctaTitleEn',
  'ctaDescription',
  'ctaDescriptionEn',
  'ctaButtonText',
  'ctaButtonTextEn',
];

async function ensureWorkAreaDefaults(doc, page) {
  if (
    !doc.workAreaSections?.length &&
    PAGE_CONTENT_DEFAULTS[page]?.workAreaSections?.length
  ) {
    doc.workAreaSections = PAGE_CONTENT_DEFAULTS[page].workAreaSections;
    doc.markModified('workAreaSections');
    await doc.save();
  }
  return doc;
}

exports.getPageContent = asyncHandler(async (req, res) => {
  const { page } = req.params;
  const lang = req.query.lang === 'en' ? 'en' : 'ar';
  if (!['landscaping', 'fencing', 'infrastructure'].includes(page)) {
    return res.status(400).json({ message: 'Invalid page' });
  }
  let doc = await PageContent.findOne({ page });
  if (!doc) {
    doc = await PageContent.create(PAGE_CONTENT_DEFAULTS[page]);
  } else {
    doc = await ensureWorkAreaDefaults(doc, page);
  }
  res.json(localizePageContent(doc, lang));
});

exports.getAllPageContents = asyncHandler(async (req, res) => {
  const docs = await PageContent.find({});
  const pages = ['landscaping', 'fencing', 'infrastructure'];
  const result = {};
  for (const p of pages) {
    let found = docs.find((d) => d.page === p);
    if (!found) {
      found = await PageContent.create(PAGE_CONTENT_DEFAULTS[p]);
    } else {
      found = await ensureWorkAreaDefaults(found, p);
    }
    result[p] = found.toObject();
  }
  res.json(result);
});

exports.updatePageContent = asyncHandler(async (req, res) => {
  const { page } = req.params;
  if (!['landscaping', 'fencing', 'infrastructure'].includes(page)) {
    return res.status(400).json({ message: 'Invalid page' });
  }

  let doc = await PageContent.findOne({ page });
  if (!doc) {
    doc = new PageContent({ page, ...PAGE_CONTENT_DEFAULTS[page] });
  }

  for (const key of ALLOWED_UPDATE_FIELDS) {
    if (req.body[key] !== undefined) {
      doc[key] = req.body[key];
      if (key === 'workAreaSections' || key === 'serviceTypes') {
        doc.markModified(key);
      }
    }
  }

  doc.page = page;
  await doc.save();

  res.json(doc.toObject());
});
