// middleware/auth.js
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const {logger }= require('../utils/logger');
const { ROLES } = require('../config/constants');
const User = require('../models/User.model');

const authenticate = async (req, res, next) => {
  try {
    // 1. Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      logger.warn('Authentication attempt without token');
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, authConfig.jwt.secret);
    
    // 3. Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      logger.warn(`Token valid but user not found: ${decoded.id}`);
      return res.status(401).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // 4. Check if user is active
    if (!user.isActive) {
      logger.warn(`Login attempt for inactive user: ${user._id}`);
      return res.status(403).json({ 
        success: false,
        error: 'Account is inactive' 
      });
    }

    // 5. Attach user to request
    req.user = user;
    req.token = token;
    
    logger.info(`User authenticated: ${user._id} (${user.role})`);
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Expired token attempt');
      return res.status(401).json({ 
        success: false,
        error: 'Token expired' 
      });
    }
    
    logger.error(`Authentication error: ${error.message}`);
    res.status(401).json({ 
      success: false,
      error: 'Invalid authentication' 
    });
  }
};

// Middleware to optionally authenticate (for public routes with optional auth)
const optionalAuthenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, authConfig.jwt.secret);
      const user = await User.findById(decoded.id);
      
      if (user && user.isActive) {
        req.user = user;
        req.token = token;
      }
    }
    
    next();
  } catch (error) {
    // Ignore token errors for optional auth
    next();
  }
};

module.exports = { 
  authenticate,
  optionalAuthenticate 
};