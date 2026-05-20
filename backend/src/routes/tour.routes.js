const express = require('express');
const {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour
} = require('../controllers/tour.controller');

const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router
  .route('/')
  .get(getTours)
  .post(protect, createTour);

router
  .route('/:id')
  .get(getTour)
  .put(protect, updateTour)
  .delete(protect, deleteTour);

module.exports = router;