const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const { protect } = require('../middleware/auth');

// HEAD: used by dashboard to check if file exists (no body returned)
router.head('/download-profile', fileController.checkCompanyProfile);
router.get('/download-profile', fileController.downloadCompanyProfile);
router.post('/upload-profile', protect, fileController.uploadCompanyProfile);
router.delete('/delete-profile', protect, fileController.deleteCompanyProfile);

module.exports = router;

