const mongoose = require('mongoose');

const serviceTypeSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  nameAr: { type: String, trim: true },
  desc: { type: String, trim: true },
  descEn: { type: String, trim: true },
  order: { type: Number, default: 0 },
});

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
