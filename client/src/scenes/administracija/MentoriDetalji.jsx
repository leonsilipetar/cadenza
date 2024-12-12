import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApiConfig  from '../../components/apiConfig.js';
import { toast } from 'react-toastify';
import Notification from '../../components/Notifikacija';

axios.defaults.withCredentials = true;

const MentorDetalji = ({ korisnikId, onCancel }) => {
  const [inputs, setInputs] = useState({
    korisnickoIme: '',
    email: '',
    ime: '',
    prezime: '',
    isAdmin: false,
    isMentor: false,
    isStudent: true,
    oib: '',
    program: '',
    brojMobitela: '',
    datumRodjenja: '',
    adresa: {
      ulica: '',
      kucniBroj: '',
      mjesto: '',
    },
    napomene: '',
    students: [],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [studentInput, setStudentInput] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [studentsToRemove, setStudentsToRemove] = useState([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [notification, setNotification] = useState(null);

  const getDetaljiKorisnika = async (korisnikId) => {
    try {
      // Assuming userId is the ID of the selected user
      const res = await axios.get(`${ApiConfig.baseUrl}/api/korisnik/${korisnikId}`, {
        withCredentials: true,
      });

      const detaljiKorisnika = res.data;
      return detaljiKorisnika;
    } catch (err) {
      console.error(err);
      throw err; // Propagate the error to the caller
    }
  };




  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const urediKorisnika = async (updatedData) => {
    try {
      const res = await axios.put(`${ApiConfig.baseUrl}/api/update-mentor/${korisnikId}`, updatedData);
      const data = res.data;
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };



  const fetchAllStudents = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/all-students`, {
        withCredentials: true,
      });

      const students = res.data.students; // Assuming the response has a 'students' property
      setAllStudents(students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleStudentInputChange = (e) => {
    setStudentInput(e.target.value);

    const filteredStudents = allStudents.filter(
      (student) =>
        student.ime.toLowerCase().includes(e.target.value.toLowerCase()) ||
        student.prezime.toLowerCase().includes(e.target.value.toLowerCase())
    );

    // Check if the filtered students are not already in mentor's students list
    const nonExistingStudents = filteredStudents.filter(
      (student) => !inputs.students || !inputs.students.some((s) => s.ucenikId === student._id)
    );

    setFilteredStudents(nonExistingStudents);
  };

  const addSelectedStudent = (student) => {
    setSelectedStudents((prevSelectedStudents) => {
      // Check if the student already exists in the selected students
      if (!prevSelectedStudents.some((s) => s.ucenikId === student._id)) {
        return [...prevSelectedStudents, student];
      } else {
        // If the student already exists, return the previous state
        return prevSelectedStudents;
      }
    });

    setInputs((prevInputs) => {
      const updatedStudents = prevInputs.students || [];
      // Check if the student already exists in the students array
      if (!updatedStudents.some((s) => s.ucenikId === student._id)) {
        return {
          ...prevInputs,
          students: [...updatedStudents, { ucenikId: student._id, ime: student.ime, prezime: student.prezime }],
        };
      } else {
        // If the student already exists, return the previous state
        return prevInputs;
      }
    });

    setStudentInput('');
    setFilteredStudents([]);
  };





  const removeSelectedStudent = (studentId) => {
    const updatedSelectedStudents = selectedStudents.filter((student) => student._id !== studentId);
    setSelectedStudents(updatedSelectedStudents);

    setStudentsToRemove((prevStudentsToRemove) => [...prevStudentsToRemove, { ucenikId: studentId }]);

    setInputs((prevInputs) => {
      const nonNullStudents = prevInputs.students.filter((student) => student !== null);
      const updatedStudents = nonNullStudents.filter((student) => student.ucenikId !== studentId);
      return {
        ...prevInputs,
        students: updatedStudents,
      };
    });
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Include the logic to send the data to the backend
    const result = await urediKorisnika({
      ...inputs,
      studentsToRemove,
      students: selectedStudents, // Include the selectedStudents array in the data
    });

    if (result) {
      console.log('User updated successfully:', result);
    } else {
      console.log('User update failed.');
    }

    // Reset the studentsToRemove state
    setStudentsToRemove([]);

    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };




  const handlePasswordReset = async () => {
    try {
      setIsResetting(true);
      await axios.post(`${ApiConfig.baseUrl}/api/auth/reset-password`, {
        userId: korisnikId,
        userType: 'mentor',
        email: inputs.email
      });
      setNotification({
        message: 'Nova lozinka je poslana na email.',
        type: 'success'
      });
      setShowResetConfirm(false);
    } catch (error) {
      setNotification({
        message: error.response?.data?.message || 'Greška pri resetiranju lozinke.',
        type: 'error'
      });
    } finally {
      setIsResetting(false);
    }
  };

  useEffect(() => {
    getDetaljiKorisnika(korisnikId).then((data) => {
      const formattedDate = data.datumRodjenja ? new Date(data.datumRodjenja).toISOString().split('T')[0] : '';
      setInputs({
        korisnickoIme: data.korisnickoIme,
        email: data.email,
        ime: data.ime,
        prezime: data.prezime,
        isAdmin: data.isAdmin,
        isMentor: data.isMentor,
        isStudent: data.isStudent,
        oib: data.oib,
        program: data.program,
        brojMobitela: data.brojMobitela,
        datumRodjenja: formattedDate,
        adresa: {
          ulica: data.adresa?.ulica || '',
          kucniBroj: data.adresa?.kucniBroj || '',
          mjesto: data.adresa?.mjesto || '',
        },
        napomene: data.napomene,
        students: data.students,
      });
    });
    fetchAllStudents();
  }, [korisnikId]);

  return(
    <div className="popup">
      <form onSubmit={handleSubmit}>
        <div className="div">
          <label htmlFor="kor-Korime">Korisničko ime:</label>
          <input
            className="input-login-signup"
            value={inputs.korisnickoIme}
            onChange={handleChange}
            type="text"
            name="korisnickoIme"
            id="kor-Korime"
            placeholder="korisničko ime"
          />
          <label htmlFor="kor-email">Email:</label>
          <input
            className="input-login-signup"
            value={inputs.email}
            onChange={handleChange}
            type="email"
            name="email"
            id="kor-email"
            placeholder="e-mail adresa"
          />
          <label htmlFor="kor-oib">OIB:</label>
          <input
          className="input-login-signup"
          value={inputs.oib}
          onChange={(e) => setInputs({ ...inputs, oib: e.target.value })}
          type="text"
          name="oib"
          id="kor-oib"
          placeholder="OIB"
          maxLength={11}
          pattern="\d{11}"
          required
          />
        </div>


        <div className="div">
              <label htmlFor="kor-ime">Ime:</label>
          <input
            className="input-login-signup"
            value={inputs.ime}
            onChange={handleChange}
            type="text"
            name="ime"
            id="kor-ime"
            placeholder="ime"
          />
      <label htmlFor="kor-prezime">Prezime:</label>
          <input
            className="input-login-signup"
            value={inputs.prezime}
            onChange={handleChange}
            type="text"
            name="prezime"
            id="kor-prezime"
            placeholder="prezime"
          />
          <label htmlFor="kor-datum-rodjenja">Datum rođenja:</label>
            <input
              className="input-login-signup"
              value={inputs.datumRodjenja}
              onChange={(e) => setInputs({ ...inputs, datumRodjenja: e.target.value })}
              type="date"
              name="datumRodjenja"
              id="kor-datum-rodjenja"
              placeholder="datum rođenja"
            />
<label htmlFor="kor-brojMobitela">Broj mobitela:</label>
          <input
            className="input-login-signup"
            value={inputs.brojMobitela}
            onChange={handleChange}
            type="text"
            name="brojMobitela"
            id="kor-brojMobitela"
            placeholder="broj mobitela"
          />
      </div>

<div className="div">
<label htmlFor="kor-program">Program:</label>
          <input
            className="input-login-signup"
            value={inputs.program}
            onChange={handleChange}
            type="text"
            name="program"
            id="kor-program"
            placeholder="program"
          />
          </div>
          <div className="div div-clmn">
          <label htmlFor="kor-mentor">Učenici:</label>
          <input
            className="input-login-signup"
            type="text"
            name="ucenici"
            id="kor-mrntor"
            placeholder="Dodaj učenike"
            onChange={handleStudentInputChange}
            value={studentInput}
          />
          <div className="autocomplete-suggestions">
            {filteredStudents.map((student) => (
              <>
              <div
                key={student.id}
                className="gumb btn action-btn spremtBtn"
                onClick={() => addSelectedStudent(student)}
              >
                {student.ime} {student.prezime}
              </div>
              </>
            ))}
          </div>
          <div className="selected-students ">
            {selectedStudents.map((student) => (
              <>
              <div key={student._id} className="div-radio selected-student action-btn">
                {student.ime} {student.prezime}
                <button className='gumb action-btn btn abDelete' onClick={() => removeSelectedStudent(student._id)}>Poništi odabir</button>
              </div>
              </>
            ))}
          </div>
          <div className='div div-clmn'>
  Dodani učenici:
  {inputs.students?.map((student) => (
    student ? (
      <div key={student.ucenikId} className="selected-student action-btn">
        {student.ime} {student.prezime}
      </div>
    ) : null
  ))}
</div>



        </div>


          <div className='div'>
          <label htmlFor="kor-ulica">Ulica:</label>
          <input
            className="input-login-signup"
            onChange={(e) => setInputs({ ...inputs, adresa: { ...inputs.adresa, ulica: e.target.value } })}
            type="text"
            name="ulica"
            id="kor-ulica"
            placeholder="ulica"
            value={inputs.adresa.ulica}
          />
      <label htmlFor="kor-kucni-broj">Kućni broj:</label>
          <input
            className="input-login-signup"
            onChange={(e) => setInputs({ ...inputs, adresa: { ...inputs.adresa, kucniBroj: e.target.value } })}
            type="text"
            name="kucniBroj"
            id="kor-kucni-broj"
            placeholder="kućni broj"
            value={inputs.adresa.kucniBroj}
          />
      <label htmlFor="kor-mjesto">Mjesto:</label>
          <input
            className="input-login-signup"
            onChange={(e) => setInputs({ ...inputs, adresa: { ...inputs.adresa, mjesto: e.target.value } })}
            type="text"
            name="mjesto"
            id="kor-mjesto"
            placeholder="mjesto"
            value={inputs.adresa.mjesto}
          />
          </div>


          <div className="div-radio">
          <div
            className={`radio-item ${inputs.isAdmin ? 'checked' : ''}`}
            onClick={() => setInputs({ ...inputs, isAdmin: !inputs.isAdmin })}
          >
            <input
              type="radio"
              id="isAdmin"
              checked={inputs.isAdmin}
              onChange={() => setInputs({ ...inputs, isAdmin: !inputs.isAdmin })}
              style={{ display: 'none' }}
            />
            {inputs.isAdmin ? 'Administrator' : 'Nije administrator'}
          </div>
        </div>

          <div className="div">
          <label htmlFor="kor-napomene">Napomene:</label>
            <textarea
              className="input-login-signup"
              value={inputs.napomene}
              onChange={(e) => setInputs({ ...inputs, napomene: e.target.value })}
              name="napomene"
              id="kor-napomene"
              placeholder="Unesite napomene o korisniku "
              maxLength={5000}
            />
            </div>


          <div className='div-radio'>
          <button
            className="gumb action-btn zatvoriBtn"
            onClick={() => onCancel()}
          >
            Zatvori
          </button>
          <button
            className="gumb action-btn spremiBtn"
            type="submit"
          >
            {isSaving ? 'Spremanje...' : 'Spremi promjene'}
          </button>
          {!showResetConfirm ? (
            <button
              className="gumb action-btn abExpand"
              type="button"
              onClick={() => setShowResetConfirm(true)}
            >
              Resetiraj lozinku
            </button>
          ) : (
            <>
              <button
                className="gumb action-btn abDelete"
                type="button"
                onClick={() => setShowResetConfirm(false)}
              >
                Odustani
              </button>
              <button
                className="gumb action-btn abEdit"
                type="button"
                onClick={handlePasswordReset}
                disabled={isResetting}
              >
                {isResetting ? 'Resetiranje...' : 'Resetiraj'}
              </button>
            </>
          )}

          </div>
      </form>
      {notification && (
        <Notification
          message={notification.message}
          notification={notification}
        />
      )}
    </div>
  )

};

export default MentorDetalji ;