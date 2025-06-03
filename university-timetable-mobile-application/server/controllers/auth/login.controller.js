// controllers/auth/login.controller.js
const jwt = require('jsonwebtoken');
const User = require('../../models/User.model');
const authConfig = require('../../config/auth');
const {logger} = require('../../utils/logger');
const { ROLES } = require('../../config/constants');
const { token } = require('morgan');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      logger.warn(`Login attempt for non-existent email: ${email}`);
      return res.status(401).json({
        message : 'Invalid email or password', 
        success: false,
        error: 'Invalid email or password' 
      });
    }

    // 2. Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`Invalid password attempt for user: ${user._id}`);
      return res.status(401).json({ 
        message: 'Invalid email or password',
        success: false,
        error: 'Invalid email or password' 
      });
    }

    // 3. Check if account is active
    if (!user.isActive) {
      logger.warn(`Login attempt for inactive account: ${user._id}`);
      return res.status(403).json({ 
        message: 'Account is inactive. Please contact admin.',
        success: false,
        error: 'Account is inactive. Please contact admin.' 
      });
    }

    // 4. Generate tokens
    const tokens = authConfig.generateTokens(user);
    
    // 5. Set refresh token in cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      ...authConfig.cookies,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // 6. Update last login
    user.lastLogin = new Date();
    await user.save();

    logger.info(`User logged in: ${user._id}`);

    // 7. Respond with user data and token
    res.status(200).json({
      success: true,
      accessToken: tokens.accessToken,
      user: {
        email: user.email,
        role: user.role,
        name: user.name
      }
    });

  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ 
      message : 'Server error during login',
      success: false,
      error: 'Server error during login' 
    });
  }
};

module.exports = { login };