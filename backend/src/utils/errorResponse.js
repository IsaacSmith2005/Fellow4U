// src/utils/errorResponse.js
class ErrorResponse extends Error {
  /**
   * Create custom error response
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {object} [details] - Additional error details
   */
  constructor(message, statusCode, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // This is a known error that we're handling

    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a formatted error response object
   * @returns {object} Formatted error response
   */
  toJSON() {
    return {
      success: false,
      message: this.message,
      statusCode: this.statusCode,
      ...(Object.keys(this.details).length > 0 && { errors: this.details })
    };
  }
}

module.exports = ErrorResponse;