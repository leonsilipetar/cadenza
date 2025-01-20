import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig.js';
import { Icon } from '@iconify/react';
import { notifikacija } from '../../components/Notifikacija';

axios.defaults.withCredentials = true;

const MentorDetalji = ({ korisnikId, onCancel }) => {
  const [inputs, setInputs] = useState({
    korisnickoIme: '',
    email: '',
    ime: '',
    prezime: '',
    isAdmin: false,
    isMentor: true,
    isStudent: false,
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
    school: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [studentInput, setStudentInput] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [schools, setSchools] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [studentToRemove, setStudentToRemove] = useState(null);

  const getDetaljiKorisnika = async (korisnikId) => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/korisnik/${korisnikId}`, {
        withCredentials: true,
      });

      const detaljiKorisnika = res.data;
      return detaljiKorisnika;
    } catch (err) {
      console.error(err);
      throw err;
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

      const students = res.data.students;
      setAllStudents(students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value || '';
    setStudentInput(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await axios.post(`${ApiConfig.baseUrl}/api/users`, { query });

      if (res.data) {
        const students = Array.isArray(res.data) ? res.data : res.data.results || [];
        const mappedResults = students.filter(student => student && student.isStudent)
          .map(student => ({
            ...student,
            isAssigned: inputs.students?.some(s => s.ucenikId === student._id)
          }));

        setSearchResults(mappedResults);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const handleAddStudent = async (studentId) => {
    const studentToAdd = searchResults.find(s => s._id === studentId);

    if (studentToAdd) {
      setInputs(prev => ({
        ...prev,
        students: [...(prev.students || []), {
          ucenikId: studentToAdd._id,
          ime: studentToAdd.ime,
          prezime: studentToAdd.prezime
        }]
      }));

      setStudentInput('');
      setSearchResults([]);
      notifikacija('Učenik uspješno dodan', 'success');
    }
  };

  const handleRemoveStudent = (studentId) => {
    setInputs((prev) => ({
      ...prev,
      students: prev.students.filter(s => s.ucenikId !== studentId) // Remove only the student with the matching id
    }));

    notifikacija('Učenik uspješno uklonjen', 'success');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const result = await urediKorisnika({
      ...inputs,
      students: inputs.students, // Send the complete updated students array
    });

    if (result) {
      console.log('User updated successfully:', result);
    } else {
      console.log('User update failed.');
    }

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
        school: data.school,
      });
    });
    fetchAllStudents();
  }, [korisnikId]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await axios.get(`${ApiConfig.baseUrl}/api/schools`);
        setSchools(res.data);
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };

    fetchSchools();
  }, []);

  return (
    <div className="popup">
      <form onSubmit={handleSubmit}>
        <div className="div">

        <label>Korisničko ime:</label>
          <input
            className="input-login-signup"
            type="text"
            name="korisnickoIme"
            value={inputs.korisnickoIme}
            onChange={handleChange}
            placeholder="Korisničko ime"
          />

          <label>Email:</label>
          <input
            className="input-login-signup"
            type="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            placeholder="Email"
          />

          <label>OIB:</label>
          <input
            className="input-login-signup"
            type="text"
            name="oib"
            value={inputs.oib}
            onChange={handleChange}
            placeholder="OIB"
          />

        </div>

        <div className="div">
        <label>Ime:</label>
          <input
            className="input-login-signup"
            type="text"
            name="ime"
            value={inputs.ime}
            onChange={handleChange}
            placeholder="Ime"
          />

          <label>Prezime:</label>
          <input
            className="input-login-signup"
            type="text"
            name="prezime"
            value={inputs.prezime}
            onChange={handleChange}
            placeholder="Prezime"
          />
          <label>Broj mobitela:</label>
          <input
            className="input-login-signup"
            type="text"
            name="brojMobitela"
            value={inputs.brojMobitela}
            onChange={handleChange}
            placeholder="Broj mobitela"
          />
          <label>Datum rođenja:</label>
          <input
            className="input-login-signup"
            type="date"
            name="datumRodjenja"
            value={inputs.datumRodjenja}
            onChange={handleChange}
            placeholder="Datum rođenja"
          />
        </div>

        <div className="div">
          <label>Adresa:</label>
          <input
            className="input-login-signup"
            type="text"
            name="adresa.ulica"
            value={inputs.adresa.ulica}
            onChange={handleChange}
            placeholder="Ulica"
          />
          <input
            className="input-login-signup"
            type="text"
            name="adresa.kucniBroj"
            value={inputs.adresa.kucniBroj}
            onChange={handleChange}
            placeholder="Kućni broj"
          />
          <input
            className="input-login-signup"
            type="text"
            name="adresa.mjesto"
            value={inputs.adresa.mjesto}
            onChange={handleChange}
            placeholder="Mjesto"
          />
        </div>

        {/* Add admin toggle */}
        <div className="div-radio">
          <div
            className={`radio-item ${inputs.isAdmin ? 'checked' : ''}`}
            onClick={() => setInputs(prev => ({ ...prev, isAdmin: !prev.isAdmin }))}
          >
            <input
              type="radio"
              id="isAdmin"
              checked={inputs.isAdmin}
              onChange={() => setInputs(prev => ({ ...prev, isAdmin: !prev.isAdmin }))}
              style={{ display: 'none' }}
            />
            {inputs.isAdmin ? 'Administrator' : 'Nije administrator'}
          </div>
        </div>

        {/* Add napomene textarea */}
        <div className="div">
          <label htmlFor="kor-napomene">Napomene:</label>
          <textarea
            className="input-login-signup"
            value={inputs.napomene}
            onChange={(e) => setInputs(prev => ({ ...prev, napomene: e.target.value }))}
            name="napomene"
            id="kor-napomene"
            placeholder="Unesite napomene o korisniku"
            maxLength={5000}
          />
        </div>

        {/* Students Section */}
        <div className="div div-clmn">
          <label>Učenici:</label>
          <input
            className="input-login-signup"
            type="text"
            value={studentInput}
            onChange={handleSearch}
            placeholder="Pretraži učenike"
          />

          {searchResults.length > 0 && (
            <div className="tablica">
              <div className="tr naziv">
                <div className="th">Rezultati pretrage</div>
                <div className="th"></div>
              </div>
              {searchResults.map((student) => (
                <div key={student._id} className="tr redak">
                  <div className="th">{student.ime} {student.prezime}</div>
                  <div className="th">
                    {student.isAssigned ? (
                      <>
                        {studentToRemove?.ucenikId === student._id ? (
                          <>
                            <button
                              className="gumb action-btn abDelete"
                              type="button"
                              onClick={() => handleRemoveStudent(student._id)}
                            >
                              Ukloni
                            </button>
                            <button
                              className="gumb action-btn abEdit"
                              type="button"
                              onClick={() => setStudentToRemove(null)}
                            >
                              Odustani
                            </button>
                          </>
                        ) : (
                          <button
                            className="gumb action-btn abDelete"
                            type="button"
                            onClick={() => setStudentToRemove({ ucenikId: student._id })}
                          >
                            <Icon icon="solar:trash-bin-trash-broken" />
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        className="action-btn abEdit"
                        onClick={() => handleAddStudent(student._id)}
                        type="button"
                      >
                        <Icon icon="solar:add-circle-broken" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Added students */}
          <div className="tablica">
            <div className="tr naziv">
              <div className="th">Dodani učenici</div>
              <div className="th"></div>
            </div>
            {inputs.students?.map((student) => (
  student && (
    <div key={student.ucenikId} className="tr redak">
      <div className="th">{student.ime} {student.prezime}</div>
      <div className="th">
        {studentToRemove?.ucenikId === student.ucenikId ? (
          <>
            <button
              className="gumb action-btn abDelete"
              type="button"
              onClick={() => handleRemoveStudent(student.ucenikId)}
            >
              Ukloni
            </button>
            <button
              className="gumb action-btn abEdit"
              type="button"
              onClick={() => setStudentToRemove(null)}
            >
              Odustani
            </button>
          </>
        ) : (
          <button
            className="action-btn abDelete"
            onClick={() => setStudentToRemove(student)}
            type="button"
          >
            <Icon icon="solar:trash-bin-trash-broken" />
          </button>
        )}
      </div>
    </div>
  )
))}
          </div>
        </div>

        {/* Submit and password reset buttons */}
        <div className="div-radio">
          <button
            className="gumb action-btn zatvoriBtn"
            onClick={() => onCancel()}
            type="button"
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
    </div>
  );
};

export default MentorDetalji;
