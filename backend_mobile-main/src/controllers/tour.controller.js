const Tour = require('../models/Tour.model');

// @desc    Lấy tất cả các tour
// @route   GET /api/v1/tours
// @access  Public
exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find().populate('provider', 'firstName lastName');
    res.status(200).json({ success: true, count: tours.length, data: tours });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Lấy thông tin chi tiết một tour
// @route   GET /api/v1/tours/:id
// @access  Public
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate('provider', 'firstName lastName');
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour không tìm thấy' });
    }
    res.status(200).json({ success: true, data: tour });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Tạo tour mới
// @route   POST /api/v1/tours
// @access  Private
exports.createTour = async (req, res) => {
  try {
    req.body.provider = req.user.id;
    const tour = await Tour.create(req.body);
    res.status(201).json({ success: true, data: tour });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Cập nhật tour
// @route   PUT /api/v1/tours/:id
// @access  Private
exports.updateTour = async (req, res) => {
  try {
    let tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour không tìm thấy' });
    }

    // Kiểm tra quyền sở hữu
    if (tour.provider.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Bạn không có quyền cập nhật tour này' });
    }

    tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: tour });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Xóa tour
// @route   DELETE /api/v1/tours/:id
// @access  Private
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour không tìm thấy' });
    }

    // Kiểm tra quyền sở hữu
    if (tour.provider.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Bạn không có quyền xóa tour này' });
    }

    await tour.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};