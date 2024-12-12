const bcrypt = require('bcrypt');
const User = require('../models/User');
const Mentor = require('../models/Mentor');
const nodemailer = require('nodemailer');

// Configure email transporter using existing settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Add to existing routes
router.post('/reset-password', async (req, res) => {
  try {
    const { userId, userType, email } = req.body;
    
    // Find user/mentor
    const Model = userType === 'student' ? User : Mentor;
    const user = await Model.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }
    
    // Check last reset time
    if (user.lastPasswordReset && 
        Date.now() - new Date(user.lastPasswordReset).getTime() < 24 * 60 * 60 * 1000) {
      return res.status(429).json({
        message: 'Molimo pričekajte 24 sata između resetiranja lozinke.'
      });
    }

    // Generate new password (8 characters)
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user
    user.password = hashedPassword;
    user.lastPasswordReset = new Date();
    await user.save();

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Nova lozinka - Music Art Incubator',
      html: `
        <div>
          <h2>Nova lozinka za vaš račun</h2>
          <p>Vaša nova lozinka je: <strong>${newPassword}</strong></p>
          <p>Molimo vas da se prijavite s novom lozinkom.</p>
          <br/>
          <p>Lijep pozdrav,<br/>Music Art Incubator Tim</p>
        </div>
      `
    });

    res.json({ message: 'Nova lozinka je poslana na email.' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Greška pri resetiranju lozinke.' });
  }
}); 