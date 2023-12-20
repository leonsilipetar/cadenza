import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import NavigacijaAdmin from './NavigacijaAdmin';
import NavTopAdministracija from './NavtopAdministracija';
import DodajKorisnika from './DodajKorisnika';

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

const handleDodajKorisnika = () => {
    // Logic for handling the addition of a new user
    // e.g., refetch the user list or perform other actions
    console.log('Adding user logic here');
  };

  const handleCancelDodajKorisnika = () => {
    setOdabranoDodajKOrisnika(false);
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
      {odabranoDodajKorisnika &&
        <DodajKorisnika
          onDodajKorisnika={handleDodajKorisnika}
          onCancel={handleCancelDodajKorisnika}
        />}
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
