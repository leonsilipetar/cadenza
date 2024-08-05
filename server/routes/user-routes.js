const express = require('express');
const {
  signup,
  login,
  verifyToken,
  getUser,
  // refreshToken,
  logout,
  getKorisnici,
  getDetaljiKorisnika,
  updateDetaljiKorisnika,
  getAllStudents,
  searchUsersAndMentors,
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
const { getSchools } = require('../controllers/school-controller'); // Import the new controller

const router = express.Router();

// User-related routes
router.post("/signup", verifyToken, signup);
router.put("/update-korisnik/:userId", verifyToken, updateDetaljiKorisnika);
router.post("/login", login);
router.get("/user", verifyToken, getUser);
router.get("/korisnici", verifyToken, getKorisnici);
router.get("/profil", verifyToken, getUser);
router.get("/korisnik/:userId", verifyToken, getDetaljiKorisnika);
// Fetch all students
router.get('/all-students', getAllStudents);
router.post('/users', searchUsersAndMentors);
// router.get("/refresh", refreshToken, verifyToken, getUser);
router.post("/logout", verifyToken, logout);

router.post('/signup-mentori', verifyToken, signupMentor);
router.get("/mentori", verifyToken, getMentori);
router.put("/update-mentor/:mentorId", verifyToken, updateDetaljiMentora);

router.post("/uredi/teorija", verifyToken, updateTeorija);
router.get("/rasporedTeorija", verifyToken, getTeorija);
router.get("/rasporedUcenici/:id", verifyToken, getStudentsRaspored);
router.get("/rasporedUcenik/:id", verifyToken, getStudentRaspored);
router.get('/students/:id', verifyToken, getMentorStudents);
router.post('/uredi/ucenik-raspored/:id', verifyToken, addScheduleToStudent);
router.delete("/deleteTermin/:id", verifyToken, deleteTermin);
router.delete("/deleteUcenikTermin/:id", verifyToken, deleteRaspored);

// New route for fetching schools
router.get('/schools', verifyToken, getSchools);

module.exports = router;
