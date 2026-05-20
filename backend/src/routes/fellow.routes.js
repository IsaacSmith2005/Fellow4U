const express = require('express');
const {
  getFellows,
  getFellow,
  upsertFellowProfile
} = require('../controllers/fellow.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router
  .route('/')
  .get(getFellows)
  .post(protect, authorize('fellow'), upsertFellowProfile);

router.route('/:id').get(getFellow);

module.exports = router;
