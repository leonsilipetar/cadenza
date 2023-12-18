import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import NavigacijaAdmin from './NavigacijaAdmin';
import NavTopAdministracija from './NavtopAdministracija';

axios.defaults.withCredentials = true;

const Korisnici = () => {
  const [odabranoDodajKorisnika, setOdabranoDodajKOrisnika] = useState(false);
  const [korisnici, setKorisnici] = useState([]);
  const [user, setUser] = useState();
  const [isHovered, setIsHovered] = useState(false);
  const otvoreno = 'korisnici';

  const sendRequestUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/korisnici', {
        withCredentials: true,
      });
      const data = res.data;
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const refreshToken = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/refresh', {
        withCredentials: true,
      });
      const data = res.data;
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const sendRequest = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/profil', {
        withCredentials: true,
      });
      const data = res.data;
      return data;
    } catch (err) {
      console.error(err);
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
      brojMobitela: '',
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

  const getUserRoles = (user) => {
    const roles = [];

    if (user.isAdmin) {
      roles.push('administrator');
    }

    if (user.isMentor) {
      roles.push('mentor');
    }

    if (user.isStudent) {
      roles.push('student');
    }

    return roles.length > 0 ? roles.join(', ') : 'bez uloge';
  };

  useEffect(() => {
    sendRequestUsers().then((data) => {
      setKorisnici(data);
    });
    sendRequest().then((data) => {
      setUser(data.user);
    });
  }, []);

  return (
    <>
      <NavigacijaAdmin otvoreno={otvoreno} />
      <NavTopAdministracija naslov={'Administracija - Korisnici'} />
      {odabranoDodajKorisnika && (
        <div className="popup">
        <form onSubmit={handleSubmit}>
          <div className="div">
          <input
            className="input-login-signup"
            value={inputs.korisnickoIme}
            onChange={handleChange}
            type="text"
            name="korisnickoIme"
            id="kor-Korime"
            placeholder="korisničko ime"
          />
      
          <input
            className="input-login-signup"
            value={inputs.email}
            onChange={handleChange}
            type="email"
            name="email"
            id="kor-email"
            placeholder="e-mail adresa"
          />
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
            <div>
          <input
            className="input-login-signup"
            value={inputs.ime}
            onChange={handleChange}
            type="text"
            name="ime"
            id="kor-ime"
            placeholder="ime"
          />
      
          <input
            className="input-login-signup"
            value={inputs.prezime}
            onChange={handleChange}
            type="text"
            name="prezime"
            id="kor-prezime"
            placeholder="prezime"
          />
          </div>
          <div>
          
          <input
          className="input-login-signup"
          value={inputs.datumRodjenja}
          onChange={(e) => setInputs({ ...inputs, datumRodjenja: e.target.value })}
          type="date"
          name="datumRodjenja"
          id="kor-datum-rodjenja"
          placeholder="datum rođenja"
          />

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
      </div>

<div className="div">
          <input
            className="input-login-signup"
            value={inputs.program}
            onChange={handleChange}
            type="text"
            name="program"
            id="kor-program"
            placeholder="program"
          />
  
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
          <label htmlFor="kor-ulica">Adresa:</label>
          <input
            className="input-login-signup"
            value={inputs.adresa.ulica}
            onChange={(e) => setInputs({ ...inputs, adresa: { ...inputs.adresa, ulica: e.target.value } })}
            type="text"
            name="ulica"
            id="kor-ulica"
            placeholder="ulica"
          />
      
          <input
            className="input-login-signup"
            value={inputs.adresa.kucniBroj}
            onChange={(e) => setInputs({ ...inputs, adresa: { ...inputs.adresa, kucniBroj: e.target.value } })}
            type="text"
            name="kucniBroj"
            id="kor-kucni-broj"
            placeholder="kućni broj"
          />
      
          <input
            className="input-login-signup"
            value={inputs.adresa.mjesto}
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
              onClick={() => setOdabranoDodajKOrisnika(false)}
            >
              Odustani
            </button>
          </div>
        </form>
      </div>
      
      )}
      <div className="main">
        <div
          className="gumb action-btn abEdit "
          onClick={() => setOdabranoDodajKOrisnika(true)}
        >
          <Icon icon="solar:user-plus-broken" fontSize="large" /> Dodaj korisnika
        </div>
        <div className="tablica">
          <div className="tr naziv">
            <div className="th">Korisničko ime</div>
            <div className="th">email</div>
            <div className="th">program</div>
            <div className="th">uloga u sustavu</div>
            <div className="th">oib</div>
            <div></div>
          </div>
          {korisnici?.length > 0 ? (
            korisnici.map((korisnik) => (
              <div
                className={`tr redak ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                key={korisnik._id} // Add a unique key for each item
              >
                <div className="th">{korisnik.korisnickoIme}</div>
                <div className="th">{korisnik.email}</div>
                <div className="th">{korisnik.program}</div>
                <div className="th">{getUserRoles(korisnik)}</div>
                <div className="th">{korisnik.oib}</div>
                <div className="th">
                  <div
                    className={`action-btn btn abExpand ${
                      isHovered ? 'hovered' : ''
                    }`}
                    data-text="više"
                  >
                    <Icon icon="solar:round-double-alt-arrow-down-broken" />
                  </div>
                  <div
                    className={`action-btn btn abEdit ${
                      isHovered ? 'hovered' : ''
                    }`}
                    data-text="uredi"
                  >
                    <Icon icon="solar:pen-2-broken" fontSize="large" />
                  </div>
                  <div
                    className={`action-btn btn abDelete ${
                      isHovered ? 'hovered' : ''
                    }`}
                    data-text="obriši"
                  >
                    <Icon icon="solar:trash-bin-trash-broken" fontSize="large" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="karticaZadatka">
              <p>Nema korisnika u bazi!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Korisnici;
