const express = require('express');
const {
    getPageContent,
    getAllPageContents,
    updatePageContent,
} = require('../controllers/pageContentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllPageContents);
router.get('/:page', getPageContent);
router.put('/:page', protect, updatePageContent);

module.exports = router;
