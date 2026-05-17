const express = require('express');
const { getPhotos, getPhoto, createPhoto, deletePhoto } = require('../controllers/photo.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/').get(protect, getPhotos).post(protect, createPhoto);
router.route('/:id').get(protect, getPhoto).delete(protect, deletePhoto);

module.exports = router;