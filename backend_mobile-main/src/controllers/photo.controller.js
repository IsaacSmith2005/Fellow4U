const Photo = require('../models/Photo.model');

exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: photos.length, data: photos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPhoto = async (req, res) => {
  try {
    const photo = await Photo.findOne({ _id: req.params.id, user: req.user.id });
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }
    res.status(200).json({ success: true, data: photo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createPhoto = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const photo = await Photo.create(req.body);
    res.status(201).json({ success: true, data: photo });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }
    res.status(200).json({ success: true, message: 'Photo deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};