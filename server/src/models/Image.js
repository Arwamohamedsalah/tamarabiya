const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    page: {
      type: String,
      enum: ['home', 'landscaping', 'fencing', 'infrastructure', 'about', 'contact'],
      required: true,
    },
    section: {
      type: String,
      enum: ['hero', 'services', 'gallery', 'projects', 'header', 'content'],
      required: true,
      trim: true,
    },
    crop: {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    videoPublicId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Image', imageSchema);

