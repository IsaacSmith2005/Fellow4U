const Place = require('../models/Place.model');
exports.getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json({ success: true, data: places });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.createPlace = async (req, res) => {
  try {
    const place = await Place.create(req.body);
    res.status(201).json({ success: true, data: place });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};