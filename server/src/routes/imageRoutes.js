const express = require('express');
const {
    getImages,
    createImage,
    updateImage,
    deleteImageById,
} = require('../controllers/imageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getImages);
router.post('/', protect, createImage);
router.put('/:id', protect, updateImage);
router.delete('/:id', protect, deleteImageById);

module.exports = router;

