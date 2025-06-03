const express = require('express');
const router = express.Router();

const { login } = require('../controllers/auth/login.controller');
const { register } = require('../controllers/auth/register.controller');
const { forgotPassword, resetPassword } = require('../controllers/auth/forgotPassword.controller');
const { refreshToken, logout } = require('../services/auth.service');

// Public routes
router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Token refresh
router.post('/refresh', refreshToken);

// Protected routes
router.post('/logout', logout);

module.exports = router;