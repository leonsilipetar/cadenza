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
const {signupMentor}= require('../controllers/mentor-controller.js');

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

router.post('/signup-mentors', );

module.exports = router;
