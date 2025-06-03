// config/auth.js
const jwt = require('jsonwebtoken');
const {logger} = require('../utils/logger');

const authConfig = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_strong_secret_key_here',
    algorithm: 'HS256',
    accessToken: {
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m'
    },
    refreshToken: {
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d'
    }
  },

  // Password reset token
  resetToken: {
    expiresIn: '1h'
  },

  // Cookie settings (for frontend integration)
  cookies: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  },

  // Generate JWT Tokens
  generateTokens: (user) => {
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      authConfig.jwt.secret,
      { expiresIn: authConfig.jwt.accessToken.expiresIn }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      authConfig.jwt.secret,
      { expiresIn: authConfig.jwt.refreshToken.expiresIn }
    );

    return { accessToken, refreshToken };
  },

  // Verify JWT Token
  verifyToken: (token) => {
    try {
      return jwt.verify(token, authConfig.jwt.secret);
    } catch (err) {
      logger.error(`JWT verification failed: ${err.message}`);
      return null;
    }
  },

  // Frontend auth endpoints (for CORS and redirects)
  frontend: {
    loginRedirect: process.env.FRONTEND_LOGIN_REDIRECT || 'http://localhost:19006/app',
    resetPasswordPage: process.env.FRONTEND_RESET_PASSWORD_PAGE || 'http://localhost:19006/reset-password'
  }
};

module.exports = authConfig;