import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig';

axios.defaults.withCredentials = true;

const DodajKorisnika = ({ onDodajKorisnika, onCancel }) => {
  const [mentors, setMentors] = useState([]);
    const [odabranoDodajKorisnika, setOdabranoDodajKOrisnika] = useState(false);
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
        pohadjaTeoriju: false,
        napomene: [],
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
      });
      
    
      const handleChange = (e) => {
        setInputs((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
      };
      const formatDateString = (isoDateString) => {
        const date = new Date(isoDateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
      
        return `${day}/${month}/${year}`;
      };
    
      const dodajKorisnika = async () => {
        try {
          const res = await axios.post(`${ApiConfig.baseUrl}/api/signup`, inputs);
          const data = res.data;
          return data;
        } catch (err) {
          console.error(err);
          return null;
        }
      };
    
      const handleSubmit = async (e) => {
       
          // Proceed with regular user registration
          const result = await dodajKorisnika();
    
          if (result) {
            console.log('User registered successfully:', result);
          } else {
            console.log('User registration failed.');
          }
      };
      useEffect(() => {
        const fetchMentors = async () => {
          try {
            const res = await axios.get(`${ApiConfig.baseUrl}/api/mentori`); // replace with your mentor endpoint
            const data = res.data;
            setMentors(data);
          } catch (err) {
            console.error(err);
          }
        };
    
        fetchMentors();
      }, []);

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
<label htmlFor="kor-mentor">Mentor:</label>
        <input
          className="input-login-signup"
          value={inputs.mentor}
          onChange={handleChange}
          type="text"
          name="mentor"
          id="kor-mrntor"
          placeholder="mentor"
        />
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

<div className="checkbox-group">
<label>Teorija:</label>
<div className={`checkbox-item ${inputs.pohadjaTeoriju ? 'checked' : ''}`} onClick={() => setInputs({ ...inputs, pohadjaTeoriju: !inputs.pohadjaTeoriju })}>
<input
  type="checkbox"
  id="pohadjaTeoriju"
  checked={inputs.pohadjaTeoriju}
  onChange={() => setInputs({ ...inputs, pohadjaTeoriju: !inputs.pohadjaTeoriju })}
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
        <button className="gumb action-btn spremiBtn" type="submit" onClick={handleSubmit}>
          Dodaj učenika
  </button>
        
        </div>
      </form>
    </div>
    )

};

export default DodajKorisnika;