const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Mentor = require('../model/Mentor'); // Make sure to import your Mentor model

// Controller for mentor signup
const signupMentor = async (req, res, next) => {
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
    datumRodjenja,
    adresa,
    napomene,
  } = req.body;

  // Generate a random password
  const randomPassword = crypto.randomBytes(8).toString('hex');
  console.log('password: ', randomPassword);

  let existingUser;

  try {
    existingUser = await Mentor.findOne({ email: email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }

  if (existingUser) {
    return res.status(400).json({ message: 'Mentor već postoji!!' });
  }

  const saltRounds = 10;
  const hashPassword = bcrypt.hashSync(randomPassword, saltRounds);

  const mentor = new Mentor({
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
    datumRodjenja,
    adresa,
    napomene,
    password: hashPassword,
  });

  try {
    await mentor.save();

    // Send the random password to the mentor's email
    await sendPasswordEmail(email, randomPassword);

    return res
      .status(201)
      .json({ message: 'Uspješno ste registrirali mentora, lozinka poslana na email.' });
  } catch (err) {
    console.log(err);
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

    const getMentori = async (req, res, next) => {
      try {
        // Select only specific fields (ime, prezime, program) from the database
        const mentori = await Mentor.find({}, 'korisnickoIme email isAdmin isMentor isStudent oib').limit(30);
    
        res.json(mentori);
      } catch (err) {
        next(err);
      }
    };

    const updateDetaljiMentora = async (req, res, next) => {
      try {
        const mentorId = req.params.mentorId; // Assuming the mentor ID is sent as a parameter
        const updateData = req.body;
    
        if (!mongoose.Types.ObjectId.isValid(mentorId)) {
          return res.status(400).json({ message: 'Invalid mentor ID' });
        }
    
        const detaljiMentora = await Mentor.findById(mentorId);
    
        if (!detaljiMentora) {
          return res.status(404).json({ message: 'Mentor not found' });
        }
    
        // Update mentor fields with the values from the request body
        Object.assign(detaljiMentora, updateData);
    
        // Save the updated mentor
        await detaljiMentora.save();
    
        res.json({ message: 'Mentor updated successfully', mentor: detaljiMentora });
      } catch (err) {
        next(err);
      }
    };
    
// Export the controller
module.exports = {
  signupMentor, getMentori, updateDetaljiMentora
};
