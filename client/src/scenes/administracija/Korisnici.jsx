import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import NavigacijaAdmin from './NavigacijaAdmin';
import NavTopAdministracija from './NavtopAdministracija';
import DodajKorisnika from './DodajKorisnika';
import KorisnikDetalji from './KorisnikDetalji';
import ApiConfig from '../../components/apiConfig';

axios.defaults.withCredentials = true;

const Korisnici = () => {
  const [odabranoDodajKorisnika, setOdabranoDodajKOrisnika] = useState(false);
  const [korisnikDetaljiOtvoreno, setKorisnikDetaljiOtvoreno] = useState(null);

  const [korisnici, setKorisnici] = useState([]);
  const [user, setUser] = useState();
  const [isHovered, setIsHovered] = useState(false);
  const otvoreno = 'korisnici';

  const sendRequestUsers = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/korisnici`, {
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
      const res = await axios.get(`${ApiConfig.baseUrl}/api/refresh`, {
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
      const res = await axios.get(`${ApiConfig.baseUrl}/api/profil`, {
        withCredentials: true,
      });
      const data = res.data;
      return data;
    } catch (err) {
      console.error(err);
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
      {korisnikDetaljiOtvoreno && (
        console.log('Korisnik detalji otvoren', korisnikDetaljiOtvoreno),
  <KorisnikDetalji korisnikId={korisnikDetaljiOtvoreno} onCancel={() => setKorisnikDetaljiOtvoreno(false)} />
)}
      {odabranoDodajKorisnika && (
        <DodajKorisnika
          onDodajKorisnika={handleDodajKorisnika}
          onCancel={handleCancelDodajKorisnika}
        />
      )}
      <div className="main">
        <div
          className="gumb action-btn abEdit "
          onClick={() => setOdabranoDodajKOrisnika(true)}
        >
          <Icon icon="solar:user-plus-broken" fontSize="large" /> Dodaj učenika
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
                    onClick={() => setKorisnikDetaljiOtvoreno(korisnik._id)}
                    data-text="više"
                  >
                      <Icon icon="solar:round-double-alt-arrow-down-broken" />
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
