const Experience = require('../models/Experience.model');

// @desc    Lấy tất cả experiences
// @route   GET /api/v1/experiences
// @access  Public
exports.getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find()
      .populate('place', 'name city')
      .populate('guide', 'firstName lastName avatar');
    res.status(200).json({ success: true, count: experiences.length, data: experiences });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Lấy chi tiết một experience
// @route   GET /api/v1/experiences/:id
// @access  Public
exports.getExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id)
      .populate('place', 'name city')
      .populate('guide', 'firstName lastName avatar');
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience không tìm thấy' });
    }
    res.status(200).json({ success: true, data: experience });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Tạo experience mới
// @route   POST /api/v1/experiences
// @access  Private (Guide/Admin)
exports.createExperience = async (req, res) => {
  try {
    if (req.user.role !== 'guide' && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Bạn không có quyền tạo experience' });
    }

    req.body.guide = req.user.id;
    const experience = await Experience.create(req.body);
    res.status(201).json({ success: true, data: experience });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Cập nhật experience
// @route   PUT /api/v1/experiences/:id
// @access  Private
exports.updateExperience = async (req, res) => {
  try {
    let experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience không tìm thấy' });
    }

    if (experience.guide.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Bạn không có quyền cập nhật experience này' });
    }

    experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: experience });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Xóa experience
// @route   DELETE /api/v1/experiences/:id
// @access  Private
exports.deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience không tìm thấy' });
    }

    if (experience.guide.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Bạn không có quyền xóa experience này' });
    }

    await experience.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};