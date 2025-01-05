const Post = require('../model/Post');
const Mentor = require('../model/Mentor');
const asyncWrapper = require('../middleware/asyncWrapper');

exports.createPost = asyncWrapper(async (req, res) => {
  const { title, content, visibility, showAllSchools } = req.body;
  
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const authorId = req.user._id;
  const mentor = await Mentor.findById(authorId);
  
  if (!mentor) {
    return res.status(403).json({ message: 'Only mentors can create posts' });
  }

  const post = new Post({
    title,
    content,
    author: authorId,
    visibility,
    school: mentor.school,
    showAllSchools
  });

  await post.save();
  res.status(201).json(post);
});

exports.getPosts = asyncWrapper(async (req, res) => {
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

  query.visibility = { $in: visibilityOptions };

  // Filter by school
  if (req.user.school) {
    query.$or = [
      { school: req.user.school },
      { showAllSchools: true }
    ];
  }

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .populate('author', 'ime prezime')
    .populate('school', 'name');

  res.json({ posts: posts || [] });
});

exports.getMyPosts = asyncWrapper(async (req, res) => {
  const posts = await Post.find({ author: req.user._id })
    .sort({ createdAt: -1 })
    .populate('author', 'ime prezime')
    .populate('school', 'name');

  res.json({ posts: posts || [] });
});

exports.updatePost = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { title, content, visibility, showAllSchools } = req.body;

  const post = await Post.findOneAndUpdate(
    { _id: id, author: req.user._id },
    { 
      title, 
      content, 
      visibility, 
      showAllSchools,
      updatedAt: Date.now()
    },
    { new: true }
  );

  if (!post) {
    return res.status(404).json({ message: 'Post not found or unauthorized' });
  }

  res.json(post);
});

exports.deletePost = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findOneAndDelete({ _id: id, author: req.user._id });
  
  if (!post) {
    return res.status(404).json({ message: 'Post not found or unauthorized' });
  }

  res.json({ message: 'Post deleted successfully' });
}); 