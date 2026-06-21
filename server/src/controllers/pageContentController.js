const PageContent = require('../models/PageContent');
const asyncHandler = require('../middleware/asyncHandler');
const { localizePageContent } = require('../utils/localizeContent');
const { PAGE_CONTENT_DEFAULTS } = require('../config/pageContentDefaults');

exports.getPageContent = asyncHandler(async (req, res) => {
  const { page } = req.params;
  const lang = req.query.lang === 'en' ? 'en' : 'ar';
  if (!['landscaping', 'fencing', 'infrastructure'].includes(page)) {
    return res.status(400).json({ message: 'Invalid page' });
  }
  let doc = await PageContent.findOne({ page });
  if (!doc) {
    doc = await PageContent.create(PAGE_CONTENT_DEFAULTS[page]);
  }
  res.json(localizePageContent(doc, lang));
});

exports.getAllPageContents = asyncHandler(async (req, res) => {
  const docs = await PageContent.find({});
  const pages = ['landscaping', 'fencing', 'infrastructure'];
  const result = {};
  for (const p of pages) {
    const found = docs.find((d) => d.page === p);
    result[p] = found ? found.toObject() : PAGE_CONTENT_DEFAULTS[p];
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
    doc = await PageContent.create({ ...PAGE_CONTENT_DEFAULTS[page], ...req.body });
  } else {
    Object.assign(doc, req.body);
    await doc.save();
  }
  res.json(doc);
});
