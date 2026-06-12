const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    whatsappNumber: {
      type: String,
      trim: true,
      default: '+966507826024',
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: '+966507826024',
    },
    websiteUrl: {
      type: String,
      trim: true,
      default: 'https://www.tamalarabiya.com',
    },
    customUrl: {
      type: String,
      trim: true,
      default: '',
    },
    qrDestination: {
      type: String,
      enum: ['whatsapp', 'phone', 'website', 'custom'],
      default: 'whatsapp',
    },
    qrCodeDataUrl: {
      type: String,
      default: '',
    },
    qrTargetUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
