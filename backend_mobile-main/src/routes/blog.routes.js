const express = require('express');
const { getBlogs, createBlog } = require('../controllers/blog.controller');
const { protect } = require('../middlewares/auth.middleware');
const router = express.Router();
router.route('/').get(getBlogs).post(protect, createBlog);
module.exports = router;