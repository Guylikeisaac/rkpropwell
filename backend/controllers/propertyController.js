const { Property, PropertyImage, User, Inquiry } = require('../models');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { cleanupFiles } = require('../utils/fileUtils');
const { 
  sendSuccess, 
  sendError, 
  sendCreated, 
  asyncHandler, 
  getPagination, 
  getPagingData 
} = require('../utils/helpers');
const { Op } = require('sequelize');

// Get all properties with filters and pagination
const getProperties = asyncHandler(async (req, res) => {
  const { 
    page = 0, 
    size = 10, 
    type, 
    propertyType, 
    minPrice, 
    maxPrice, 
    location, 
    bedrooms, 
    bathrooms,
    search,
    sortBy = 'createdAt',
    sortOrder = 'DESC'
  } = req.query;

  const { limit, offset } = getPagination(page, size);

  // Build where conditions
  const whereConditions = {
    isApproved: true,
    status: 'available'
  };

  if (type) whereConditions.type = type;
  if (propertyType) whereConditions.propertyType = propertyType;
  if (bedrooms) whereConditions.bedrooms = bedrooms;
  if (bathrooms) whereConditions.bathrooms = bathrooms;
  
  if (minPrice || maxPrice) {
    whereConditions.price = {};
    if (minPrice) whereConditions.price[Op.gte] = minPrice;
    if (maxPrice) whereConditions.price[Op.lte] = maxPrice;
  }

  if (location) {
    whereConditions[Op.or] = [
      { location: { [Op.like]: `%${location}%` } },
      { city: { [Op.like]: `%${location}%` } },
      { state: { [Op.like]: `%${location}%` } }
    ];
  }

  if (search) {
    whereConditions[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
      { location: { [Op.like]: `%${search}%` } }
    ];
  }

  // Get properties
  const data = await Property.findAndCountAll({
    where: whereConditions,
    include: [
      {
        model: PropertyImage,
        as: 'propertyImages',
        attributes: ['id', 'url', 'caption', 'isPrimary', 'order']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone']
      }
    ],
    limit,
    offset,
    order: [[sortBy, sortOrder]],
    distinct: true
  });

  const pagination = getPagingData(data, page, limit);

  sendSuccess(res, 'Properties retrieved successfully', pagination);
});

// Get property by ID
const getPropertyById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const property = await Property.findOne({
    where: { 
      id,
      isApproved: true,
      status: 'available'
    },
    include: [
      {
        model: PropertyImage,
        as: 'propertyImages',
        attributes: ['id', 'url', 'caption', 'isPrimary', 'order'],
        order: [['order', 'ASC']]
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone']
      }
    ]
  });

  if (!property) {
    return sendError(res, 404, 'Property not found');
  }

  // Increment views
  await property.increment('views');

  sendSuccess(res, 'Property retrieved successfully', { property });
});

// Create new property
const createProperty = asyncHandler(async (req, res) => {
  const propertyData = { ...req.body };
  propertyData.userId = req.user.id;

  // Handle boolean fields
  const booleanFields = [
    'garden', 'swimmingPool', 'gym', 'security', 'wifi', 'tv', 
    'ac', 'heating', 'lift', 'powerBackup', 'waterSupply', 'gasConnection'
  ];
  
  booleanFields.forEach(field => {
    if (propertyData[field] !== undefined) {
      propertyData[field] = propertyData[field] === 'true' || propertyData[field] === true;
    }
  });

  // Handle features array
  if (propertyData.features && typeof propertyData.features === 'string') {
    try {
      propertyData.features = JSON.parse(propertyData.features);
    } catch {
      propertyData.features = propertyData.features.split(',').map(f => f.trim());
    }
  }

  // Auto-approve for admin users
  if (req.user.role === 'admin') {
    propertyData.isApproved = true;
  }

  // Create property
  const property = await Property.create(propertyData);

  // Handle image uploads
  if (req.files && req.files.length > 0) {
    try {
      const imagePromises = req.files.map(async (file, index) => {
        const cloudinaryResult = await uploadToCloudinary(file.path, 'properties');
        return PropertyImage.create({
          propertyId: property.id,
          url: cloudinaryResult.url,
          publicId: cloudinaryResult.publicId,
          order: index,
          isPrimary: index === 0
        });
      });

      await Promise.all(imagePromises);
      
      // Clean up local files
      await cleanupFiles(req.files);
    } catch (error) {
      console.error('Image upload error:', error);
      await cleanupFiles(req.files);
      // Don't fail the entire operation for image upload errors
    }
  }

  // Fetch the complete property with images
  const completeProperty = await Property.findByPk(property.id, {
    include: [
      {
        model: PropertyImage,
        as: 'propertyImages',
        attributes: ['id', 'url', 'caption', 'isPrimary', 'order']
      }
    ]
  });

  sendCreated(res, 'Property created successfully', { property: completeProperty });
});

// Update property
const updateProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  // Find property
  const property = await Property.findOne({
    where: { 
      id,
      ...(req.user.role !== 'admin' && { userId: req.user.id })
    }
  });

  if (!property) {
    return sendError(res, 404, 'Property not found or access denied');
  }

  // Handle boolean fields
  const booleanFields = [
    'garden', 'swimmingPool', 'gym', 'security', 'wifi', 'tv', 
    'ac', 'heating', 'lift', 'powerBackup', 'waterSupply', 'gasConnection'
  ];
  
  booleanFields.forEach(field => {
    if (updateData[field] !== undefined) {
      updateData[field] = updateData[field] === 'true' || updateData[field] === true;
    }
  });

  // Handle features array
  if (updateData.features && typeof updateData.features === 'string') {
    try {
      updateData.features = JSON.parse(updateData.features);
    } catch {
      updateData.features = updateData.features.split(',').map(f => f.trim());
    }
  }

  // Update property
  await property.update(updateData);

  // Handle new image uploads
  if (req.files && req.files.length > 0) {
    try {
      const existingImages = await PropertyImage.findAll({
        where: { propertyId: property.id }
      });

      const imagePromises = req.files.map(async (file, index) => {
        const cloudinaryResult = await uploadToCloudinary(file.path, 'properties');
        return PropertyImage.create({
          propertyId: property.id,
          url: cloudinaryResult.url,
          publicId: cloudinaryResult.publicId,
          order: existingImages.length + index,
          isPrimary: existingImages.length === 0 && index === 0
        });
      });

      await Promise.all(imagePromises);
      
      // Clean up local files
      await cleanupFiles(req.files);
    } catch (error) {
      console.error('Image upload error:', error);
      await cleanupFiles(req.files);
    }
  }

  // Fetch updated property
  const updatedProperty = await Property.findByPk(property.id, {
    include: [
      {
        model: PropertyImage,
        as: 'propertyImages',
        attributes: ['id', 'url', 'caption', 'isPrimary', 'order']
      }
    ]
  });

  sendSuccess(res, 'Property updated successfully', { property: updatedProperty });
});

// Delete property
const deleteProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find property
  const property = await Property.findOne({
    where: { 
      id,
      ...(req.user.role !== 'admin' && { userId: req.user.id })
    },
    include: [
      {
        model: PropertyImage,
        as: 'propertyImages'
      }
    ]
  });

  if (!property) {
    return sendError(res, 404, 'Property not found or access denied');
  }

  // Delete images from Cloudinary
  if (property.propertyImages && property.propertyImages.length > 0) {
    const deletePromises = property.propertyImages.map(image => 
      deleteFromCloudinary(image.publicId)
    );
    await Promise.all(deletePromises);
  }

  // Delete property (cascade will handle related records)
  await property.destroy();

  sendSuccess(res, 'Property deleted successfully');
});

// Get user's properties
const getUserProperties = asyncHandler(async (req, res) => {
  const { page = 0, size = 10 } = req.query;
  const { limit, offset } = getPagination(page, size);

  const data = await Property.findAndCountAll({
    where: { userId: req.user.id },
    include: [
      {
        model: PropertyImage,
        as: 'propertyImages',
        attributes: ['id', 'url', 'caption', 'isPrimary', 'order']
      }
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    distinct: true
  });

  const pagination = getPagingData(data, page, limit);

  sendSuccess(res, 'User properties retrieved successfully', pagination);
});

// Admin: Get all properties (including unapproved)
const getAllPropertiesAdmin = asyncHandler(async (req, res) => {
  const { 
    page = 0, 
    size = 10, 
    status,
    isApproved,
    sortBy = 'createdAt',
    sortOrder = 'DESC'
  } = req.query;

  const { limit, offset } = getPagination(page, size);

  const whereConditions = {};
  if (status) whereConditions.status = status;
  if (isApproved !== undefined) whereConditions.isApproved = isApproved === 'true';

  const data = await Property.findAndCountAll({
    where: whereConditions,
    include: [
      {
        model: PropertyImage,
        as: 'propertyImages',
        attributes: ['id', 'url', 'caption', 'isPrimary', 'order']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone']
      }
    ],
    limit,
    offset,
    order: [[sortBy, sortOrder]],
    distinct: true
  });

  const pagination = getPagingData(data, page, limit);

  sendSuccess(res, 'All properties retrieved successfully', pagination);
});

// Admin: Approve/Reject property
const updatePropertyStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isApproved, status } = req.body;

  const property = await Property.findByPk(id);
  if (!property) {
    return sendError(res, 404, 'Property not found');
  }

  const updateData = {};
  if (isApproved !== undefined) updateData.isApproved = isApproved;
  if (status) updateData.status = status;

  await property.update(updateData);

  sendSuccess(res, 'Property status updated successfully', { property });
});

// Delete property image
const deletePropertyImage = asyncHandler(async (req, res) => {
  const { propertyId, imageId } = req.params;

  // Find property
  const property = await Property.findOne({
    where: { 
      id: propertyId,
      ...(req.user.role !== 'admin' && { userId: req.user.id })
    }
  });

  if (!property) {
    return sendError(res, 404, 'Property not found or access denied');
  }

  // Find and delete image
  const image = await PropertyImage.findOne({
    where: { 
      id: imageId,
      propertyId: propertyId
    }
  });

  if (!image) {
    return sendError(res, 404, 'Image not found');
  }

  // Delete from Cloudinary
  if (image.publicId) {
    await deleteFromCloudinary(image.publicId);
  }

  // Delete from database
  await image.destroy();

  sendSuccess(res, 'Image deleted successfully');
});

// Get featured properties
const getFeaturedProperties = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;

  const properties = await Property.findAll({
    where: {
      isFeatured: true,
      isApproved: true,
      status: 'available'
    },
    include: [
      {
        model: PropertyImage,
        as: 'propertyImages',
        attributes: ['id', 'url', 'caption', 'isPrimary', 'order'],
        where: { isPrimary: true },
        required: false
      }
    ],
    limit: parseInt(limit),
    order: [['createdAt', 'DESC']]
  });

  sendSuccess(res, 'Featured properties retrieved successfully', { properties });
});

module.exports = {
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
};
