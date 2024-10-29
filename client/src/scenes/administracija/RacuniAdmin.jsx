import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import NavigacijaAdmin from './NavigacijaAdmin';
import NavTopAdministracija from './NavtopAdministracija';
import DodajRacun from './DodajRacun';
import ApiConfig from '../../components/apiConfig';

axios.defaults.withCredentials = true;

const RacuniAdmin = () => {
  const [odabranoDodajRacun, setOdabranoDodajRacun] = useState(false);
  const [racuni, setRacuni] = useState([]);
  const otvoreno = 'racuni';

  const sendRequestRacuni = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/racuni`, {
        withCredentials: true,
      });
      const data = res.data;
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    sendRequestRacuni().then((data) => {
      setRacuni(data);
    });
  }, []);

  return (
    <>
      <NavigacijaAdmin otvoreno={otvoreno} />
      <NavTopAdministracija naslov={'Administracija - Računi'} />
      {odabranoDodajRacun && (
        <DodajRacun
          onDodajRacun={() => {
            sendRequestRacuni().then((data) => setRacuni(data));
            setOdabranoDodajRacun(false);
          }}
          onCancel={() => setOdabranoDodajRacun(false)}
        />
      )}
      <div className="main">
        <div className="sbtwn">
          <div
            className="gumb action-btn abEdit"
            onClick={() => setOdabranoDodajRacun(true)}
          >
            <Icon icon="solar:file-plus-broken" fontSize="large" /> Dodaj račun
          </div>
        </div>
        <div className="tablica">
          <div className="tr naziv">
            <div className="th">Broj računa</div>
            <div className="th">Datum</div>
            <div className="th mobile-none">Iznos</div>
          </div>
          {Array.isArray(racuni) && racuni.length > 0 ? (
            racuni.map((racun) => (
              <div className="tr redak" key={racun._id}>
                <div className="th">{racun.brojRacuna}</div>
                <div className="th">{racun.datum}</div>
                <div className="th mobile-none">{racun.iznos} EUR</div>
              </div>
            ))
          ) : (
            <div className="karticaZadatka">
              <p>Nema računa u bazi!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RacuniAdmin;
