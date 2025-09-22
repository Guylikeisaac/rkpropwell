// Pagination utility
const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;
  
  return { limit, offset };
};

// Get paginated data
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  
  return {
    totalItems,
    items,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages - 1,
    hasPrevPage: currentPage > 0
  };
};

// Response utility
const sendResponse = (res, statusCode, success, message, data = null, meta = null) => {
  const response = {
    success,
    message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  if (meta !== null) {
    response.meta = meta;
  }
  
  return res.status(statusCode).json(response);
};

// Error response utility
const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

// Success response utility
const sendSuccess = (res, message = 'Success', data = null, meta = null) => {
  return sendResponse(res, 200, true, message, data, meta);
};

// Created response utility
const sendCreated = (res, message = 'Created successfully', data = null) => {
  return sendResponse(res, 201, true, message, data);
};

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Generate random string
const generateRandomString = (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
};

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(price);
};

// Capitalize first letter
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Remove sensitive data from user object
const sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user.toJSON ? user.toJSON() : user;
  return sanitizedUser;
};

module.exports = {
  getPagination,
  getPagingData,
  sendResponse,
  sendError,
  sendSuccess,
  sendCreated,
  asyncHandler,
  generateRandomString,
  formatPrice,
  capitalize,
  sanitizeUser
};
