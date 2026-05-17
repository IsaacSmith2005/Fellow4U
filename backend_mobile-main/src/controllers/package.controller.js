const Package = require('../models/Package.model');

// @desc    Get all packages
// @route   GET /api/v1/packages
// @access  Public
exports.getPackages = async (req, res, next) => {
  try {
    const packages = await Package.find().populate({
      path: 'fellow',
      select: 'name email'
    });

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single package
// @route   GET /api/v1/packages/:id
// @access  Public
exports.getPackage = async (req, res, next) => {
  try {
    const package = await Package.findById(req.params.id).populate({
      path: 'fellow',
      select: 'name email'
    });

    if (!package) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new package
// @route   POST /api/v1/packages
// @access  Private (Fellow/Admin)
exports.createPackage = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.fellow = req.user.id;

    const package = await Package.create(req.body);

    res.status(201).json({
      success: true,
      data: package
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update package
// @route   PUT /api/v1/packages/:id
// @access  Private (Fellow/Admin)
exports.updatePackage = async (req, res, next) => {
  try {
    let package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }

    // Make sure user is package owner or admin
    if (package.fellow.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to update this package' });
    }

    package = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete package
// @route   DELETE /api/v1/packages/:id
// @access  Private (Fellow/Admin)
exports.deletePackage = async (req, res, next) => {
  try {
    const package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }

    // Make sure user is package owner or admin
    if (package.fellow.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this package' });
    }

    await package.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
