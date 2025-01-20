import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig';
import Notification from '../../components/Notifikacija';

axios.defaults.withCredentials = true;

const DodajKorisnika = ({ onDodajKorisnika, onCancel }) => {
  const [mentors, setMentors] = useState([]);
  const [schools, setSchools] = useState([]);
  const [notification, setNotification] = useState(null);
  const [inputs, setInputs] = useState({
    korisnickoIme: '',
    email: '',
    ime: '',
    prezime: '',
    isAdmin: false,
    isMentor: false,
    isStudent: true,
    oib: '',
    /*program: '',*/
    brojMobitela: '',
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
      brojMobitela: ''
    },
    roditelj2: {
      ime: '',
      prezime: '',
      brojMobitela: '',
    },
    school: '', // Add school to inputs
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in inputs.adresa) {
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

  const dodajKorisnika = async () => {
    try {
      const res = await axios.post(`${ApiConfig.baseUrl}/api/signup`, inputs);
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from submitting normally
    const result = await dodajKorisnika();
    if (result) {
      setNotification({
        type: 'success',
        message: 'Učenik uspješno dodan!',
      });
    } else {
      setNotification({
        type: 'error',
        message: 'Došlo je do greške! Pokušajte ponovno.',
      });
    }
  };

  useEffect(() => {
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

    fetchMentors();
    fetchSchools();
  }, []);

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
        {/*
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
          */}
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
            <label>Teorija:</label>
            <div className={`checkbox-item ${inputs.pohadjaTeoriju ? 'checked' : ''}`} onClick={() => setInputs((prev) => ({ ...prev, pohadjaTeoriju: !prev.pohadjaTeoriju }))}>
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
          <button className="gumb action-btn zatvoriBtn" onClick={onCancel}>
            Zatvori
          </button>
          <button className="gumb action-btn spremiBtn" type="submit">
            Dodaj učenika
          </button>
        </div>
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
          />
        )}
      </form>
    </div>
  );
};

export default DodajKorisnika;
