const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');

// Route to get stories based on type and language
router.get('/', storyController.getStories);

module.exports = router;
