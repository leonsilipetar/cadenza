import React, { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const KorisnikDetalji = ({ korisnikId, onCancel }) => {

    const [korisnik, setKorisnik] = useState({});

    const getDetaljiKorisnika = async (korisnikId) => {
        try {
          // Assuming userId is the ID of the selected user
          const res = await axios.get(`http://localhost:5000/api/korisnik/${korisnikId}`, {
            withCredentials: true,
          });
      
          const detaljiKorisnika = res.data;
          return detaljiKorisnika;
        } catch (err) {
          console.error(err);
          throw err; // Propagate the error to the caller
        }
      };
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
        brojMobitela: '',
        mentor: '',
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
    
      const dodajKorisnika = async () => {
        try {
          const res = await axios.post('http://localhost:5000/api/signup', inputs);
          const data = res.data;
          return data;
        } catch (err) {
          console.error(err);
          return null;
        }
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dodajKorisnika();
    
        if (result) {
          console.log('User registered successfully:', result);
        } else {
          console.log('User registration failed.');
        }
      };

      useEffect(() => {
        getDetaljiKorisnika(korisnikId).then((data) => {
          setKorisnik(data);
        });
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
            defaultValue={korisnik.korisnickoIme}
            type="text"
            name="korisnickoIme"
            id="kor-Korime"
            placeholder="korisničko ime"
          />
          <label htmlFor="kor-email">Email:</label>
          <input
            className="input-login-signup"
            value={inputs.email}
            defaultValue={korisnik.email}
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
          defaultValue={korisnik.oib}
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
            defaultValue={korisnik.ime}
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
            defaultValue={korisnik.prezime}
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
          defaultValue={korisnik.datumRodjenja}
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
            defaultValue={korisnik.brojMobitela}
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
            defaultValue={korisnik.program}
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
            defaultValue={korisnik.mentor}
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
          />
      <label htmlFor="kor-kucni-broj">Kućni broj:</label>
          <input
            className="input-login-signup"
            onChange={(e) => setInputs({ ...inputs, adresa: { ...inputs.adresa, kucniBroj: e.target.value } })}
            type="text"
            name="kucniBroj"
            id="kor-kucni-broj"
            placeholder="kućni broj"
          />
      <label htmlFor="kor-mjesto">Mjesto:</label>
          <input
            className="input-login-signup"
            onChange={(e) => setInputs({ ...inputs, adresa: { ...inputs.adresa, mjesto: e.target.value } })}
            type="text"
            name="mjesto"
            id="kor-mjesto"
            placeholder="mjesto"
          />
          </div>


          <div className='div-radio'>
          <div className='div'>
            <div>
              <input
                className="input-login-signup"
                type="checkbox"
                id='isAdmin'
                checked={inputs.isAdmin}
                    defaultValue={korisnik.isAdmin}
                onChange={(e) => setInputs({ ...inputs, isAdmin: e.target.checked })}
              />
              <label htmlFor="isAdmin">Admin</label>
            </div>
      
            <div>
              <input
                className="input-login-signup"
                type="checkbox"
                id='isMentor'
                checked={inputs.isMentor}
                defaultValue={korisnik.isMentor}
                onChange={(e) => setInputs({ ...inputs, isMentor: e.target.checked })}
              />
              <label htmlFor="isMentor">Mentor</label>
            </div>
      
            <div>
              <input
                className="input-login-signup"
                type="checkbox"
                id='isStudent'
                checked={inputs.isStudent}
                defaultValue={korisnik.isStudent}
                onChange={(e) => setInputs({ ...inputs, isStudent: e.target.checked })}
              />
              <label htmlFor="isStudent">Student</label>
            </div>
            </div>
            <div className='div'>
              <div>
              <input
                className="input-login-signup"
                type="checkbox"
                id='pohadjaTeoriju'
                checked={inputs.pohadjaTeoriju}
                defaultValue={korisnik.pohadjaTeoriju}
                onChange={(e) => setInputs({ ...inputs, pohadjaTeoriju: e.target.checked })}
              />
              <label htmlFor="pohadjaTeoriju">Pohađa teoriju</label>
            </div>
            </div>
          </div>
          <div className="div">
          <label htmlFor="kor-napomene">Napomene:</label>
            <textarea
              className="input-login-signup"
              value={inputs.napomene}
              defaultValue={korisnik.napomene}
              onChange={(e) => setInputs({ ...inputs, napomene: e.target.value })}
              name="napomene"
              id="kor-napomene"
              placeholder="Unesite napomene o korisniku "
              maxLength={5000}
            />
            </div>
 
      
          <div className='div-radio'>
          <button className="gumb action-btn abEdit" type="submit">
            Dodaj
          </button>
          <button
            className="gumb action-btn abDelete"
            onClick={() => onCancel()}
          >
            Odustani
          </button>
          </div>
        </form>
      </div>
    )

};

export default KorisnikDetalji ;