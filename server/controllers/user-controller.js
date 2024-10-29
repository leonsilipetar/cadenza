const User = require('../model/User.js');
const Mentor = require('../model/Mentor.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const asyncWrapper = require("../middleware/asyncWrapper.js");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const signup = asyncWrapper(async (req, res, next) => {
  const {
    korisnickoIme,
    email,
    program, // Pretpostavljam da ovdje dolazi ID programa
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
    school,
  } = req.body;

  const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ message: 'Korisnik već postoji!!' });
  }

  // Generate a random password
  const passwordLength = 8;
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomPassword = Array.from({ length: passwordLength }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');

  console.log('password: ', randomPassword);

  try {
    const hashPassword = bcrypt.hashSync(randomPassword, 8);

    const user = new User({
      korisnickoIme,
      email,
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
      school,
    });

    await user.save();

    // Poveži učenika s programom
    if (program) {
      const programObj = await Program.findById(program);
      if (programObj) {
        programObj.students.push(user._id);
        await programObj.save();
        
        user.programIds.push(program); // Dodaj program ID korisniku
        await user.save(); // Spremi izmjene korisnika
      }
    }

    // Send the random password to the user's email
    await sendPasswordEmail(email, randomPassword);

    return res.status(201).json({
      message: 'Uspješno ste registrirali korisnika, lozinka poslana na email.',
    });
  } catch (err) {
    console.error('Error during signup:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});




const sendPasswordEmail = async (email, password) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'leonosobni@gmail.com', // replace with your Gmail email
      pass: 'vrsj acql nqyh lnvr', // replace with your Gmail app password
    },
    secureOptions: 'TLSv1_2',
  });

  const mailOptions = {
    from: 'leonosobni@gmail.com', // replace with your Gmail email
    to: email,
    subject: 'Dobrodošli u MAI - Cadenza platformu - Detalji vašeg računa',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
      <!-- Header section with logo -->
      <div style="text-align: center;">
        <img src="https://mai-cadenza.onrender.com/Logo12.png" alt="MAI - Cadenza Logo" style="max-width: 150px;" />
        <h1 style="color: rgb(252, 163, 17); font-size: 24px;">Dobrodošli u MAI - Cadenza!</h1>
      </div>

      <!-- Email introduction -->
      <p>Poštovani,</p>
      <p>Radujemo se što vas možemo pozdraviti na Music Art Incubator (MAI) platformi. Vaš korisnički račun je uspješno stvoren, a ovdje su vaši podaci za prijavu:</p>

      <!-- Highlighted user details -->
      <div style="border: 1px solid #ddd; padding: 10px; background-color: #fff8e6; margin-bottom: 20px;">
        <p><strong>E-mail adresa:</strong> ${email}</p>
        <p><strong>Lozinka:</strong> ${password}</p>
      </div>

      <!-- Call to action button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://mai-cadenza.onrender.com/login" style="
          background-color: rgb(252, 163, 17); 
          color: white; 
          padding: 10px 20px; 
          text-decoration: none; 
          border-radius: 5px; 
          font-size: 16px;
          font-weight: bold;
          display: inline-block;
          transition: background-color 0.3s ease;
          ">Posjetite našu aplikaciju</a>
      </div>

      <!-- Support and closing -->
      <p>Molimo vas da čuvate ove informacije i ne dijelite lozinku. Ako imate bilo kakvih pitanja ili nedoumica, slobodno se obratite našem timu za podršku na <a href="mailto:leonosobni@gmail.com">leonosobni@gmail.com</a>.</p>
      
      <p>S poštovanjem,<br />MAI - Cadenza</p>
    </div>

    <!-- Styling for hover effect -->
    <style>
      a:hover {
        background-color: rgba(252, 163, 17, 0.8);
      }
    </style>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

 
const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    let existingUser = await User.findOne({ email });

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

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    Object.keys(req.cookies).forEach((cookieName) => {
      res.clearCookie(cookieName);
    });

    res.cookie(String(existingUser.id), token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none',
    });

    return res.status(200).json({ message: "Successfully logged in! :)", user: existingUser, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;

  if (!cookies) {
    return res.status(404).json({ message: "No cookies found" });
  }

  const token = cookies.split("=")[1];

  if (!token) {
    return res.status(404).json({ message: "No token found" });
  }

  jwt.verify(String(token), process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid Token" });
    }
    req.id = user.id;
    next();
  });
};

const logout = (req, res, next) => {
  const cookies = req.headers.cookie;

  if (!cookies) {
    return res.status(400).json({ message: "No cookies found" });
  }

  const token = cookies.split("=")[1];

  if (!token) {
    return res.status(400).json({ message: "Couldn't find token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }

    console.log('Clearing cookie for user:', user.id);
    res.clearCookie(String(user.id), {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict'
    });

    return res.status(200).json({ message: "Successfully Logged Out" });
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
};
const getAllStudents = async (req, res, next) => {
  try {
    const students = await User.find({}, 'ime prezime'); // Adjust the fields as needed
    res.json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Assuming you have your User and Mentor models properly defined and imported

const searchUsersAndMentors = async (req, res) => {
  try {
    const { query } = req.body;

    // Search users by name, surname, or username
    const users = await User.find({
      $or: [
        { ime: { $regex: query, $options: 'i' } },
        { prezime: { $regex: query, $options: 'i' } },
        { korisnickoIme: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    }).select('ime prezime isMentor email isStudent isAdmin');

    // Search mentors by name, surname, or username
    const mentors = await Mentor.find({
      $or: [
        { ime: { $regex: query, $options: 'i' } },
        { prezime: { $regex: query, $options: 'i' } },
        { korisnickoIme: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    }).select('ime prezime email isMentor isStudent isAdmin');

    // Process users to include roles
    const processedUsers = users.map(user => {
      let role = '';
      if (user.isAdmin) role = 'administrator';
      else if (user.isMentor) role = 'mentor';
      else if (user.isStudent) role = 'učenik';

      return { ...user.toObject(), uloga: role };
    });

    // Process mentors to include roles
    const processedMentors = mentors.map(mentor => {
      let role = '';
      if (mentor.isAdmin) role = 'administrator';
      else if (mentor.isMentor) role = 'mentor';
      else if (mentor.isStudent) role = 'učenik';

      return { ...mentor.toObject(), uloga: role };
    });

    // Combine processed users and mentors
    const combinedResults = [...processedUsers, ...processedMentors];

    res.json({ results: combinedResults });
  } catch (error) {
    console.error('Error searching users and mentors:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const refreshToken = (req, res, next) => {
  // Extract cookies from request headers
  const cookies = req.headers.cookie;
  if (!cookies) {
    return res.status(400).json({ message: "No cookies found" });
  }

  // Find the token in cookies
  const tokenCookie = cookies.split(";").find(cookie => cookie.trim().startsWith(`${process.env.COOKIE_NAME}=`));
  const prevToken = tokenCookie ? tokenCookie.split("=")[1] : null;

  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find token" });
  }

  // Verify the old token
  jwt.verify(prevToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }

    // Clear the old token cookie
    res.clearCookie(`${process.env.COOKIE_NAME}`, {
      path: '/',
      httpOnly: true,
      sameSite: 'none',
    });

    // Create a new token
    const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d" // Extend token validity as needed
    });

    // Set the new token in cookies
    res.cookie(`${process.env.COOKIE_NAME}`, newToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'none',
    });

    // Send success response
    res.status(200).json({ message: "Token refreshed successfully" });
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
const getUserInvoices = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('racuni');

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json(user.racuni);
  } catch (error) {
    console.error('Error fetching user invoices:', error);
    res.status(500).send('Error fetching invoices');
  }
};

exports.getUserInvoices =  getUserInvoices ;

exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;
exports.logout = logout;
exports.getKorisnici = getKorisnici;
exports.getDetaljiKorisnika = getDetaljiKorisnika;
exports.updateDetaljiKorisnika = updateDetaljiKorisnika;
exports.getAllStudents = getAllStudents;
exports.searchUsersAndMentors = searchUsersAndMentors;