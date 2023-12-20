const express = require('express');
const { 
     signup, 
     login, 
     verifyToken, 
     getUser, 
     //refreshToken, 
     logout,
     getKorisnici, 
     getDetaljiKorisnika
} = require('../controllers/user-controller.js');
const router = express.Router();

router.post("/signup",verifyToken, signup);
router.post("/login", login);
router.get("/user", verifyToken, getUser);
router.get("/korisnici", verifyToken, getKorisnici);
router.get("/profil", verifyToken, getUser);
router.get("/korisnik/:userId", verifyToken, getDetaljiKorisnika);
//router.get("/refresh", refreshToken, verifyToken, getUser);
router.post("/logout", verifyToken, logout);

module.exports = router;