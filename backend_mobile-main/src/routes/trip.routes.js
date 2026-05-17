const express = require('express');
const { getTrips, getTrip, createTrip, updateTrip, deleteTrip } = require('../controllers/trip.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/').get(protect, getTrips).post(protect, createTrip);
router.route('/:id').get(protect, getTrip).put(protect, updateTrip).delete(protect, deleteTrip);

module.exports = router;