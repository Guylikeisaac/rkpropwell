const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getUserProperties,
  getAllPropertiesAdmin,
  updatePropertyStatus,
  deletePropertyImage,
  getFeaturedProperties
} = require('../controllers/propertyController');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadMultiple, handleMulterError } = require('../middleware/upload');
const { 
  validateProperty, 
  handleValidationErrors 
} = require('../middleware/validation');

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/:id', getPropertyById);

// Protected routes (authenticated users)
router.use(authenticate);

// User routes
router.get('/user/my-properties', getUserProperties);
router.post(
  '/', 
  uploadMultiple, 
  handleMulterError,
  validateProperty, 
  handleValidationErrors, 
  createProperty
);
router.put(
  '/:id', 
  uploadMultiple, 
  handleMulterError,
  validateProperty, 
  handleValidationErrors, 
  updateProperty
);
router.delete('/:id', deleteProperty);
router.delete('/:propertyId/images/:imageId', deletePropertyImage);

// Admin only routes
router.get('/admin/all', authorize('admin'), getAllPropertiesAdmin);
router.put('/:id/status', authorize('admin'), updatePropertyStatus);

module.exports = router;
