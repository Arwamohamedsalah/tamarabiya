const Image = require('../models/Image');
const asyncHandler = require('../middleware/asyncHandler');
const { uploadImage, uploadVideo, deleteResource } = require('../services/imageService');
const { getOrCreateCategoryForPageSection } = require('../services/categorySeedService');

// GET /api/images
// Optional query params: category, page, section
exports.getImages = asyncHandler(async (req, res) => {
  const { category, page, section } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (page) filter.page = page;
  if (section) filter.section = section;

  const images = await Image.find(filter)
    .populate('category', 'name slug')
    .sort({ order: 1, createdAt: -1 });

  res.json(images);
});

// POST /api/images
// Body: { categoryId, file (base64 or URL), title, alt, page, section, crop }
exports.createImage = asyncHandler(async (req, res) => {
  let { categoryId, file, title, alt, page, section, crop, order, videoUrl } = req.body;

  if (!file || !page || !section) {
    return res
      .status(400)
      .json({ message: 'file, page and section are required' });
  }

  // Assign category by page + section (MongoDB) → Cloudinary folder tam-gallery/{page}/{section}
  let category;
  if (categoryId) {
    const Category = require('../models/Category');
    category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid categoryId' });
    }
  } else {
    category = await getOrCreateCategoryForPageSection(page, section);
  }

  const uploaded = await uploadImage(file, {
    folder: `tam-gallery/${page}/${section}`,
  });

  let uploadedVideo = null;
  if (videoUrl && videoUrl.startsWith('data:video/')) {
    uploadedVideo = await uploadVideo(videoUrl, {
      folder: `tam-gallery/${page}/${section}/videos`,
    });
  }

  const image = await Image.create({
    category: category._id,
    title,
    alt,
    url: uploaded.url,
    publicId: uploaded.publicId,
    page,
    section,
    crop,
    order,
    videoUrl: uploadedVideo ? uploadedVideo.url : videoUrl,
    videoPublicId: uploadedVideo ? uploadedVideo.publicId : undefined,
  });

  const populated = await image.populate('category', 'name slug');
  res.status(201).json(populated);
});

// PUT /api/images/:id
// Can update metadata, category, crop, and optionally replace file
exports.updateImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { categoryId, file, title, alt, page, section, crop, order, videoUrl } = req.body;

  const image = await Image.findById(id);
  if (!image) {
    return res.status(404).json({ message: 'Image not found' });
  }

  if (categoryId) {
    const Category = require('../models/Category');
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid categoryId' });
    }
    image.category = categoryId;
  }

  if (typeof title !== 'undefined') image.title = title;
  if (typeof alt !== 'undefined') image.alt = alt;
  if (typeof page !== 'undefined') image.page = page;
  if (typeof section !== 'undefined') image.section = section;
  if (typeof order !== 'undefined') image.order = order;
  if (typeof videoUrl !== 'undefined') image.videoUrl = videoUrl;
  if (crop) image.crop = crop;

  // If file provided, upload new image and delete old one
  if (file) {
    const uploaded = await uploadImage(file, {
      folder: `tam-gallery/${image.page}/${image.section}`,
    });

    // Delete old from Cloudinary (ignore errors)
    try {
      await deleteResource(image.publicId);
    } catch (err) {
      console.warn('Failed to delete old Cloudinary image:', err.message);
    }

    image.url = uploaded.url;
    image.publicId = uploaded.publicId;
  }

  // Handle video upload if provided as data URL
  if (videoUrl && videoUrl.startsWith('data:video/')) {
    const uploadedVideo = await uploadVideo(videoUrl, {
      folder: `tam-gallery/${image.page}/${image.section}/videos`,
    });

    // Delete old video if exists
    if (image.videoPublicId) {
      try {
        await deleteResource(image.videoPublicId, 'video');
      } catch (err) {
        console.warn('Failed to delete old Cloudinary video:', err.message);
      }
    }

    image.videoUrl = uploadedVideo.url;
    image.videoPublicId = uploadedVideo.publicId;
  } else if (typeof videoUrl !== 'undefined') {
    // If it's a regular link or null, and we have an old uploaded video, delete it
    if (image.videoPublicId && videoUrl !== image.videoUrl) {
      try {
        await deleteResource(image.videoPublicId, 'video');
        image.videoPublicId = undefined;
      } catch (err) {
        console.warn('Failed to delete old Cloudinary video:', err.message);
      }
    }
    image.videoUrl = videoUrl;
  }

  await image.save();
  const populated = await image.populate('category', 'name slug');
  res.json(populated);
});

// DELETE /api/images/:id
exports.deleteImageById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const image = await Image.findById(id);
  if (!image) {
    return res.status(404).json({ message: 'Image not found' });
  }

  // Delete from Cloudinary first (ignore errors)
  try {
    await deleteResource(image.publicId);
    if (image.videoPublicId) {
      await deleteResource(image.videoPublicId, 'video');
    }
  } catch (err) {
    console.warn('Failed to delete Cloudinary resources:', err.message);
  }

  await image.deleteOne();

  res.status(204).send();
});

