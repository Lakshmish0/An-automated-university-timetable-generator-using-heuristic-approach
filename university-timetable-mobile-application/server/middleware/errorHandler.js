// middleware/errorHandler.js
const {logger} = require('../utils/logger');
const { ROLES } = require('../config/constants');

// Custom error classes
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends ApiError {
  constructor(errors) {
    super(400, 'Validation failed');
    this.errors = errors;
  }
}

class NotFoundError extends ApiError {
  constructor(resource) {
    super(404, `${resource || 'Resource'} not found`);
  }
}

// Central error handler
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    err.statusCode = 401;
    err.message = 'Invalid token';
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    err = new ValidationError(errors);
  }

  // Handle CastError (invalid MongoDB ID)
  if (err.name === 'CastError') {
    err = new NotFoundError('Resource');
  }

  // Default to 500 if no status code
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    error: err.message || 'Internal Server Error'
  };

  // Include validation errors if present
  if (err.errors) {
    response.errors = err.errors;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  // Send response
  res.status(statusCode).json(response);
};

// 404 Not Found handler
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.originalUrl} not found`
  });
};

// Async handler wrapper (eliminates try-catch blocks)
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  ApiError,
  ValidationError,
  NotFoundError,
  errorHandler,
  notFound,
  asyncHandler
};