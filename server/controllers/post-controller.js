const Post = require('../model/Post');
const Mentor = require('../model/Mentor');
const asyncWrapper = require('../middleware/asyncWrapper');
const { Op } = require('sequelize');

// Create a new post
const createPost = asyncWrapper(async (req, res) => {
  const { title, content, visibility, showAllSchools } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const authorId = req.user.id; // Assuming req.user.id is the mentor's ID
  const mentor = await Mentor.findByPk(authorId);

  if (!mentor) {
    return res.status(403).json({ message: 'Only mentors can create posts' });
  }

  const post = await Post.create({
    title,
    content,
    visibility,
    mentorId: authorId,
    school: mentor.school,
    showAllSchools,
  });

  res.status(201).json(post);
});

// Get all posts
const getPosts = asyncWrapper(async (req, res) => {
  const { isAdmin, isMentor, isStudent } = req.user;
  let query = {};

  // Filter by visibility based on user roles
  let visibilityOptions = ['public']; // Everyone can see public posts

  if (isAdmin) {
    visibilityOptions.push('admin');
  }
  if (isMentor) {
    visibilityOptions.push('mentor');
  }

  query.visibility = { [Op.in]: visibilityOptions };

  // Filter by school
  if (req.user.school) {
    query = {
      ...query,
      [Op.or]: [
        { school: req.user.school },
        { showAllSchools: true },
      ],
    };
  }

  const posts = await Post.findAll({
    where: query,
    order: [['createdAt', 'DESC']],
    include: [{ model: Mentor, attributes: ['ime', 'prezime'] }],
  });

  res.json({ posts: posts || [] });
});

// Get my posts
const getMyPosts = asyncWrapper(async (req, res) => {
  const posts = await Post.findAll({
    where: { mentorId: req.user.id },
    order: [['createdAt', 'DESC']],
    include: [{ model: Mentor, attributes: ['ime', 'prezime'] }],
  });

  res.json({ posts: posts || [] });
});

// Update a post
const updatePost = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { title, content, visibility, showAllSchools } = req.body;

  const post = await Post.findOne({
    where: { id, mentorId: req.user.id },
  });

  if (!post) {
    return res.status(404).json({ message: 'Post not found or unauthorized' });
  }

  post.title = title;
  post.content = content;
  post.visibility = visibility;
  post.showAllSchools = showAllSchools;
  post.updatedAt = new Date();

  await post.save();

  res.json(post);
});

// Delete a post
const deletePost = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findOne({
    where: { id, mentorId: req.user.id },
  });

  if (!post) {
    return res.status(404).json({ message: 'Post not found or unauthorized' });
  }

  await Post.destroy({ where: { id } });

  res.json({ message: 'Post deleted successfully' });
});

module.exports = {
  createPost,
  getPosts,
  getMyPosts,
  updatePost,
  deletePost,
}; 