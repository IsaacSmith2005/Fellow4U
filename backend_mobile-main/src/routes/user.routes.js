const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const User = require('../models/User.model');

const router = express.Router();

// Get user profile
router.get('/profile', protect, (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;
    
    // Find user and update
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy người dùng' 
      });
    }

    // Update fields only if provided
    if (firstName !== undefined && firstName !== null) user.firstName = firstName;
    if (lastName !== undefined && lastName !== null) user.lastName = lastName;
    if (password !== undefined && password !== null && password !== '') {
      user.password = password; // Will be hashed by pre-save middleware
    }

    // Don't modify role field - keep existing role
    console.log('Updating user with role:', user.role);

    await user.save();

    // Return updated user without password
    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({ 
      success: true, 
      data: updatedUser,
      message: 'Cập nhật profile thành công'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Dữ liệu không hợp lệ',
        error: error.message
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server khi cập nhật profile' 
    });
  }
});

module.exports = router;
