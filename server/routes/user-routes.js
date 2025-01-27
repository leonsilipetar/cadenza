const express = require('express');
const {
  signup,
  login,
  verifyToken,
  refreshToken,
  getUser,
  logout,
  getKorisnici,
  getDetaljiKorisnika,
  updateDetaljiKorisnika,
  getAllStudents,
  searchUsersAndMentors,
  getUserInvoices,
  updatePassword,
  deleteUser,
} = require('../controllers/user-controller.js');
const {
  signupMentor,
  getMentori,
  updateDetaljiMentora,
  getMentorStudents,
  getStudentsRaspored,
  getStudentRaspored,
  addScheduleToStudent,
  deleteRaspored,
} = require('../controllers/mentor-controller.js');
const { updateTeorija, getTeorija, deleteTermin } = require('../controllers/teorija-controller');
const { getSchools } = require('../controllers/school-controller');
const {
  createClassroom,
  getAllClassrooms,
  updateClassroom,
  deleteClassroom,
} = require('../controllers/classroom-controller'); // Import classroom controller
const { generateInvoice, addInvoice, downloadInvoice } = require('../controllers/invoice-controller'); // Import invoice controller
const { getAllPrograms, getProgramById, createProgram, updateProgram, deleteProgram } = require('../controllers/program-controller.js');
const recipeRoutes = require('./recipe-routes');
const {
  createPost,
  getPosts,
  getMyPosts,
  updatePost,
  deletePost
} = require('../controllers/post-controller');
const { getNotifications } = require('../controllers/notification-controller.js');
const {
  createGroup,
  getGroupMessages,
} = require('../controllers/group-controller');
const {
  getMessages,
} = require('../controllers/chat-controller');
const Message = require('../model/Message');

const router = express.Router();

// User-related routes
router.post("/signup", verifyToken, signup);
router.put("/update-korisnik/:userId", verifyToken, updateDetaljiKorisnika);
router.post("/login", login);
router.get("/user", verifyToken, getUser);
router.get("/korisnici", verifyToken, getKorisnici);
router.get("/profil", verifyToken, getUser);
router.get("/korisnik/:userId", verifyToken, getDetaljiKorisnika);
router.get('/all-students', getAllStudents);
router.post('/users', searchUsersAndMentors);
router.get('/users/:userId/invoices', getUserInvoices);
router.post("/reset-password", verifyToken, updatePassword);
router.post("/logout", logout);
// Refresh token route
router.post('/refresh', refreshToken);

// Group-related routes
router.post('/groups', verifyToken, createGroup);
router.get('/groups/:groupId/messages', verifyToken, getGroupMessages);

// Chat-related routes
router.get('/messages/:recipientId', verifyToken, getMessages);

// Mentor-related routes
router.post('/signup-mentori', verifyToken, signupMentor);
router.get("/mentori", verifyToken, getMentori);
router.put("/update-mentor/:mentorId", verifyToken, updateDetaljiMentora);

// Theory-related routes
router.post("/uredi/teorija", verifyToken, updateTeorija);
router.get("/rasporedTeorija", verifyToken, getTeorija);
router.get("/rasporedUcenici/:id", verifyToken, getStudentsRaspored);
router.get("/rasporedUcenik/:id", verifyToken, getStudentRaspored);
router.get('/students/:id', verifyToken, getMentorStudents);
router.post('/uredi/ucenik-raspored/:id', verifyToken, addScheduleToStudent);
router.delete("/deleteTermin/:id", verifyToken, deleteTermin);
router.delete("/deleteUcenikTermin/:id", verifyToken, deleteRaspored);

// Classroom-related routes
router.post('/classrooms', verifyToken, createClassroom);
router.get('/classrooms', verifyToken, getAllClassrooms);
router.put('/classrooms/:id', verifyToken, updateClassroom);
router.delete('/classrooms/:id', verifyToken, deleteClassroom);

// New route for fetching schools
router.get('/schools', verifyToken, getSchools);

// Nova ruta za generiranje računa
// U ruti
router.get('/users/:userId/invoices', verifyToken, getUserInvoices);
router.post('/generate-invoice', verifyToken, generateInvoice);
router.get('/download/:id', verifyToken, downloadInvoice);
router.post('/racuni', verifyToken, addInvoice);

router.delete("/delete-user/:id", verifyToken, deleteUser);

router.delete('/api/delete-user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { userType } = req.body;

    if (userType === 'student') {
      // Remove student from all mentor schedules
      await Mentor.updateMany(
        { 'raspored.ucenikId': userId },
        { $pull: { 'raspored.$[].ucenici': { ucenikId: userId } } }
      );

      // Delete the student
      await User.findByIdAndDelete(userId);
    } else if (userType === 'mentor') {
      await Mentor.findByIdAndDelete(userId);
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Post-related routes
router.post('/posts', verifyToken, createPost);
router.get('/posts', verifyToken, getPosts);
router.get('/my-posts', verifyToken, getMyPosts);
router.put('/posts/:id', verifyToken, updatePost);
router.delete('/posts/:id', verifyToken, deletePost);

// Add this route to fetch notifications
router.get('/notifications', verifyToken, getNotifications);

// Add these routes to your existing user routes
router.get('/students/mentors', verifyToken, async (req, res) => {
  try {
    const mentors = await Mentor.find(); // Fetch all mentors
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentors' });
  }
});

router.get('/mentors/students', verifyToken, async (req, res) => {
  const mentorId = req.user._id; // Assuming the mentor ID is in the token
  try {
    const mentor = await Mentor.findById(mentorId).populate('students.ucenikId'); // Populate students
    res.json(mentor.students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// Add this route with your other message routes
router.post('/messages', verifyToken, async (req, res) => {
  try {
    const { text, senderId, recipientId, timestamp } = req.body;
    const message = new Message({
      text,
      senderId,
      recipientId,
      timestamp,
      read: false // Set read status to false when sending
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Error saving message' });
  }
});

router.put('/messages/read/:recipientId', verifyToken, async (req, res) => {
    try {
        const senderId = req.user._id;
        await Message.updateMany(
            { senderId: req.params.recipientId, recipientId: senderId, read: false },
            { $set: { read: true } }
        );
        res.status(200).json({ message: 'Messages marked as read' });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ message: 'Error marking messages as read' });
    }
});

module.exports = router;