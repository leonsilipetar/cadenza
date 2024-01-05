import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import Navigacija from "./navigacija";
import NavTop from './nav-top';
import ApiConfig from '../components/apiConfig.js';
import RasporedDan from './raspored/RasporedDan.jsx';
import { Icon } from '@iconify/react';
import DodajTermin from './raspored/DodajTermin.jsx';


axios.defaults.withCredentials = true;
const Raspored = () => {

  const [user, setUser] = useState();
  const [teroija, setTeroija] = useState();
  const [raspored, setRaspored] = useState();
  const [dodajRasporedTeorija, setDodajRasporedTeorija] = useState(false)
  const otvoreno = "raspored";

  const sendRequest = async () => {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/user`, {
          withCredentials: true
      }).catch((err) => console.log(err));
      const data = await res.data;
      return data;
  }
  const sendRequestTeorija = async () => {
    const res = await axios.get(`${ApiConfig.baseUrl}/api/rasporedTeorija`, {
        withCredentials: true
    }).catch((err) => console.log(err));
    const data = await res.data;
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
    
    


    useEffect(() => {

        sendRequest().then((data) => {
          setUser(data.user)
        });

        sendRequestTeorija().then((data) => {
          setTeroija(data.teorija)
        });

    }, []);
    
    return (
      <>
      <Navigacija user={user} otvoreno={otvoreno}/>
      <NavTop user={user} naslov={"Raspored"}/>
      {dodajRasporedTeorija && (
        <DodajTermin
        dodajRasporedTeorija={dodajRasporedTeorija}
        onCancel={() => setDodajRasporedTeorija(false)} // Close the popup when onCancel is triggered
      />
      )}
      <div className="main">

      {user && user.isAdmin && (
        <div className="sbtwn">
          <div
              className="gumb action-btn abEdit "
            onClick={() => setDodajRasporedTeorija(true)}
            >
              <Icon icon="solar:add-circle-broken" fontSize="large"/>Raspored Teorija 
          </div>
        </div>
      )}

      <div className="raspored">
        {teroija ? <RasporedDan /> : <div><p>Nema dostupnog rasporeda</p></div>}
      </div>
</div>
      </>
    )
}

export default Raspored;