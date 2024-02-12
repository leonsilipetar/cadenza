const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Mentor = require('../model/Mentor');
const User = require('../model/User');
const Raspored = require('../model/Raspored'); // Make sure to import your Mentor model

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

  // Generate a random password with only letters (lowercase and uppercase) and numbers
  const passwordLength = 8; // You can change this to 6 if you prefer
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomPassword = Array.from({ length: passwordLength }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');

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
    text: `Poštovani,

    Radujemo se što vas možemo pozdraviti na Music Art Incubator (MAI) platformi. Vaš korisnički račun je uspješno stvoren, a ovdje su vaši podaci za prijavu:
    
    E-mail adresa: ${email}
    Lozinka: ${password}
    
    Molimo vas da čuvate ove informacije sigurno i ne dijelite lozinku. Ako imate bilo kakvih pitanja ili nedoumica, slobodno se obratite našem "timu" za podršku na leonosobni@gmail.com.
    
    S poštovanjem,
    MAI - Cadenza`,
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
    const mentorId = req.params.mentorId;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({ message: 'Invalid mentor ID' });
    }

    const detaljiMentora = await Mentor.findById(mentorId);

    if (!detaljiMentora) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // If students field is not null or undefined and is an array
    if (updateData.students && Array.isArray(updateData.students)) {
      // Use $each and $elemMatch to add new students to the mentor's students array
      await Mentor.updateOne(
        { _id: mentorId, students: { $not: { $elemMatch: { $in: updateData.students } } } },
        { $addToSet: { students: { $each: updateData.students } } }
      );

      // Remove the students field from updateData to prevent overwriting the students array
      delete updateData.students;
    }

    // Update other mentor fields with the values from the request body
    Object.assign(detaljiMentora, updateData);

    // Save the updated mentor
    await detaljiMentora.save();

    res.json({ message: 'Mentor updated successfully', mentor: detaljiMentora });
  } catch (err) {
    next(err);
  }
};

    
    
    
    
    const getMentorStudents = async (req, res, next) => {
      const mentorId = req.params.id;

      try {
        // Validate the mentor ID
        if (!mongoose.Types.ObjectId.isValid(mentorId)) {
          return res.status(400).json({ message: 'Invalid mentor ID' });
        }
    
        // Find the mentor by ID
        const mentor = await Mentor.findById(mentorId);
    
        // Check if the mentor exists
        if (!mentor) {
          return res.status(404).json({ message: 'Mentor not found' });
        }
    
        // Retrieve the students associated with the mentor
        const mentorStudents = mentor.students || [];
    
        res.json({ students: mentorStudents });
      } catch (err) {
        next(err);
      }
    };
    const getStudentsRaspored = async (req, res, next) => {
      const mentorId = req.params.id;
    
      try {
        // Validate the mentor ID
        if (!mongoose.Types.ObjectId.isValid(mentorId)) {
          return res.status(400).json({ message: 'Invalid mentor ID' });
        }
    
        // Find the mentor by ID
        const mentor = await Mentor.findById(mentorId);
    
        // Check if the mentor exists
        if (!mentor) {
          return res.status(404).json({ message: 'Mentor not found' });
        }
    
        // Retrieve the students associated with the mentor
        const mentorStudents = mentor.students || [];
    
        // Fetch the schedules for each student
        const schedules = await Promise.all(
          mentorStudents.map(async (studentId) => {
            const studentSchedule = await Raspored.findOne({ ucenikId: studentId });
    
            // Return the schedule if it exists, otherwise return an empty object
            return studentSchedule ? studentSchedule : { ucenikId: studentId };
          })
        );
    
        res.json({ students: mentorStudents, schedules });
      } catch (err) {
        next(err);
      }
    };
    
    const getStudentRaspored = async (req, res, next) => {
      const studentId = req.params.id;
    
      try {
        // Validate the student ID
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
          return res.status(400).json({ message: 'Invalid student ID' });
        }
    
        // Find the student by ID
        const student = await User.findById(studentId);
    
        // Check if the student exists
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }
    
        // Retrieve the schedule for the student
        let studentSchedule = await Raspored.findOne({ ucenikId: studentId });
    
        // If the schedule does not exist, create a new one
        if (!studentSchedule) {
          studentSchedule = new Raspored({ ucenikId: studentId });
          await studentSchedule.save();
    
          // Update the user record with the new schedule ID
          student.rasporedId = studentSchedule._id;
          await student.save();
        }
    
        res.json({ student, schedule: studentSchedule });
      } catch (err) {
        next(err);
      }
    };
    const addScheduleToStudent = async (req, res, next) => {
      const userId = req.params.id; // Assuming the user ID is passed in the request parameters
      const { schedules } = req.body; // Assuming the schedules are passed in the request body
      console.log("raspored:", schedules)
      
      try {
        // Check if the provided user ID is valid
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: 'Invalid user ID' });
        }
      
        // Find the user by ID
        const user = await User.findById(userId);
      
        // Check if the user exists
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
      
        // If user already has a schedule (rasporedId is defined), update the existing schedule
        if (user.rasporedId) {
          const existingSchedule = await Raspored.findById(user.rasporedId);
          if (!existingSchedule) {
            return res.status(404).json({ message: 'Existing schedule not found' });
          }
          // Update the existing schedule with the provided data
          for (const { day, dvorana, vrijeme, mentor } of schedules) {
            existingSchedule[day].push({ dvorana, vrijeme, mentor });
          }
          await existingSchedule.save();
          return res.status(200).json({ message: 'Schedule updated successfully', schedule: existingSchedule });
        }
      
        // If user doesn't have a schedule, create a new one
        const newSchedule = new Raspored({
          ucenikId: userId,
        });
      
        // Fill in the new schedule with the provided data
        for (const { day, dvorana, vrijeme, mentor } of schedules) {
          newSchedule[day].push({ dvorana, vrijeme, mentor });
        }
      
        // Save the new schedule
        await newSchedule.save();
      
        // Update the user's rasporedId field with the ID of the newly created schedule
        user.rasporedId = newSchedule._id;
      
        // Save the updated user
        await user.save();
      
        // Return a success response
        res.status(201).json({ message: 'Schedule added to user successfully', schedule: newSchedule });
      } catch (err) {
        // Handle errors
        next(err);
      }
    };
    
    
    
    
    
// Export the controller
module.exports = {
  signupMentor, getMentori, updateDetaljiMentora, getMentorStudents, getStudentsRaspored, getStudentRaspored, addScheduleToStudent,
};
