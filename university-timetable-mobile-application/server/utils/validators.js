// utils/validators.js
const { ROLES } = require('../config/constants');
const mongoose = require('mongoose');
const validator = require('validator');
const logger = require('./logger');

// Common validation schemas
const schemas = {
  email: {
    isEmail: {
      validator: validator.isEmail,
      message: 'Invalid email format'
    }
  },
  password: {
    minLength: {
      validator: (val) => val.length >= 8,
      message: 'Password must be at least 8 characters'
    },
    hasUpper: {
      validator: (val) => /[A-Z]/.test(val),
      message: 'Password must contain at least one uppercase letter'
    },
    hasLower: {
      validator: (val) => /[a-z]/.test(val),
      message: 'Password must contain at least one lowercase letter'
    },
    hasNumber: {
      validator: (val) => /[0-9]/.test(val),
      message: 'Password must contain at least one number'
    }
  },
  objectId: {
    isValid: {
      validator: (val) => mongoose.Types.ObjectId.isValid(val),
      message: 'Invalid ID format'
    }
  }
};

// Validate against schema
const validate = (value, schema) => {
  const errors = [];
  
  for (const [rule, { validator, message }] of Object.entries(schema)) {
    if (!validator(value)) {
      errors.push(message);
    }
  }
  
  return errors.length ? errors : null;
};

// Role-specific validators
const validateUserRole = (role, requiredRole) => {
  const roleHierarchy = {
    [ROLES.ADMIN]: 4,
    [ROLES.COORDINATOR]: 3,
    [ROLES.TEACHER]: 2,
    [ROLES.STUDENT]: 1
  };
  
  return roleHierarchy[role] >= roleHierarchy[requiredRole];
};

// Timetable slot validator
const validateTimetableSlot = (slot) => {
  const errors = [];
  
  if (!slot.day || !schemas.day.enum.includes(slot.day)) {
    errors.push('Invalid day');
  }
  
  if (!slot.period || slot.period < 1 || slot.period > 8) {
    errors.push('Invalid period');
  }
  
  if (!slot.duration || slot.duration < 1 || slot.duration > 2) {
    errors.push('Invalid duration');
  }
  
  return errors.length ? errors : null;
};

// USN validator (for VTU)
const validateUSN = (usn) => {
  const usnPattern = /^[1-9][A-Za-z]{2}\d{2}[A-Za-z]{2}\d{3}$/;
  return usnPattern.test(usn);
};

// Bulk validation helper
const validateBulk = (items, validatorFn) => {
  const results = {
    valid: [],
    invalid: []
  };
  
  items.forEach(item => {
    const errors = validatorFn(item);
    if (errors) {
      results.invalid.push({ item, errors });
    } else {
      results.valid.push(item);
    }
  });
  
  return results;
};

module.exports = {
  schemas,
  validate,
  validateUserRole,
  validateTimetableSlot,
  validateUSN,
  validateBulk
};