const Blog = require('../models/Blog.model');
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'firstName lastName');
    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.createBlog = async (req, res) => {
  try {
    req.body.author = req.user.id;
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};