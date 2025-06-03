// controllers/auth/forgotPassword.controller.js
const User = require('../../models/User.model');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const {logger} = require('../../utils/logger');
const emailService = require('../../services/email.service');

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Password reset requested for non-existent email: ${email}`);
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a reset link has been sent'
      });
    }

    // 2. Generate reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { id: user._id },
      authConfig.jwt.secret,
      { expiresIn: authConfig.resetToken.expiresIn }
    );

    // 3. Save token to user (optional, for invalidation if needed)
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // 4. Send reset email
    const resetUrl = `${authConfig.frontend.resetPasswordPage}?token=${resetToken}`;
    await emailService.sendPasswordResetEmail(user.email, user.firstName, resetUrl);

    logger.info(`Password reset initiated for user: ${user._id}`);

    // 5. Respond
    res.status(200).json({
      success: true,
      message: 'If the email exists, a reset link has been sent'
    });

  } catch (error) {
    logger.error(`Forgot password error: ${email}: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error processing password reset'
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // 1. Verify token
    const decoded = jwt.verify(token, authConfig.jwt.secret);

    // 2. Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token'
      });
    }

    // 3. Update password
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    logger.info(`Password reset completed for user: ${user._id}`);

    // 4. Send confirmation email
    await emailService.sendPasswordChangedConfirmation(user.email, user.firstName);

    // 5. Respond
    res.status(200).json({
      success: true,
      message: 'Password reset successful. Please login with your new password.'
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        error: 'Reset token has expired'
      });
    }
    logger.error(`Reset password error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error resetting password'
    });
  }
};

module.exports = { forgotPassword, resetPassword };