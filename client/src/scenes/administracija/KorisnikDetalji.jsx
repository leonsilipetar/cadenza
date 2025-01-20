import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig';
import Notification from '../../components/Notifikacija';

axios.defaults.withCredentials = true;

const KorisnikDetalji = ({ korisnikId, onCancel }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [schools, setSchools] = useState([]);
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
      const res = await axios.put(`${ApiConfig.baseUrl}/api/update-korisnik/${korisnikId}`, inputs);
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
      console.log('User updated successfully:', result);
    } else {
      console.log('User update failed.');
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
        mentor: data.mentors || '',  // Ensure default value is set
        school: data.school || '',  // Ensure default value is set
        datumRodjenja: formattedDate,
        adresa: {
          ulica: data.adresa?.ulica || '',
          kucniBroj: data.adresa?.kucniBroj || '',
          mjesto: data.adresa?.mjesto || '',
        },
        pohadjaTeoriju: data.pohadjaTeoriju,
        napomene: data.napomene,
        maloljetniClan: data.maloljetniClan,
        roditelj1: {
          ime: data.roditelj1?.ime || '',
          prezime: data.roditelj1?.prezime || '',
          brojMobitela: data.roditelj1?.brojMobitela || '',
        },
        roditelj2: {
          ime: data.roditelj2?.ime || '',
          prezime: data.roditelj2?.prezime || '',
          brojMobitela: data.roditelj2?.brojMobitela || '',
        },
      });
    });

    fetchMentors();
    fetchSchools();
  }, [korisnikId]);

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
            value={inputs.program}
            onChange={handleChange}
            type="text"
            name="program"
            id="kor-program"
            placeholder="program"
          />
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
