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
    program, // ID programa koji se dodjeljuje mentoru
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
  const passwordLength = 8;
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

    // Poveži mentora s programom
    if (program) {
      const programObj = await Program.findById(program);
      if (programObj) {
        programObj.mentori.push(mentor._id);
        await programObj.save();
      }
    }

    // Send the random password to the mentor's email
    await sendPasswordEmail(email, randomPassword);

    return res.status(201).json({ message: 'Uspješno ste registrirali mentora, lozinka poslana na email.' });
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

        // Directly remove students
        if (updateData.studentsToRemove && Array.isArray(updateData.studentsToRemove)) {
          const studentsToRemove = updateData.studentsToRemove;
          // Remove the students from the mentor's students array
          detaljiMentora.students = detaljiMentora.students.filter(student => !studentsToRemove.includes(student._id.toString()));
          delete updateData.studentsToRemove; // remove this from the update data
        }

        // Update students if any are provided
        if (updateData.students && Array.isArray(updateData.students)) {
          // Directly replace or add new students to the mentor
          detaljiMentora.students = updateData.students;
          delete updateData.students; // remove this from the update data
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
      const mentorId = req.id;
      console.log(" getMentorsStudents mentorId: ", mentorId);

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
      try {
        const students = await User.find({ isStudent: true });

        // Log the students for debugging purposes
        console.log("Fetched students:", students);

        const schedules = await Promise.all(
          students.map(async (student) => {
            console.log(`Fetching schedule for student with ID: ${student._id}`);

            // Fetch the schedule for the student
            const schedule = await Raspored.findOne({ ucenikId: student._id });

            if (!schedule) {
              console.log(`No schedule found for student with ID: ${student._id}`);
            }

            return {
              ucenikId: student,
              schedule: schedule || null,
            };
          })
        );

        res.json({ students, schedules });
      } catch (err) {
        console.error("Error fetching students' schedules:", err);
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

    const deleteRaspored = async (req, res) => {
      try {
          const { id } = req.params; // ID učenika čiji termin treba obrisati
          const { day, terminId } = req.query; // Dan i ID termina koji treba obrisati

          console.log("StudentID:", id);
          console.log("Day:", day);
          console.log("TerminID:", terminId);

          // Provjerite je li ID učenika valjan
          if (!mongoose.Types.ObjectId.isValid(id)) {
              return res.status(400).json({ message: 'Invalid student ID' });
          }

          // Pronađite korisnika po ID-u
          const user = await User.findById(id);

          // Provjerite postoji li korisnik
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }

          // Fetch the schedule using rasporedId from the user object
          const schedule = await Raspored.findById(user.rasporedId);

          // Provjerite postoji li raspored
          if (!schedule) {
              return res.status(404).json({ message: 'Schedule not found' });
          }

          // Provjerite ima li korisnik raspored za taj dan
          if (!schedule[day]) {
              return res.status(404).json({ message: 'No schedule found for this user on the specified day' });
          }

          // Pronađite indeks termina koji treba obrisati
          const terminIndex = schedule[day].findIndex(termin => termin._id.toString() === terminId);

          if (terminIndex === -1) {
              return res.status(404).json({ message: 'Termin not found in user\'s schedule' });
          }

          // Uklonite termin iz rasporeda
          schedule[day].splice(terminIndex, 1);

          // Spremite ažurirani raspored
          await schedule.save();

          res.status(200).json({ message: 'Termin deleted successfully' });
      } catch (error) {
          console.error('Error deleting term:', error);
          res.status(500).json({ message: 'Internal server error', error: error.message });
      }
    };



// Export the controller
module.exports = {
  signupMentor, getMentori, updateDetaljiMentora, getMentorStudents, getStudentsRaspored, getStudentRaspored, addScheduleToStudent,deleteRaspored,
};