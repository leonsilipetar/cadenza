import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig';

axios.defaults.withCredentials = true;

const DodajMentora = ({ onDodajKorisnika, onCancel }) => {
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState('');
  const [isDodajMentoraDisabled, setIsDodajMentoraDisabled] = useState(false);
    const [odabranoDodajKorisnika, setOdabranoDodajKOrisnika] = useState(false);
    const [inputs, setInputs] = useState({
        korisnickoIme: '',
        email: '',
        ime: '',
        prezime: '',
        isAdmin: false,
        isMentor: false,
        isStudent: false,
        oib: '',
        program: '',
        students: [],
        brojMobitela: '',
        datumRodjenja: '',
        adresa: {
          ulica: '',
          kucniBroj: '',
          mjesto: '',
        },
        napomene: [],
      });
      
    
      const handleChange = (e) => {
        setInputs((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
      };
    
      const dodajMentora = async () => {
        try {
          const res = await axios.post(`${ApiConfig.baseUrl}/api/signup-mentori`, inputs);
          const data = res.data;
          return data;
        } catch (err) {
          console.error(err);
          return null;
        }
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsDodajMentoraDisabled(true);
          const result = await dodajMentora();
    
          if (result) {
            console.log('User registered successfully:', result);
            setStatus('Mentor je uspješno dodan!');
          } else {
            console.log('User registration failed.');
            setStatus('Došlo je do greške prilikom dodavanja mentora!');
            setTimeout(() => {
              setIsDodajMentoraDisabled(false);
              setStatus('Probajte ponovno!');
            }, 3000); 
          }
      };
      useEffect(() => {
        const fetchMentors = async () => {
          try {
            const res = await axios.get(`${ApiConfig.baseUrl}/api/korsnici`); // replace with your mentor endpoint
            const data = res.data;
            setStudents(data);
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
<label htmlFor="kor-mentor">Učenici:</label>
        <input
          className="input-login-signup"
          value={inputs.students}
          onChange={handleChange}
          type="text"
          name="ucenici"
          id="kor-mrntor"
          placeholder="učenici"
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
        className="gumb action-btn zatvoriBtn primary-btn" // Apply primary button styles
        onClick={() => onCancel()}
      >
        Zatvori
      </button>
      <button
        className={`gumb action-btn spremiBtn ${isDodajMentoraDisabled ? 'disabledSpremiBtn' : ''}`}
        type="submit"
        onClick={handleSubmit}
        disabled={isDodajMentoraDisabled} // Disable the button based on state
      >
        {isDodajMentoraDisabled ? 'Spremanje' : 'Dodaj mentora'}
      </button>
        </div>
        <div className={`div`}><p>{status}</p></div>
      </form>
    </div>
    )

};

export default DodajMentora;