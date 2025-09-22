const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getUserStats,
  getAdminStats
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// User stats (own stats)
router.get('/stats', getUserStats);

// Admin only routes
router.get('/', authorize('admin'), getAllUsers);
router.get('/admin/stats', authorize('admin'), getAdminStats);
router.get('/:id', authorize('admin'), getUserById);
router.put('/:id/status', authorize('admin'), updateUserStatus);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
