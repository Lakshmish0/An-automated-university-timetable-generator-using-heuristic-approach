// middleware/role.js
const { ROLES } = require('../config/constants');
const {logger} = require('../utils/logger');

// Higher-order function to create role check middleware
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // 1. Check if user is authenticated
      if (!req.user) {
        logger.warn('Role check without authentication');
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // 2. Check if user has required role
      if (!allowedRoles.includes(req.user.role)) {
        logger.warn(`User ${req.user._id} attempted unauthorized ${req.method} on ${req.originalUrl}`);
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions'
        });
      }

      // 3. Special coordinator department check
      if (req.user.role === ROLES.COORDINATOR && req.params.departmentId) {
        if (req.user.department.toString() !== req.params.departmentId) {
          logger.warn(`Coordinator ${req.user._id} attempted to access other department data`);
          return res.status(403).json({
            success: false,
            error: 'Department access denied'
          });
        }
      }

      logger.info(`Role access granted: ${req.user.role} for ${req.originalUrl}`);
      next();

    } catch (error) {
      logger.error(`Role check error: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Server error during authorization'
      });
    }
  };
};

// Specific role middlewares
const requireStudent = requireRole(ROLES.STUDENT);
const requireTeacher = requireRole(ROLES.TEACHER);
const requireCoordinator = requireRole(ROLES.COORDINATOR);
const requireAdmin = requireRole(ROLES.ADMIN);
const requireStaff = requireRole(ROLES.TEACHER, ROLES.COORDINATOR, ROLES.ADMIN);

module.exports = {
  requireRole,
  requireStudent,
  requireTeacher,
  requireCoordinator,
  requireAdmin,
  requireStaff
};