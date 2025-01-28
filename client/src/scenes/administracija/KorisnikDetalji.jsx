import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig';
import Notification from '../../components/Notifikacija';
import { Icon } from '@iconify/react';

axios.defaults.withCredentials = true;

const KorisnikDetalji = ({ korisnikId, onCancel }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [schools, setSchools] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [inputs, setInputs] = useState({
    korisnickoIme: '',
    email: '',
    ime: '',
    prezime: '',
    isAdmin: false,
    isMentor: false,
    isStudent: true,
    oib: '',
    program: [],
    brojMobitela: '',
    mentor: '',  // Initial value for mentor
    school: '',  // Initial value for school
    datumRodjenja: '',
    adresa: {
      ulica: '',
      kucniBroj: '',
      mjesto: '',
    },
    pohadjaTeoriju: false,
    napomene: '',
    maloljetniClan: false,
    roditelj1: {
      ime: '',
      prezime: '',
      brojMobitela: '',
    },
    roditelj2: {
      ime: '',
      prezime: '',
      brojMobitela: '',
    },
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [programInput, setProgramInput] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [programToRemove, setProgramToRemove] = useState(null);

  const fetchMentors = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/mentori`);
      setMentors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSchools = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/schools`);
      setSchools(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPrograms = async () => {
    try {
      const userRes = await axios.get(`${ApiConfig.baseUrl}/api/user`, { 
        withCredentials: true 
      });
      
      const programsRes = await axios.get(
        `${ApiConfig.baseUrl}/api/programs?school=${userRes.data.user.school}`, 
        { withCredentials: true }
      );
      
      setPrograms(Array.isArray(programsRes.data) ? programsRes.data : []);
    } catch (err) {
      console.error('Error fetching programs:', err);
    }
  };

  const getDetaljiKorisnika = async (korisnikId) => {
    try {
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
    const { name, value } = e.target;

    if (name === "mentor" || name === "school") {
      setInputs((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name in inputs.adresa) {
      setInputs((prev) => ({
        ...prev,
        adresa: { ...prev.adresa, [name]: value },
      }));
    } else {
      setInputs((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const urediKorisnika = async () => {
    try {
      const res = await axios.put(
        `${ApiConfig.baseUrl}/api/update-korisnik/${korisnikId}`, 
        {
          ...inputs,
          program: selectedPrograms.map(program => program._id) // Send program IDs
        },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const result = await urediKorisnika();
    if (result) {
      setNotification({
        type: 'success',
        message: 'Korisnik uspješno ažuriran'
      });
      onCancel();
    } else {
      setNotification({
        type: 'error',
        message: 'Greška pri ažuriranju korisnika'
      });
    }
    setIsSaving(false);
  };

  const handlePasswordReset = async () => {
    try {
      setIsResetting(true);
      await axios.post(`${ApiConfig.baseUrl}/api/reset-password`, {
        userId: korisnikId,
        userType: 'student',
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

  const handleAddProgram = async (programId) => {
    try {
      const program = programs.find(p => p._id === programId);
      if (!program) return;

      setInputs(prev => ({
        ...prev,
        program: [...(prev.program || []), programId]
      }));

      setSelectedPrograms(prev => [...prev, program]);
      setProgramInput('');
    } catch (err) {
      console.error('Error adding program:', err);
    }
  };

  const handleRemoveProgram = async (programId) => {
    try {
      setInputs(prev => ({
        ...prev,
        program: prev.program.filter(id => id !== programId)
      }));

      setSelectedPrograms(prev => 
        prev.filter(program => program._id !== programId)
      );
      setProgramToRemove(null);
    } catch (err) {
      console.error('Error removing program:', err);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch user details
        const userData = await getDetaljiKorisnika(korisnikId);
        const formattedDate = userData.datumRodjenja ? 
          new Date(userData.datumRodjenja).toISOString().split('T')[0] : '';

        // Fetch programs for user's school
        const userRes = await axios.get(`${ApiConfig.baseUrl}/api/user`, { 
          withCredentials: true 
        });
        
        const programsRes = await axios.get(
          `${ApiConfig.baseUrl}/api/programs?school=${userRes.data.user.school}`, 
          { withCredentials: true }
        );
        
        const fetchedPrograms = Array.isArray(programsRes.data) ? programsRes.data : [];
        setPrograms(fetchedPrograms);

        // Set user data
        setInputs({
          korisnickoIme: userData.korisnickoIme,
          email: userData.email,
          ime: userData.ime,
          prezime: userData.prezime,
          isAdmin: userData.isAdmin,
          isMentor: userData.isMentor,
          isStudent: userData.isStudent,
          oib: userData.oib,
          program: userData.program || [],
          brojMobitela: userData.brojMobitela,
          mentor: userData.mentors || '',
          school: userData.school || '',
          datumRodjenja: formattedDate,
          adresa: {
            ulica: userData.adresa?.ulica || '',
            kucniBroj: userData.adresa?.kucniBroj || '',
            mjesto: userData.adresa?.mjesto || '',
          },
          pohadjaTeoriju: userData.pohadjaTeoriju,
          napomene: userData.napomene,
          maloljetniClan: userData.maloljetniClan,
          roditelj1: {
            ime: userData.roditelj1?.ime || '',
            prezime: userData.roditelj1?.prezime || '',
            brojMobitela: userData.roditelj1?.brojMobitela || '',
          },
          roditelj2: {
            ime: userData.roditelj2?.ime || '',
            prezime: userData.roditelj2?.prezime || '',
            brojMobitela: userData.roditelj2?.brojMobitela || '',
          },
        });

        // Set selected programs after both user data and programs are loaded
        if (userData.program && userData.program.length > 0 && fetchedPrograms.length > 0) {
          const userPrograms = fetchedPrograms.filter(p => 
            userData.program.includes(p._id)
          );
          setSelectedPrograms(userPrograms);
        }

        // Fetch other required data
        await Promise.all([
          fetchMentors(),
          fetchSchools()
        ]);

      } catch (error) {
        console.error('Error fetching initial data:', error);
        setNotification({
          type: 'error',
          message: 'Greška pri učitavanju podataka'
        });
      }
    };

    fetchInitialData();
  }, [korisnikId]); // Only depend on korisnikId

  return (
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
            required
          />
          <label htmlFor="kor-oib">OIB:</label>
          <input
            className="input-login-signup"
            value={inputs.oib}
            onChange={handleChange}
            type="text"
            name="oib"
            id="kor-oib"
            placeholder="OIB"
            maxLength={11}
            pattern="\d{11}"
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
            onChange={handleChange}
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
            type="text"
            value={programInput}
            onChange={(e) => setProgramInput(e.target.value)}
            placeholder="Pretraži programe..."
          />
          
          {/* Program search results */}
          {programInput.length > 0 && (
            <div className="search-results">
              {programs
                .filter(program => 
                  program.naziv.toLowerCase().includes(programInput.toLowerCase()) &&
                  !selectedPrograms.some(sp => sp._id === program._id)
                )
                .map(program => (
                  <div key={program._id} className="tr redak">
                    <div className="th">{program.naziv}</div>
                    <div className="th">
                      <button
                        className="action-btn abEdit"
                        onClick={() => handleAddProgram(program._id)}
                        type="button"
                      >
                        <Icon icon="solar:add-circle-broken" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Selected programs */}
          <div className="tablica">
            <div className="tr naziv">
              <div className="th">Dodani programi</div>
              <div className="th"></div>
            </div>
            {selectedPrograms.map((program) => (
              <div key={program._id} className="tr redak">
                <div className="th">{program.naziv}</div>
                <div className="th">
                  {programToRemove?._id === program._id ? (
                    <>
                      <button
                        className="gumb action-btn abDelete"
                        type="button"
                        onClick={() => handleRemoveProgram(program._id)}
                      >
                        Ukloni
                      </button>
                      <button
                        className="gumb action-btn abEdit"
                        type="button"
                        onClick={() => setProgramToRemove(null)}
                      >
                        Odustani
                      </button>
                    </>
                  ) : (
                    <button
                      className="action-btn abDelete"
                      onClick={() => setProgramToRemove(program)}
                      type="button"
                    >
                      <Icon icon="solar:trash-bin-trash-broken" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="div">
          <label htmlFor="kor-mentor">Mentor:</label>
          <input
            className="input-login-signup"
            value={mentors.map(mentor => mentor.korisnickoIme).join(', ')}
            disabled
            type="text"
            name="mentor"
            id="kor-mentor"
          />
          <label htmlFor="kor-skola">Škola:</label>
          <select
            className="input-login-signup"
            value={inputs.school}
            onChange={handleChange}
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

        <div className="div">
          <label htmlFor="kor-ulica">Ulica:</label>
          <input
            className="input-login-signup"
            onChange={handleChange}
            type="text"
            name="ulica"
            id="kor-ulica"
            placeholder="ulica"
            value={inputs.adresa.ulica}
          />
          <label htmlFor="kor-kucni-broj">Kućni broj:</label>
          <input
            className="input-login-signup"
            onChange={handleChange}
            type="text"
            name="kucniBroj"
            id="kor-kucni-broj"
            placeholder="kućni broj"
            value={inputs.adresa.kucniBroj}
          />
          <label htmlFor="kor-mjesto">Mjesto:</label>
          <input
            className="input-login-signup"
            onChange={handleChange}
            type="text"
            name="mjesto"
            id="kor-mjesto"
            placeholder="mjesto"
            value={inputs.adresa.mjesto}
          />
        </div>

        <div className="div-radio">
          <div className="checkbox-group">
            <div
              className={`checkbox-item ${inputs.pohadjaTeoriju ? 'checked' : ''}`}
              onClick={() => setInputs((prev) => ({ ...prev, pohadjaTeoriju: !prev.pohadjaTeoriju }))}>
              <input
                type="checkbox"
                id="pohadjaTeoriju"
                checked={inputs.pohadjaTeoriju}
                onChange={() => setInputs((prev) => ({ ...prev, pohadjaTeoriju: !prev.pohadjaTeoriju }))}
                style={{ display: 'none' }}
              />
              {inputs.pohadjaTeoriju ? 'Pohađa teoriju' : 'Ne pohađa teoriju'}
            </div>
          </div>
        </div>

        <div className="div">
          <label htmlFor="kor-napomene">Napomene:</label>
          <textarea
            className="input-login-signup"
            value={inputs.napomene}
            onChange={handleChange}
            name="napomene"
            id="kor-napomene"
            placeholder="Unesite napomene o korisniku"
            maxLength={5000}
          />
        </div>

        <div className="div-radio">
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
  );
};

export default KorisnikDetalji;
