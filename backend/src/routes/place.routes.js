const express = require('express');
const { getPlaces, createPlace } = require('../controllers/place.controller');
const { protect } = require('../middlewares/auth.middleware');
const router = express.Router();
router.route('/').get(getPlaces).post(protect, createPlace);
module.exports = router;