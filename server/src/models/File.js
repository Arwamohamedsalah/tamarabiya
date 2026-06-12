const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        key: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        // Cloudinary URL (permanent)
        url: {
            type: String,
            default: null,
        },
        // Cloudinary public_id (for deletion/replacement)
        publicId: {
            type: String,
            default: null,
        },
        // Legacy: local path (fallback only)
        path: {
            type: String,
            default: null,
        },
        mimetype: {
            type: String,
            default: 'application/pdf',
        },
        size: {
            type: Number,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('File', fileSchema);
