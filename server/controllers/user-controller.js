const User = require('../model/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const asyncWrapper = require("../middleware/asyncWrapper.js");
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const signup = async (req, res, next) => {
    const {
      korisnickoIme,
      email,
      program, // "class" is a reserved keyword in JavaScript, so use an alternative name like "userClass"
      isAdmin,
      isMentor,
      isStudent,
      oib,
    } = req.body;
  
    // Generate a random password
    const randomPassword = crypto.randomBytes(8).toString('hex');
    console.log("password: ",randomPassword);
  
    let existingUser;
  
    try {
      existingUser = await User.findOne({ email: email });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  
    if (existingUser) {
      return res.status(400).json({ message: "Korisnik već postoji!!" });
    }
  
    const hashPassword = bcrypt.hashSync(randomPassword);
  
    const user = new User({
      korisnickoIme,
      email,
      program,
      isAdmin,
      isMentor,
      isStudent,
      oib,
      password: hashPassword,
    });
  
    try {
      await user.save();
  
      // Send the random password to the user's email
      await sendPasswordEmail(email, randomPassword);
  
      return res.status(201).json({ message: "Uspješno ste registrirali korisnika, lozinka poslana na email." });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };


  const sendPasswordEmail = async (email, password) => {
    const transporter = nodemailer.createTransport({
      service: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: '', // replace with your email
        pass: '', // replace with your email password
      },
    });
  
    const mailOptions = {
        from: '',
        to: email,
        subject: 'Vaša lozinka za MAI račun',
        text: `Prijavljeni ste na našu platformu, a vaša lozinka je: ${password}`,
      };
    
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info);
      } catch (error) {
        console.error('Error sending email:', error);
      }
    };
 
 const login = async (req, res, next) => {
     const {email, password} = req.body;
 
     let existingUser;
     try {
         existingUser = await User.findOne({email: email});
     } catch (err){
         return new Error(err);
     }
     if (!existingUser) {
         return res.status(400).json({message: "User not found. Sign up!"})
     }
     const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
     if (!isPasswordCorrect) {
         return res.status(400).json({message: "Invalid email/password!"})
     }
     const token = jwt.sign({id: existingUser._id}, process.env.JWT_SECRET, {expiresIn: "1h",});
 
     console.log("generated token\n", token);
 
     if(req.cookies[`${existingUser._id}`]) {
         req.cookies[`${existingUser._id}`] = ""
     }
 
     res.cookie(String(existingUser._id), token, {
         path: '/',
         httpOnly: true,
         sameSite: 'lax',
     });
 
     return res.status(200).json({message: "Successfully logged in! :)", user: existingUser, token});
 };
 
 const verifyToken = (req, res, next) => {
   const cookies = req.headers.cookie;
   const token = cookies.split("=")[1];
   if (!token) {
     return res.status(404).json({ message: "No token found" });
   }
   jwt.verify(String(token), process.env.JWT_SECRET, (err, user) => {
     if (err) {
       return res.status(400).json({ message: "Invalid Token" });
     }
     console.log(user.id);
     req.id = user.id;
     next();
   });
 };
 
 async function getUser(req, res, next) {
     const userId = req.id;
     let user;
     try {
         user = await User.findById(userId, "-password");
     } catch (err) {
         return new Error(err);
     }
     if (!user) {
         return res.status(404).json({ message: "user not found" });
     }
     return res.status(200).json({ user });
 }

 /*
const refreshToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];
    console.log(prevToken)
    if(!prevToken) {
        return res.status(400).json({message: "Couldn't find token"});
    }
    jwt.verify(String(prevToken), process.env.JWT_SECRET, (err, user) => {
        if(err) {
            console.log(err);
            return res.status(403).json({message: "Autentication faild"})
        };

        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] = "";

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });
        res.cookie(String(user.id), token, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 60 * 57),
            httpOnly: true,
            sameSite: 'lax',
        });

        req.id = user.id;
        next();
    })
};
*/
const logout = (req, res, next) => {
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];
    if(!prevToken) {
        return res.status(400).json({message: "Couldn't find token"});
    }
    jwt.verify(String(prevToken), process.env.JWT_SECRET, (err, user) => {
        if(err) {
            console.log(err);
            return res.status(403).json({message: "Autentication faild"})
        };

        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] = "";
        return res.status(200).json({message: "Successfully Logged Out"})
    })
}
const getKorisnici = async (req, res, next) => {
  
    try {
      let korisnici = [];
        korisnici = await User.find().limit(30);
  
      res.json(korisnici);
    } catch (err) {
      next(err);
    }
  };


exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
//exports.refreshToken = refreshToken;
exports.logout = logout;
exports.getKorisnici = getKorisnici;