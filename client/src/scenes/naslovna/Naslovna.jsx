import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import Navigacija from "../navigacija";
import NavTop from '../nav-top';
import ApiConfig from '../../components/apiConfig.js';


axios.defaults.withCredentials = true;
const Naslovna = () => {

  const [user, setUser] = useState();
  const otvoreno = "naslovna";

  const sendRequest = async () => {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/user`, {
          withCredentials: true
      }).catch((err) => console.log(err));
      console.log(res.data);
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
      <NavTop user={user} naslov={"Naslovna"}/>
      <div className="main">

  <div className="karticaZadatka">
    <div className="ikona_ime_kartica">
      <i className="uil uil-polygon" id="uil">
        Dobrodošli u aplikaciju!
      </i>
      <p></p>
    </div>
  </div>
</div>
      </>
    )
}

export default Naslovna;