const { User, Property } = require('../models');
const { sendSuccess, sendError, asyncHandler, getPagination, getPagingData, sanitizeUser } = require('../utils/helpers');
const { Op, sequelize } = require('sequelize');

// Get all users (Admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 0, size = 10, search, role } = req.query;
  const { limit, offset } = getPagination(page, size);

  const whereConditions = {};
  
  if (search) {
    whereConditions[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } }
    ];
  }
  
  if (role) {
    whereConditions.role = role;
  }

  const data = await User.findAndCountAll({
    where: whereConditions,
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Property,
        as: 'properties',
        attributes: ['id', 'title', 'type', 'status'],
        required: false
      }
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    distinct: true
  });

  const pagination = getPagingData(data, page, limit);

  sendSuccess(res, 'Users retrieved successfully', pagination);
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Property,
        as: 'properties',
        attributes: ['id', 'title', 'type', 'price', 'status', 'createdAt']
      }
    ]
  });

  if (!user) {
    return sendError(res, 404, 'User not found');
  }

  sendSuccess(res, 'User retrieved successfully', { user });
});

// Update user status (Admin only)
const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const user = await User.findByPk(id);
  if (!user) {
    return sendError(res, 404, 'User not found');
  }

  await user.update({ isActive });

  sendSuccess(res, `User ${isActive ? 'activated' : 'deactivated'} successfully`, {
    user: sanitizeUser(user)
  });
});

// Delete user (Admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Prevent admin from deleting themselves
  if (parseInt(id) === req.user.id) {
    return sendError(res, 400, 'Cannot delete your own account');
  }

  const user = await User.findByPk(id);
  if (!user) {
    return sendError(res, 404, 'User not found');
  }

  await user.destroy();

  sendSuccess(res, 'User deleted successfully');
});

// Get user dashboard stats
const getUserStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const stats = await Property.findAll({
    where: { userId },
    attributes: [
      'status',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['status'],
    raw: true
  });

  const totalProperties = await Property.count({ where: { userId } });
  const totalViews = await Property.sum('views', { where: { userId } });

  const formattedStats = {
    totalProperties,
    totalViews: totalViews || 0,
    byStatus: stats.reduce((acc, stat) => {
      acc[stat.status] = parseInt(stat.count);
      return acc;
    }, {})
  };

  sendSuccess(res, 'User statistics retrieved successfully', { stats: formattedStats });
});

// Admin dashboard stats
const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.count();
  const totalProperties = await Property.count();
  const totalActiveProperties = await Property.count({ 
    where: { 
      status: 'available',
      isApproved: true 
    } 
  });
  const totalPendingApproval = await Property.count({ 
    where: { isApproved: false } 
  });

  // Properties by type
  const propertiesByType = await Property.findAll({
    attributes: [
      'type',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['type'],
    raw: true
  });

  // Recent registrations (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentUsers = await User.count({
    where: {
      createdAt: {
        [Op.gte]: thirtyDaysAgo
      }
    }
  });

  const stats = {
    totalUsers,
    totalProperties,
    totalActiveProperties,
    totalPendingApproval,
    recentUsers,
    propertiesByType: propertiesByType.reduce((acc, item) => {
      acc[item.type] = parseInt(item.count);
      return acc;
    }, {})
  };

  sendSuccess(res, 'Admin statistics retrieved successfully', { stats });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getUserStats,
  getAdminStats
};
