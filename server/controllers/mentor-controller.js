const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Mentor = require('../model/Mentor');
const User = require('../model/User');
const Raspored = require('../model/Raspored');
const Notification = require('../model/Notification');
const asyncWrapper = require('../middleware/asyncWrapper');

// Controller for mentor signup
const signupMentor = asyncWrapper(async (req, res, next) => {
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

  const existingUser = await Mentor.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: 'Mentor već postoji!!' });
  }

  const passwordLength = 8;
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomPassword = Array.from({ length: passwordLength }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');

  console.log('password: ', randomPassword);

  const hashPassword = await bcrypt.hash(randomPassword, 12);

  const mentor = await Mentor.create({
    korisnickoIme,
    email,
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

  // Poveži mentora s programom
  if (program) {
    const programObj = await Program.findByPk(program);
    if (programObj) {
      await programObj.addMentor(mentor.id); // Assuming a many-to-many relationship
    }
  }

  await sendPasswordEmail(email, randomPassword);

  return res.status(201).json({ message: 'Uspješno ste registrirali mentora, lozinka poslana na email.' });
});

const sendPasswordEmail = async (email, password) => {
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

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Dobrodošli u MAI - Cadenza platformu - Detalji vašeg računa',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
      <div style="text-align: center;">
        <img src="https://cadenza.com.hr/Logo12.png" alt="MAI - Cadenza Logo" style="max-width: 150px;" />
        <h1 style="color: rgb(252, 163, 17); font-size: 24px;">Dobrodošli u MAI - Cadenza!</h1>
      </div>
      <p>Poštovani,</p>
      <p>Radujemo se što vas možemo pozdraviti na Music Art Incubator (MAI) platformi. Vaš korisnički račun je uspješno stvoren, a ovdje su vaši podaci za prijavu:</p>
      <div style="border: 1px solid #ddd; padding: 10px; background-color: #fff8e6; margin-bottom: 20px;">
        <p><strong>E-mail adresa:</strong> ${email}</p>
        <p><strong>Lozinka:</strong> ${password}</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://cadenza.com.hr/login" style="
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
      <p>Molimo vas da čuvate ove informacije i ne dijelite lozinku. Ako imate bilo kakvih pitanja ili nedoumica, slobodno se obratite na adresu za podršku: <a href="mailto:app.info.cadenza@gmail.com">app.info.cadenza@gmail.com</a>.</p>
      <p>S poštovanjem,<br />MAI - Cadenza</p>
    </div>
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

const getMentori = async (req, res, next) => {
  try {
    const mentori = await Mentor.findAll({
      attributes: ['korisnickoIme', 'email', 'isAdmin', 'isMentor', 'isStudent', 'oib'],
      limit: 30,
    });
    res.json(mentori);
  } catch (err) {
    next(err);
  }
};

const updateDetaljiMentora = async (req, res, next) => {
  try {
    const mentorId = req.params.mentorId;
    const updateData = req.body;

    const mentor = await Mentor.findByPk(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Update mentor fields with the values from the request body
    Object.assign(mentor, updateData);
    await mentor.save();

    res.json({ message: 'Mentor updated successfully', mentor });
  } catch (err) {
    next(err);
  }
};

const getMentorStudents = async (req, res, next) => {
  const mentorId = req.params.id;

  try {
    const mentor = await Mentor.findByPk(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const mentorStudents = mentor.students || [];
    res.json({ students: mentorStudents });
  } catch (err) {
    next(err);
  }
};

const getStudentsRaspored = async (req, res) => {
  const mentorId = req.params.id;

  try {
    const mentor = await Mentor.findByPk(mentorId, { include: [{ model: User, as: 'students' }] });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const studentIds = mentor.students.map(s => s.id);
    const schedules = await Raspored.findAll({ where: { ucenikId: studentIds } });

    const combinedSchedule = {
      pon: [],
      uto: [],
      sri: [],
      cet: [],
      pet: [],
      sub: [],
    };

    schedules.forEach(schedule => {
      const student = mentor.students.find(s => s.id === schedule.ucenikId);
      const studentName = student ? `${student.ime} ${student.prezime}` : 'Unknown Student';

      ['pon', 'uto', 'sri', 'cet', 'pet', 'sub'].forEach(day => {
        if (schedule[day] && schedule[day].length > 0) {
          const slotsWithStudent = schedule[day].map(slot => ({
            ...slot.toObject(),
            studentName: studentName,
          }));
          combinedSchedule[day].push(...slotsWithStudent);
        }
      });
    });

    res.json({
      students: mentor.students.map(s => ({
        ucenikId: s.id,
        ime: s.ime,
        prezime: s.prezime,
      })),
      schedule: combinedSchedule,
    });
  } catch (error) {
    console.error('Error fetching students schedules:', error);
    res.status(500).json({ message: 'Error fetching schedules' });
  }
};

const deleteMentor = async (req, res) => {
  const { id } = req.params;

  try {
    const mentor = await Mentor.findByPk(id);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    await Mentor.destroy({ where: { id } });
    res.status(200).json({ message: 'Mentor successfully deleted' });
  } catch (error) {
    console.error('Error deleting mentor:', error);
    res.status(500).json({ message: 'Error deleting mentor' });
  }
};

// Function to create a notification
const createNotification = async (userId, mentorId, message) => {
  const notification = await Notification.create({
    userId,
    mentorId,
    message,
    date: new Date(),
    unread: true, // Set as unread by default
  });
};

// Example usage in the update schedule function
const updateSchedule = async (req, res) => {
  // ... existing code to update the schedule

  // Create a notification for the student
  await createNotification(studentId, mentorId, `Mentor ${mentorName} has updated your schedule to ${newTime}.`);

  res.status(200).json({ message: 'Schedule updated successfully' });
};

// Export the controller
module.exports = {
  signupMentor,
  getMentori,
  updateDetaljiMentora,
  getMentorStudents,
  getStudentsRaspored,
  deleteMentor,
};