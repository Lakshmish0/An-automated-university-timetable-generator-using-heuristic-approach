// utils/logger.js
const winston = require('winston');
const { combine, timestamp, printf, colorize, align } = winston.format;
const path = require('path');

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    logFormat
  ),
  transports: [
    // Console transport
    new winston.transports.Console(),
    // File transports (only in production)
    ...(process.env.NODE_ENV === 'production' ? [
      new winston.transports.File({
        filename: path.join(__dirname, '../../logs/error.log'),
        level: 'error'
      }),
      new winston.transports.File({
        filename: path.join(__dirname, '../../logs/combined.log')
      })
    ] : [])
  ],
  exitOnError: false
});

// Morgan stream for HTTP logging
const morganStream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

// Custom logging methods
const logApiRequest = (req) => {
  logger.info(`${req.method} ${req.originalUrl} - ${req.ip} - ${req.get('User-Agent')}`);
};

const logApiResponse = (req, res, data) => {
  logger.debug(`Response for ${req.method} ${req.originalUrl}: ${JSON.stringify(data)}`);
};

// Error logging with context
const logError = (error, context = {}) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    ...context
  });
};

module.exports = {
  logger,
  morganStream,
  logApiRequest,
  logApiResponse,
  logError
};