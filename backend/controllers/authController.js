const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError, sendCreated, asyncHandler, sanitizeUser } = require('../utils/helpers');
const bcrypt = require('bcryptjs');

// Register user
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return sendError(res, 400, 'User already exists with this email');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone
  });

  // Generate token
  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  // Update last login
  await user.update({ lastLogin: new Date() });

  sendCreated(res, 'User registered successfully', {
    user: sanitizeUser(user),
    token
  });
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return sendError(res, 401, 'Invalid credentials');
  }

  // Check password
  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    return sendError(res, 401, 'Invalid credentials');
  }

  // Check if user is active
  if (!user.isActive) {
    return sendError(res, 401, 'Account is deactivated');
  }

  // Generate token
  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  // Update last login
  await user.update({ lastLogin: new Date() });

  sendSuccess(res, 'Login successful', {
    user: sanitizeUser(user),
    token
  });
});

// Admin login
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find admin user
  const user = await User.findOne({ 
    where: { 
      email,
      role: 'admin'
    }
  });

  if (!user) {
    return sendError(res, 401, 'Invalid admin credentials');
  }

  // Check password
  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    return sendError(res, 401, 'Invalid admin credentials');
  }

  // Check if user is active
  if (!user.isActive) {
    return sendError(res, 401, 'Admin account is deactivated');
  }

  // Generate token
  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  // Update last login
  await user.update({ lastLogin: new Date() });

  sendSuccess(res, 'Admin login successful', {
    user: sanitizeUser(user),
    token
  });
});

// Get current user profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  
  if (!user) {
    return sendError(res, 404, 'User not found');
  }

  sendSuccess(res, 'Profile retrieved successfully', {
    user: sanitizeUser(user)
  });
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return sendError(res, 404, 'User not found');
  }

  // Update user
  await user.update({
    name: name || user.name,
    phone: phone || user.phone
  });

  sendSuccess(res, 'Profile updated successfully', {
    user: sanitizeUser(user)
  });
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return sendError(res, 404, 'User not found');
  }

  // Verify current password
  const isValidPassword = await user.comparePassword(currentPassword);
  if (!isValidPassword) {
    return sendError(res, 400, 'Current password is incorrect');
  }

  // Update password
  await user.update({ password: newPassword });

  sendSuccess(res, 'Password changed successfully');
});

// Logout (client-side token removal)
const logout = asyncHandler(async (req, res) => {
  sendSuccess(res, 'Logout successful');
});

// Create admin user (for initial setup)
const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if admin already exists
  const existingAdmin = await User.findOne({ 
    where: { 
      role: 'admin' 
    }
  });

  if (existingAdmin) {
    return sendError(res, 400, 'Admin user already exists');
  }

  // Create admin user
  const admin = await User.create({
    name,
    email,
    password,
    role: 'admin'
  });

  sendCreated(res, 'Admin user created successfully', {
    user: sanitizeUser(admin)
  });
});

module.exports = {
  register,
  login,
  adminLogin,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  createAdmin
};
