const User = require('../model/User.js');
const Mentor = require('../model/Mentor.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const asyncWrapper = require("../middleware/asyncWrapper.js");
const mongoose = require('mongoose');
const Raspored = require('../model/Raspored.js');
const Invoice = require('../model/Invoice.js');
const RasporedTeorija = require('../model/RasporedTeorija.js');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secureOptions: 'TLSv1_2',
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

    // Set cookie token with appropriate options
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
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
      token // Ensure this is included in the response
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0)
    });

    if (req.session) {
      req.session.destroy();
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error during logout' });
  }
};

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token expired or invalid" });
      }
      req.id = decoded.id;
      next();
    });
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

const sendPasswordResetEmail = async (email, newPassword) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Nova lozinka - Music Art Incubator',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <img src="https://mai-cadenza.onrender.com/Logo12.png" alt="MAI Logo" style="max-width: 150px; margin: 0 auto; display: block;" />
        <h1 style="color: #FCA311; text-align: center;">Nova lozinka za vaš račun</h1>
        <p>Poštovani,</p>
        <p>Vaša nova lozinka je: <strong>${newPassword}</strong></p>
        <p>Molimo vas da se prijavite s novom lozinkom i odmah je promijenite.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://mai-cadenza.onrender.com/login"
             style="background-color: #FCA311; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Prijavi se
          </a>
        </div>
        <p>S poštovanjem,<br/>MAI - Cadenza Tim</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

const resetPassword = asyncWrapper(async (req, res) => {
  const { userId, userType, email } = req.body;

  try {
    const Model = userType === 'student' ? User : Mentor;
    const user = await Model.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }

    if (user.lastPasswordReset &&
        Date.now() - new Date(user.lastPasswordReset).getTime() < 24 * 60 * 60 * 1000) {
      return res.status(429).json({
        message: 'Molimo pričekajte 24 sata između resetiranja lozinke.'
      });
    }

    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    user.lastPasswordReset = new Date();
    await user.save();

    await sendPasswordResetEmail(email, newPassword);

    return res.status(200).json({ message: 'Nova lozinka je poslana na email.' });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ message: 'Greška pri resetiranju lozinke.' });
  }
});

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { userType } = req.body;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const Model = userType === 'student' ? User : Mentor;
      const user = await Model.findById(id);

      if (!user) {
        throw new Error('User not found');
      }

      if (userType === 'student') {
        // Remove student from mentor's list and schedules
        if (user.mentor) {
          await Mentor.updateMany(
            { _id: user.mentor },
            {
              $pull: {
                students: user._id,
                'raspored.$[].ucenici': { ucenikId: user._id }
              }
            }
          );
        }

        // Delete student's schedule
        await Raspored.deleteMany({ ucenikId: user._id });

        // Delete related invoices
        await Invoice.deleteMany({ userId: user._id });
      }

      if (userType === 'mentor') {
        // Update all students who had this mentor
        await User.updateMany(
          { mentor: user._id },
          { $unset: { mentor: "" } }
        );

        // Delete mentor's schedule
        await RasporedTeorija.deleteMany({ mentorId: user._id });
        await Raspored.deleteMany({ mentorId: user._id });
      }

      // Finally delete the user
      await Model.findByIdAndDelete(id);

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: 'User successfully deleted' });
    } catch (error) {
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
  login,
  logout,
  verifyToken,
  resetPassword,
  sendPasswordResetEmail,
  deleteUser
};