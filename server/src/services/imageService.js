const cloudinary = require('../config/cloudinary');

/**
 * Upload a base64 image or remote URL to Cloudinary.
 * @param {string} file Base64 data URL or remote URL.
 * @param {object} options Additional Cloudinary options.
 */
async function uploadImage(file, options = {}) {
  if (!file) {
    throw new Error('No image file provided');
  }

  const res = await cloudinary.uploader.upload(file, {
    folder: options.folder || 'tam-gallery',
    overwrite: true,
    invalidate: true,
    ...options,
  });

  return {
    url: res.secure_url,
    publicId: res.public_id,
  };
}

/**
 * Upload a base64 video or remote URL to Cloudinary.
 * @param {string} file Base64 data URL or remote URL.
 * @param {object} options Additional Cloudinary options.
 */
async function uploadVideo(file, options = {}) {
  if (!file) {
    throw new Error('No video file provided');
  }

  const res = await cloudinary.uploader.upload(file, {
    folder: options.folder || 'tam-gallery/videos',
    resource_type: 'video',
    overwrite: true,
    invalidate: true,
    ...options,
  });

  return {
    url: res.secure_url,
    publicId: res.public_id,
  };
}

/**
 * Delete a resource from Cloudinary by publicId.
 */
async function deleteResource(publicId, resourceType = 'image') {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

module.exports = {
  uploadImage,
  uploadVideo,
  deleteResource,
};

