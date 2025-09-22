const express = require('express');
const router = express.Router();
const { getHeroSlides, updatePropertyFeatured, getHeroStats } = require('../controllers/heroController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.get('/slides', getHeroSlides);
router.get('/stats', getHeroStats);

// Admin routes
router.put('/property/:propertyId/featured', authenticate, authorize(['admin']), updatePropertyFeatured);

module.exports = router;