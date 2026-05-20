const Trip = require('../models/Trip.model');

exports.getTrips = async (req, res) => {
  try {
    // Tạm thời lấy TẤT CẢ trips để kiểm tra (bỏ filter user)
    const trips = await Trip.find()
      .populate('host', 'name avatar')
      .sort({ createdAt: -1 });

    console.log(`📊 Backend trả về ${trips.length} trips cho tất cả user`);

    res.status(200).json({ 
      success: true, 
      count: trips.length,
      data: trips 
    });
  } catch (err) {
    console.error("Lỗi getTrips:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('host', 'name avatar');
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    res.status(200).json({ success: true, data: trip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTrip = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const trip = await Trip.create(req.body);
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    res.status(200).json({ success: true, data: trip });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    res.status(200).json({ success: true, message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};