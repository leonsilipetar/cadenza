const express = require('express');
const {
  signup,
  login,
  verifyToken,
  getUser,
  logout,
  getKorisnici,
  getDetaljiKorisnika,
  updateDetaljiKorisnika,
  getAllStudents,
  searchUsersAndMentors,
  getUserInvoices,
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
router.get('/api/users/:userId/invoices', getUserInvoices);
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

// Classroom-related routes
router.post('/classrooms', verifyToken, createClassroom);
router.get('/classrooms', verifyToken, getAllClassrooms);
router.put('/classrooms/:id', verifyToken, updateClassroom);
router.delete('/classrooms/:id', verifyToken, deleteClassroom);

// New route for fetching schools
router.get('/schools', verifyToken, getSchools);

// Nova ruta za generiranje računa
// U ruti
router.get('/api/users/:userId/invoices', verifyToken, getUserInvoices);
router.post('/generate-invoice', verifyToken, generateInvoice);
router.get('/download/:id', verifyToken, downloadInvoice);
router.post('/racuni', verifyToken, addInvoice);


module.exports = router;
