const express = require('express');
const {
  getPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage
} = require('../controllers/package.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router
  .route('/')
  .get(getPackages)
  .post(protect, authorize('fellow', 'admin'), createPackage);

router
  .route('/:id')
  .get(getPackage)
  .put(protect, authorize('fellow', 'admin'), updatePackage)
  .delete(protect, authorize('fellow', 'admin'), deletePackage);

module.exports = router;
