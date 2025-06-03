// services/email.service.js
const nodemailer = require('nodemailer');
const {logger} = require('../utils/logger');
const authConfig = require('../config/auth');

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"Timetable System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to the Timetable Management System',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Your account has been successfully created.</p>
        <p>You can now login to the system using your credentials.</p>
        <p>If you have any questions, please contact the admin.</p>
      `
    });
    logger.info(`Welcome email sent to: ${email}`);
  } catch (error) {
    logger.error(`Error sending welcome email to ${email}: ${error.message}`);
  }
};

const sendPasswordResetEmail = async (email, name, resetUrl) => {
  try {
    await transporter.sendMail({
      from: `"Timetable System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Hello, ${name}</h1>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });
    logger.info(`Password reset email sent to: ${email}`);
  } catch (error) {
    logger.error(`Error sending password reset email to ${email}: ${error.message}`);
  }
};

const sendPasswordChangedConfirmation = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"Timetable System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Changed Successfully',
      html: `
        <h1>Hello, ${name}</h1>
        <p>Your password has been successfully changed.</p>
        <p>If you didn't make this change, please contact the admin immediately.</p>
      `
    });
    logger.info(`Password change confirmation sent to: ${email}`);
  } catch (error) {
    logger.error(`Error sending password change confirmation to ${email}: ${error.message}`);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordChangedConfirmation
};