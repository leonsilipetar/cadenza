const User = require('../model/User.js');
const Mentor = require('../model/Mentor.js');
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
    program,
    isAdmin,
    isMentor,
    isStudent,
    oib,
    ime,
    prezime,
    brojMobitela,
    mentor,
    datumRodjenja,
    adresa,
    pohadjaTeoriju,
    napomene,
    maloljetniClan,
    roditelj1,
    roditelj2,
  } = req.body;

  // Generate a random password
  const randomPassword = crypto.randomBytes(8).toString('hex');
  console.log('password: ', randomPassword);

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: 'Korisnik već postoji!!' });
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
    ime,
    prezime,
    brojMobitela,
    mentor,
    datumRodjenja,
    adresa,
    pohadjaTeoriju,
    napomene,
    maloljetniClan,
    roditelj1,
    roditelj2,
    password: hashPassword,
  });

  await user.save();

    // Send the random password to the user's email
    await sendPasswordEmail(email, randomPassword);

    return res.status(201).json({
      message: 'Uspješno ste registrirali korisnika, lozinka poslana na email.',
    });
  } catch (err) {
    console.error('Error during signup:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
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
      const { email, password } = req.body;
    
      try {
        // Try to find the user in the User collection
        let existingUser = await User.findOne({ email });
    
        // If not found in the User collection, try to find in Mentor collection
        if (!existingUser) {
          existingUser = await Mentor.findOne({ email });
        }
    
        if (!existingUser) {
          return res.status(400).json({ message: "User not found. Sign up!" });
        }
    
        const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
        if (!isPasswordCorrect) {
          return res.status(400).json({ message: "Invalid email/password!" });
        }
    
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
        console.log("Generated token\n", token);
    
        // Clear the existing cookie (if any)
        if(req.cookies[`${existingUser._id}`]) {
          req.cookies[`${existingUser._id}`] = ""
      }
    
        res.cookie(String(existingUser._id), token, {
          path: '/',
          expires: new Date(Date.now() + 1000 * 60 * 58),
          httpOnly: true,
          sameSite: 'none', //on localhost is lax, on render is none
          secure: process.env.NODE_ENV === 'production',/* on localhost is false*/
        });
    
        return res.status(200).json({ message: "Successfully logged in! :)", user: existingUser, token });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
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
        // Try to find the user in the User collection
        user = await User.findById(userId, "-password");

        // If not found in User collection, try to find in Mentor collection
        if (!user) {
            user = await Mentor.findById(userId, "-password");
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!user) {
        return res.status(404).json({ message: "User or Mentor not found" });
    }

    return res.status(200).json({ user });
}


 
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

const logout = (req, res, next) => {
  const cookies = req.headers.cookie;
  const prevToken = cookies.split("=")[1];

  if (!prevToken) {
      return res.status(400).json({ message: "Couldn't find token" });
  }

  jwt.verify(String(prevToken), process.env.JWT_SECRET, (err, user) => {
      if (err) {
          console.log(err);
          return res.status(403).json({ message: "Authentication failed" });
      }

      res.clearCookie(user.id);
      return res.status(200).json({ message: "Successfully Logged Out" });
  });
};
const getKorisnici = async (req, res, next) => {
  try {
    // Select only specific fields (ime, prezime, program) from the database
    const korisnici = await User.find({}, 'korisnickoIme email program isAdmin isMentor isStudent oib').limit(30);

    res.json(korisnici);
  } catch (err) {
    next(err);
  }
};

const getDetaljiKorisnika = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    let detaljiKorisnika;

    // Check in the User collection
    detaljiKorisnika = await User.findById(userId);

    // If not found in User collection, check in the Mentor collection
    if (!detaljiKorisnika) {
      detaljiKorisnika = await Mentor.findById(userId);
    }

    if (!detaljiKorisnika) {
      return res.status(404).json({ message: 'User/Mentor not found' });
    }

    res.json(detaljiKorisnika);
  } catch (err) {
    next(err);
  }
};



const updateDetaljiKorisnika = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const updateData = req.body; // Assuming the update data is sent in the request body

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const detaljiKorisnika = await User.findById(userId);

    if (!detaljiKorisnika) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields with the values from the request body
    Object.assign(detaljiKorisnika, updateData);

    // Save the updated user
    await detaljiKorisnika.save();

    res.json({ message: 'User updated successfully', user: detaljiKorisnika });
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
exports.getDetaljiKorisnika = getDetaljiKorisnika;
exports.updateDetaljiKorisnika = updateDetaljiKorisnika;