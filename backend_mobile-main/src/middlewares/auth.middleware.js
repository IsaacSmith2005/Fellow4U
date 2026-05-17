// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const logger = require('../utils/logger');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Get token from header or cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    logger.warn('No token provided');
    return res.status(401).json({
      success: false,
      message: 'Không có quyền truy cập. Vui lòng đăng nhập.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      logger.warn('User not found for token', { token });
      return res.status(401).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    // Check if user is active
    if (req.user.isActive === false) {
      logger.warn('Login attempt with inactive account', { userId: req.user._id });
      return res.status(403).json({
        success: false,
        message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.'
      });
    }

    next();
  } catch (err) {
    logger.error('Authentication error:', { error: err.message });
    return res.status(401).json({
      success: false,
      message: 'Không có quyền truy cập. Vui lòng đăng nhập lại.'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Người dùng với vai trò ${req.user?.role || 'không xác định'} không có quyền truy cập tài nguyên này`
      });
    }
    next();
  };
};