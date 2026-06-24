const mongoose = require('mongoose');

const serviceTypeSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  nameAr: { type: String, trim: true },
  desc: { type: String, trim: true },
  descEn: { type: String, trim: true },
  order: { type: Number, default: 0 },
});

const workAreaBlockSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['paragraph', 'heading', 'highlight', 'list', 'table'] },
    text: { type: String, trim: true },
    textEn: { type: String, trim: true },
    title: { type: String, trim: true },
    titleEn: { type: String, trim: true },
    body: { type: String, trim: true },
    bodyEn: { type: String, trim: true },
    intro: { type: String, trim: true },
    introEn: { type: String, trim: true },
    items: [{ type: String, trim: true }],
    itemsEn: [{ type: String, trim: true }],
    headerCol1: { type: String, trim: true },
    headerCol1En: { type: String, trim: true },
    headerCol2: { type: String, trim: true },
    headerCol2En: { type: String, trim: true },
    rows: [
      {
        col1: { type: String, trim: true },
        col1En: { type: String, trim: true },
        col2: { type: String, trim: true },
        col2En: { type: String, trim: true },
      },
    ],
  },
  { _id: false }
);

const workAreaSectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    titleEn: { type: String, trim: true },
    imageCount: { type: Number, default: 2 },
    blocks: [workAreaBlockSchema],
  },
  { _id: false }
);

const pageContentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      enum: ['landscaping', 'fencing', 'infrastructure'],
      required: true,
      unique: true,
    },
    introTitle: { type: String, trim: true },
    introTitleEn: { type: String, trim: true },
    introDescription: { type: String, trim: true },
    introDescriptionEn: { type: String, trim: true },
    serviceTypes: [serviceTypeSchema],
    workAreaSections: [workAreaSectionSchema],
    ctaTitle: { type: String, trim: true },
    ctaTitleEn: { type: String, trim: true },
    ctaDescription: { type: String, trim: true },
    ctaDescriptionEn: { type: String, trim: true },
    ctaButtonText: { type: String, trim: true },
    ctaButtonTextEn: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PageContent', pageContentSchema);
