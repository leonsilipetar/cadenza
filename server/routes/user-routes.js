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
} = require('../controllers/user-controller.js');
const {
  signupMentor,
  getMentori,
  updateDetaljiMentora
}= require('../controllers/mentor-controller.js');

const { updateTeorija, getTeorija, deleteTermin } = require('../controllers/teorija-controller');

const router = express.Router();

// User-related routes
router.post("/signup", verifyToken, signup);
router.put("/update-korisnik/:userId", verifyToken, updateDetaljiKorisnika);
router.post("/login", login);
router.get("/user", verifyToken, getUser);
router.get("/korisnici", verifyToken, getKorisnici);
router.get("/profil", verifyToken, getUser);
router.get("/korisnik/:userId", verifyToken, getDetaljiKorisnika);
// router.get("/refresh", refreshToken, verifyToken, getUser);
router.post("/logout", verifyToken, logout);

router.post('/signup-mentori', verifyToken, signupMentor);
router.get("/mentori", verifyToken, getMentori);
router.put("/update-mentor/:mentorId", verifyToken, updateDetaljiMentora);

router.post("/uredi/teorija", verifyToken, updateTeorija);
router.get("/rasporedTeorija", verifyToken, getTeorija);
router.delete("/deleteTermin/:id", verifyToken, deleteTermin);

module.exports = router;
