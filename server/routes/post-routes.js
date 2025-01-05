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

router.post('/posts', verifyToken, createPost);
router.get('/posts', verifyToken, getPosts);
router.get('/my-posts', verifyToken, getMyPosts);
router.put('/posts/:id', verifyToken, updatePost);
router.delete('/posts/:id', verifyToken, deletePost);

module.exports = router; 