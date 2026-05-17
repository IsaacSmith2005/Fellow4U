// src/middleware/error.middleware.js
const ErrorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');

/**
 * Error handling middleware
 * Handles different types of errors and sends appropriate responses
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error details
  logger.error(err.stack || err.message, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    ...(req.user && { userId: req.user.id })
  });

  // Handle specific error types
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  // Mongoose duplicate key
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value: ${field} already exists`;
    error = new ErrorResponse(message, 400, { [field]: `${field} đã tồn tại` });
  }
  // Mongoose validation error
  else if (err.name === 'ValidationError') {
    const message = 'Validation failed';
    const errors = {};
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
    error = new ErrorResponse(message, 400, errors);
  }
  // JWT errors
  else if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new ErrorResponse(message, 401);
  }
  else if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new ErrorResponse(message, 401);
  }
  
  // Handle errors from Joi or other validation libraries
 // In the error handling section where we handle Joi validation errors
if (err.details) {
  const message = 'Validation error';
  const errors = {};

  // Handle different types of error details
  if (Array.isArray(err.details)) {
    // Handle Joi validation errors (array of errors)
    err.details.forEach((detail) => {
      const path = detail.path ? (Array.isArray(detail.path) ? detail.path[0] : detail.path) : 'unknown';
      errors[path] = detail.message || 'Validation error';
    });
  } else if (typeof err.details === 'object' && err.details !== null) {
    // Handle Mongoose validation errors (object with error messages)
    Object.entries(err.details).forEach(([key, value]) => {
      if (value && value.message) {
        errors[key] = value.message;
      } else if (typeof value === 'string') {
        errors[key] = value;
      } else {
        errors[key] = 'Validation error';
      }
    });
  } else if (typeof err.details === 'string') {
    // Handle simple string error details
    errors.general = err.details;
  }

  // If we still don't have any errors, but there's a message, use that
  if (Object.keys(errors).length === 0 && err.message) {
    errors.general = err.message;
  }

  error = new ErrorResponse(message, 400, errors);
}
  
  // Default to 500 server error
  if (!error.statusCode) {
    error = new ErrorResponse('Lỗi máy chủ', 500);
  }

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(error.details && { errors: error.details }),
    // Only include stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

module.exports = errorHandler;