const User = require('../model/User.js');
const Mentor = require('../model/Mentor.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const asyncWrapper = require("../middleware/asyncWrapper.js");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Raspored = require('../model/Raspored');
const RasporedTeorija = require('../model/RasporedTeorija');
const Invoice = require('../model/Invoice');
const Chat = require('../model/Chat');

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

  // Add password strength validation
  if (!isStrongPassword(randomPassword)) {
    return res.status(400).json({
      message: "Password must contain uppercase, lowercase, number, special char"
    });
  }

  try {
    const hashPassword = await bcrypt.hash(randomPassword, 12);

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


const updatePassword = asyncWrapper(async (req, res) => {
  const { userId, userType, email } = req.body;

  try {
    // Find user
    const Model = userType === 'student' ? User : Mentor;
    const user = await Model.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    // Check cooldown
    if (user.lastPasswordReset &&
        Date.now() - new Date(user.lastPasswordReset).getTime() < 24 * 60 * 60 * 1000) {
      return res.status(429).json({
        message: 'Molimo pričekajte 24 sata između resetiranja lozinke.'
      });
    }

    // Generate new password (using existing logic from signup)
    const passwordLength = 8;
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const newPassword = Array.from(
      { length: passwordLength },
      () => characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');

    // Hash password
    const hashedPassword = bcrypt.hashSync(newPassword, 8);

    // Update user
    user.password = hashedPassword;
    user.lastPasswordReset = new Date();
    await user.save();

    // Send email using existing transporter config
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'leonosobni@gmail.com',
        pass: 'vrsj acql nqyh lnvr',
      },
      secureOptions: 'TLSv1_2',
    });

    const mailOptions = {
      from: 'leonosobni@gmail.com',
      to: email,
      subject: 'Nova lozinka - Music Art Incubator',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
        <!-- Header section with logo -->
        <div style="text-align: center;">
          <img src="https://mai-cadenza.onrender.com/Logo12.png" alt="MAI - Cadenza Logo" style="max-width: 150px;" />
          <h1 style="color: rgb(252, 163, 17); font-size: 24px;">Nova lozinka za vaš račun</h1>
        </div>

        <!-- Email introduction -->
        <p>Poštovani,</p>
        <p>Vaša lozinka je resetirana. Ovdje su vaši novi podaci za prijavu:</p>

        <!-- Highlighted user details -->
        <div style="border: 1px solid #ddd; padding: 10px; background-color: #fff8e6; margin-bottom: 20px;">
          <p><strong>E-mail adresa:</strong> ${email}</p>
          <p><strong>Nova lozinka:</strong> ${newPassword}</p>
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
            ">Prijavite se</a>
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
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Nova lozinka je poslana na email.' });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ message: 'Greška pri resetiranju lozinke.' });
  }
});

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let existingUser = await User.findOne({ email }) || await Mentor.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set cookie token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Successfully Logged In",
      user: {
        id: existingUser._id,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
        isMentor: existingUser.isMentor,
        isStudent: existingUser.isStudent
      },
      token // Also send token in response
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id) || await Mentor.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

const logout = async (req, res) => {
  try {
    // Clear localStorage on client side
    // Server just sends success response
    return res.status(200).json({ message: "Successfully logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Error during logout" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No token found" });
    }

    const oldToken = authHeader.split(' ')[1];

    jwt.verify(oldToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token expired" });
      }

      const newToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({ token: newToken });
    });
  } catch (error) {
    res.status(401).json({ message: "Token refresh failed" });
  }
};



  async function getUser(req, res, next) {
    try {
      // Get user ID from req.user instead of req.id
      const userId = req.user._id;

      // Changed variable name to avoid redeclaration
      const foundUser = await User.findById(userId, "-password");

      if (!foundUser) {
        const foundMentor = await Mentor.findById(userId, "-password");
        if (!foundMentor) {
          return res.status(404).json({ message: "User or Mentor not found" });
        }
        return res.status(200).json({ user: foundMentor });
      }

      return res.status(200).json({ user: foundUser });
    } catch (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
const getAllStudents = async (req, res, next) => {
  try {
    // Update fields to include korisnickoIme and oib
    const students = await User.find({}, 'korisnickoIme oib');
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
    })
      .select('ime prezime isMentor email isStudent isAdmin school')
      .populate('school', 'name'); // Adjust fields as necessary

    // Search mentors by name, surname, or username
    const mentors = await Mentor.find({
      $or: [
        { ime: { $regex: query, $options: 'i' } },
        { prezime: { $regex: query, $options: 'i' } },
        { korisnickoIme: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    })
      .select('ime prezime email isMentor isStudent isAdmin school')
      .populate('school', 'name'); // Adjust fields as necessary

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
    // Changed variable name here as well
    const foundUser = await User.findById(userId).populate('racuni');

    if (!foundUser) {
      return res.status(404).send('User not found');
    }

    res.json(foundUser.racuni);
  } catch (error) {
    console.error('Error fetching user invoices:', error);
    res.status(500).send('Error fetching invoices');
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { userType } = req.body;

  try {
    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find and delete the user
      const Model = userType === 'student' ? User : Mentor;
      const user = await Model.findById(id);

      if (!user) {
        throw new Error('User not found');
      }

      // If deleting a student
      if (userType === 'student') {
        // Remove student from mentor's list
        if (user.mentor) {
          await Mentor.updateMany(
            { _id: user.mentor },
            { $pull: { students: user._id } }
          );
        }

        // Delete student's schedule
        await Raspored.deleteMany({ ucenikId: user._id });

        // Delete related invoices
        await Invoice.deleteMany({ userId: user._id });

        // Delete related chat messages
        await Chat.deleteMany({
          $or: [
            { senderId: user._id },
            { recipientId: user._id }
          ]
        });
      }

      // If deleting a mentor
      if (userType === 'mentor') {
        // Update all students who had this mentor
        await User.updateMany(
          { mentor: user._id },
          { $unset: { mentor: "" } }
        );

        // Delete mentor's schedule
        await RasporedTeorija.deleteMany({ mentorId: user._id });
      }

      // Finally delete the user
      await Model.findByIdAndDelete(id);

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: 'User successfully deleted' });
    } catch (error) {
      // If anything fails, abort the transaction
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      message: 'Error deleting user',
      error: error.message
    });
  }
};

module.exports = {
  signup,
  updatePassword,
  login,
  verifyToken,
  getUser,
  refreshToken,
  logout,
  getKorisnici,
  getDetaljiKorisnika,
  updateDetaljiKorisnika,
  getAllStudents,
  searchUsersAndMentors,
  getUserInvoices,
  deleteUser
};