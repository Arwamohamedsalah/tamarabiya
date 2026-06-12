const express = require('express');
const {
  getSiteSettings,
  updateSiteSettings,
  regenerateQrCode,
} = require('../controllers/siteSettingsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getSiteSettings);
router.put('/', protect, updateSiteSettings);
router.post('/regenerate-qr', protect, regenerateQrCode);

module.exports = router;
