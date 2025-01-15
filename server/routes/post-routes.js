const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controllers/user-controller');
const {
  createPost,
  getPosts,
  getMyPosts,
  updatePost,
  deletePost
} = require('../controllers/post-controller');

// Create a new post
router.post('/posts', verifyToken, createPost);

// Get all posts
router.get('/posts', verifyToken, getPosts);

// Get my posts
router.get('/my-posts', verifyToken, getMyPosts);

// Update a post
router.put('/posts/:id', verifyToken, updatePost);

// Delete a post
router.delete('/posts/:id', verifyToken, deletePost);

module.exports = router;