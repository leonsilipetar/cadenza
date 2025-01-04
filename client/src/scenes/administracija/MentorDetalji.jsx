import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig.js';
import { Icon } from '@iconify/react';
import { notifikacija } from '../../components/Notifikacija';

const MentorDetalji = ({ korisnikId, onCancel }) => {
  const [inputs, setInputs] = useState({
    korisnickoIme: '',
    email: '',
    ime: '',
    prezime: '',
    isAdmin: false,
    isMentor: true,
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
    school: '',
    students: [],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [studentInput, setStudentInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [schools, setSchools] = useState([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [assignedStudents, setAssignedStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mentorRes, schoolsRes] = await Promise.all([
          axios.get(`${ApiConfig.baseUrl}/api/korisnik/${korisnikId}`),
          axios.get(`${ApiConfig.baseUrl}/api/schools`)
        ]);

        const mentorData = mentorRes.data;
        setInputs(prev => ({
          ...prev,
          ...mentorData,
          datumRodjenja: mentorData.datumRodjenja ? new Date(mentorData.datumRodjenja).toISOString().split('T')[0] : '',
        }));

        setSchools(schoolsRes.data);

        // Fetch assigned students details
        if (mentorData.students?.length) {
          const studentsRes = await axios.get(`${ApiConfig.baseUrl}/api/mentor-students/${korisnikId}`);
          setAssignedStudents(studentsRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [korisnikId]);

  const handleSearch = async (e) => {
    const query = e.target.value || '';
    setStudentInput(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await axios.post(`${ApiConfig.baseUrl}/api/users`, { query });
      
      if (res.data && Array.isArray(res.data)) {
        const filteredResults = res.data.filter(student => 
          student && student._id && 
          !inputs.students?.some(s => s.ucenikId === student._id)
        );
        setSearchResults(filteredResults);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const handleAddStudent = async (studentId) => {
    try {
      await axios.post(`${ApiConfig.baseUrl}/api/add-student-to-mentor`, {
        mentorId: korisnikId,
        studentId
      });
      
      // Refresh assigned students
      const studentsRes = await axios.get(`${ApiConfig.baseUrl}/api/mentor-students/${korisnikId}`);
      setAssignedStudents(studentsRes.data);
      setSearchResults([]);
      setStudentInput('');
      notifikacija('Učenik uspješno dodan', 'success');
    } catch (error) {
      console.error('Error adding student:', error);
      notifikacija('Greška pri dodavanju učenika', 'error');
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      await axios.post(`${ApiConfig.baseUrl}/api/remove-student-from-mentor`, {
        mentorId: korisnikId,
        studentId
      });
      
      setAssignedStudents(prev => prev.filter(student => student._id !== studentId));
      notifikacija('Učenik uspješno uklonjen', 'success');
    } catch (error) {
      console.error('Error removing student:', error);
      notifikacija('Greška pri uklanjanju učenika', 'error');
    }
  };

  const handlePasswordReset = async () => {
    try {
      setIsResetting(true);
      await axios.post(`${ApiConfig.baseUrl}/api/reset-password`, {
        userId: korisnikId,
        userType: 'mentor',
        email: inputs.email
      });
      notifikacija('Nova lozinka je poslana na email.', 'success');
      setShowResetConfirm(false);
    } catch (error) {
      notifikacija('Greška pri resetiranju lozinke.', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="popup">
      <form onSubmit={handleSubmit}>
        {/* Existing form fields */}
        
        {/* School dropdown */}
        <div className="div">
          <label htmlFor="kor-skola">Škola:</label>
          <select
            className="input-login-signup"
            value={inputs.school}
            onChange={(e) => setInputs(prev => ({ ...prev, school: e.target.value }))}
            name="school"
            id="kor-skola"
          >
            <option value="">Odaberi školu</option>
            {schools.map((school) => (
              <option key={school._id} value={school._id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        {/* Students section */}
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
              {searchResults.map((student) => (
                <div key={student._id} className="tr redak">
                  <div className="th">{student.ime} {student.prezime}</div>
                  <div className="th">
                    <button 
                      className="action-btn abEdit"
                      onClick={() => handleAddStudent(student._id)}
                      type="button"
                    >
                      <Icon icon="solar:add-circle-broken" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

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
                    <button 
                      className="action-btn abDelete"
                      onClick={() => handleRemoveStudent(student.ucenikId)}
                      type="button"
                    >
                      <Icon icon="solar:trash-bin-trash-broken" />
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Action buttons */}
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