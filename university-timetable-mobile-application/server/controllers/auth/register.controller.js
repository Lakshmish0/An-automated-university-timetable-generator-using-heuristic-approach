// controllers/auth/register.controller.js
const User = require('../../models/User.model');
const Student = require('../../models/Student.model');
const Teacher = require('../../models/Teacher.model');
const {logger} = require('../../utils/logger');
const { ROLES } = require('../../config/constants');
const emailService = require('../../services/email.service');

const register = async (req, res) => {
  console.log(req.body)
  try {
    
    const { name, email, password, confirmPassword, role, usn, phone} = req.body;
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
        error: 'Email already exists'
      });
    }

    // 2. Create base user
    const userData = {
      name,
      email,
      password,
      role
    };

    let user;
    
    // 3. Create role-specific user
    switch (role) {
      case ROLES.STUDENT:
        user = new Student({
          ...userData,
          usn,
        });
        break;

      case ROLES.TEACHER:
        user = new Teacher({
          ...userData,
          phone,
          designation: 'Assistant Professor' // Default
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid role specified'
        });
    }

    // 4. Save user
    await user.save();
    logger.info(`New user registered: ${user._id} (${user.role})`);

    // 5. Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.name);

    // 6. Respond with success
    res.status(201).json({
      message: "Registration successful. Please login.",
      success: true
    });

  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error during registration'
    });
  }
};

module.exports = { register };