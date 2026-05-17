// src/controllers/auth.controller.js
const User = require('../models/User.model');
const ErrorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');
const crypto = require('crypto'); 

// Validation function updated for new fields
const validateRegisterInput = (data) => {
  const { firstName, lastName, country, email, password } = data;
  const errors = {};

  if (!firstName || firstName.trim().length === 0) {
    errors.firstName = 'First name is required';
  }
  if (!lastName || lastName.trim().length === 0) {
    errors.lastName = 'Last name is required';
  }
  if (!country || country.trim().length === 0) {
    errors.country = 'Country is required';
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Invalid email format';
  }
  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res) => {
  logger.info('Register request received', { body: req.body });

  try {
    // Validate input
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
      logger.warn('Validation failed', { errors });
      return res.status(400).json({
        success: false,
        message: 'Invalid data provided',
        errors
      });
    }

    const { firstName, lastName, country, email, password, role, phoneNumber, city } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn('Registration failed - Email already in use', { email });
      return res.status(400).json({
        success: false,
        message: 'Email is already in use'
      });
    }

    // Create user with new fields
    const user = await User.create({
      firstName,
      lastName,
      country,
      email,
      password,
      role: role || 'traveler',
      phoneNumber,
      city
    });

    logger.info('User registered successfully', { userId: user._id });
    
    // Generate token
    const token = user.getSignedJwtToken();
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    logger.error('Registration error:', { error: err.message, stack: err.stack });
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Account is locked'
      });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'There is no user with that email'
      });
    }

    // 1. Tạo reset token (sử dụng crypto)
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 2. Hash và lưu vào database
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // 3. Set thời gian hết hạn (ví dụ: 10 phút)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    logger.info(`Password reset token generated for: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Email sent'
    });
  } catch (err) {
    logger.error('Forgot password error:', err);
    res.status(500).json({
      success: false,
      message: 'Email could not be sent'
    });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = (req, res) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công'
    });
  } catch (err) {
    logger.error('Logout error:', { error: err.message });
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đăng xuất',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('guideProfile');
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};
