// services/auth.service.js
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const User = require('../models/User.model');
const logger = require('../utils/logger');

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'No refresh token provided'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, authConfig.jwt.secret);
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      authConfig.jwt.secret,
      { expiresIn: authConfig.jwt.accessToken.expiresIn }
    );

    // Respond with new token
    res.status(200).json({
      success: true,
      accessToken
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Refresh token expired'
      });
    }
    logger.error(`Token refresh error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error refreshing token'
    });
  }
};

const logout = async (req, res) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      ...authConfig.cookies,
      maxAge: 0
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error during logout'
    });
  }
};

module.exports = {
  refreshToken,
  logout
};