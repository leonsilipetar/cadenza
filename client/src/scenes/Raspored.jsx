import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import Navigacija from "./navigacija";
import NavTop from './nav-top';
import ApiConfig from '../components/apiConfig.js';


axios.defaults.withCredentials = true;
const Raspored = () => {

  const [user, setUser] = useState();
  const otvoreno = "raspored";

  const sendRequest = async () => {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/user`, {
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

    }, []);
    
    return (
      <>
      <Navigacija user={user} otvoreno={otvoreno}/>
      <NavTop user={user} naslov={"Raspored"}/>
      <div className="main">

      <div className="raspored">
        <div className='dan'>
            <div className="nazivDana">Ponedjeljak</div>
            <div className="termin">
              <div className="dvorana">učionica 1</div>
              <div className="vrijeme">08:00 - 09:00</div>
              <div className="rasporedMentor">Ime prezime</div>
            </div>
        </div>
        <div className='dan'>
        <div className="nazivDana">Utorak</div>
            <div className="termin">
              <div className="dvorana">učionica 4</div>
              <div className="vrijeme">08:00 - 09:00</div>
              <div className="rasporedMentor">Ime prezime</div>
            </div>
        </div>
        <div className='dan'>
        <div className="nazivDana">Srijeda</div>
            <div className="termin">
              <div className="dvorana">učionica 3</div>
              <div className="vrijeme">08:00 - 09:00</div>
              <div className="rasporedMentor">Ime prezime</div>
            </div>
        </div>
        <div className='dan'>
        <div className="nazivDana">Četvrtak</div>
            <div className="termin">
              <div className="dvorana">učionica 4</div>
              <div className="vrijeme">08:00 - 09:00</div>
              <div className="rasporedMentor">Ime prezime</div>
            </div>
        </div>
        <div className='dan'>
        <div className="nazivDana">Petak</div>
            <div className="termin">
              <div className="dvorana">učionica 5</div>
              <div className="vrijeme">08:00 - 09:00</div>
              <div className="rasporedMentor">Ime prezime</div>
            </div>
        </div>
        <div className='dan'>
        <div className="nazivDana">Subota</div>
            <div className="termin">
              <div className="dvorana">učionica 5</div>
              <div className="vrijeme">08:00 - 09:00</div>
              <div className="rasporedMentor">Ime prezime</div>
            </div>
        </div>
      </div>
</div>
      </>
    )
}

export default Raspored;