const FellowProfile = require('../models/FellowProfile.model');
const User = require('../models/User.model');

// @desc    Get all fellows with filters
// @route   GET /api/v1/fellows
// @access  Public
exports.getFellows = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    query = FellowProfile.find(reqQuery).populate({
      path: 'user',
      select: 'firstName lastName email avatar'
    });

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    const fellows = await query;

    res.status(200).json({
      success: true,
      count: fellows.length,
      data: fellows
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single fellow
// @route   GET /api/v1/fellows/:id
// @access  Public
exports.getFellow = async (req, res, next) => {
  try {
    const fellow = await FellowProfile.findById(req.params.id).populate({
      path: 'user',
      select: 'firstName lastName email avatar'
    });

    if (!fellow) {
      return res.status(404).json({ success: false, error: 'Fellow not found' });
    }

    res.status(200).json({
      success: true,
      data: fellow
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create/Update fellow profile
// @route   POST /api/v1/fellows
// @access  Private (Fellow only)
exports.upsertFellowProfile = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    let profile = await FellowProfile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await FellowProfile.findOneAndUpdate(
        { user: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      // Create
      profile = await FellowProfile.create(req.body);
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    next(err);
  }
};
