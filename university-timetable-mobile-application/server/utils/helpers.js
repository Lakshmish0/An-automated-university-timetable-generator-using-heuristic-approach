// utils/helpers.js
const mongoose = require('mongoose');
const { ROLES } = require('../config/constants');
const logger = require('./logger');

// Convert object to MongoDB update format
const toMongoUpdate = (obj) => {
  return { $set: obj };
};

// Validate MongoDB ID
const isValidId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Pagination helper
const paginate = (query, options = {}) => {
  const limit = Math.min(parseInt(options.limit) || 10, 100);
  const page = parseInt(options.page) || 1;
  const skip = (page - 1) * limit;

  return query.skip(skip).limit(limit);
};

// Generate random alphanumeric string
const generateRandomString = (length = 8) => {
  return Math.random().toString(36).substring(2, 2 + length);
};

// Format user data for response (removes sensitive fields)
const formatUserResponse = (user) => {
  if (!user) return null;
  
  const formatted = user.toObject ? user.toObject() : user;
  const { password, resetToken, resetTokenExpires, ...safeUser } = formatted;
  
  // Add role-specific fields
  if (user.role === ROLES.STUDENT) {
    safeUser.usn = user.usn;
    safeUser.semester = user.semester;
    safeUser.section = user.section;
  } else if (user.role === ROLES.TEACHER) {
    safeUser.designation = user.designation;
    safeUser.qualifications = user.qualifications;
  } else if (user.role === ROLES.COORDINATOR) {
    safeUser.academicYear = user.academicYear;
    safeUser.isHod = user.isHod;
  }
  
  return safeUser;
};

// Generate timetable conflict message
const generateConflictMessage = (conflict) => {
  const { type, data } = conflict;
  switch (type) {
    case 'teacher':
      return `Teacher ${data.teacher.name} is already assigned to ${data.subject.name} during this time`;
    case 'room':
      return `Room ${data.room} is already occupied by ${data.subject.name}`;
    case 'student':
      return `Students have overlapping class with ${data.subject.name}`;
    default:
      return 'Scheduling conflict detected';
  }
};

// Async delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  toMongoUpdate,
  isValidId,
  paginate,
  generateRandomString,
  formatUserResponse,
  generateConflictMessage,
  delay
};