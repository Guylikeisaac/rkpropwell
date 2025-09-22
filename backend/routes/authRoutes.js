const express = require('express');
const router = express.Router();
const {
  register,
  login,
  adminLogin,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  createAdmin
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { 
  validateRegister, 
  validateLogin, 
  handleValidationErrors 
} = require('../middleware/validation');

// Public routes
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/admin/login', validateLogin, handleValidationErrors, adminLogin);
router.post('/logout', logout);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

// Initial admin setup (remove this in production)
router.post('/create-admin', createAdmin);

module.exports = router;
