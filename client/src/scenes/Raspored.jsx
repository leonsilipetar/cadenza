import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigacija from './navigacija';
import NavTop from './nav-top';
import ApiConfig from '../components/apiConfig.js';
import RasporedDan from './raspored/RasporedDan.jsx';
import DodajTermin from './raspored/DodajTermin.jsx';
import { Icon } from '@iconify/react';
import NavSideRaspored from './mentori/NavSideRaspored.jsx';

axios.defaults.withCredentials = true;

const Raspored = () => {
  const [user, setUser] = useState();
  const [teorija, setTeorija] = useState();
  const [dodajRasporedTeorija, setDodajRasporedTeorija] = useState(false);
  const otvoreno = 'raspored';
  const [rasporedGumb, setRasporedGumb] = useState(false);

  const sendRequest = async () => {
    const res = await axios.get(`${ApiConfig.baseUrl}/api/user`, {
      withCredentials: true,
    }).catch((err) => console.log(err));
    const data = await res.data;
    return data;
  };

  const sendRequestTeorija = async () => {
    const res = await axios.get(`${ApiConfig.baseUrl}/api/rasporedTeorija`, {
      withCredentials: true
    }).catch((err) => console.log(err));
    const data = await res.data;
    console.log('Teorija Data:', data);
    return data;
  }

  const refreshToken = async () => {
    const res = await axios
      .get(`${ApiConfig.baseUrl}/api/refresh`, {
        withCredentials: true,
      })
      .catch((err) => console.log(err));

    const data = await res.data;
    return data;
  };
  const handleItemClickRasporedGumb = () => {
    setRasporedGumb((prevValue) => !prevValue);
  };

  useEffect(() => {
    sendRequest().then((data) => {
      setUser(data.user);
    });

    sendRequestTeorija().then((data) => {
      setTeorija(data.teorija);
    });
  }, []);

  return (
    <>
      <Navigacija user={user} otvoreno={otvoreno} />
      <NavTop user={user} naslov={'Raspored'} />
      {dodajRasporedTeorija && (
        <DodajTermin
          dodajRasporedTeorija={dodajRasporedTeorija}
          onCancel={() => setDodajRasporedTeorija(false)}
        />
      )}
      <div className="main">
      <div className="rl-gumb" onClick={handleItemClickRasporedGumb} >
            {rasporedGumb ? (<Icon className="icon" icon="solar:list-up-minimalistic-broken" />) : 
            (<Icon className="icon" icon="solar:list-down-minimalistic-broken" />)}
      </div>
        {rasporedGumb && <NavSideRaspored />}
        {user && user.isAdmin && (
          <div className="sbtwn">
            <div
              className="gumb action-btn abEdit "
              onClick={() => setDodajRasporedTeorija(true)}
            >
              <Icon icon="solar:add-circle-broken" fontSize="large" />Raspored Teorija
            </div>
          </div>
        )}

<div className="raspored">
  {teorija ? (
    ['pon', 'uto', 'sri', 'cet', 'pet', 'sub'].map((day) => (
      <RasporedDan key={day} teorija={teorija[0]?.[day]} teorijaID={teorija[0]?._id} day={day} user={user} setTeorija={setTeorija} />

    ))
  ) : (
    <div>
      <p>Nema dostupnog rasporeda</p>
    </div>
  )}
</div>
      </div>
    </>
  );
};

export default Raspored;

