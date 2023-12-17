import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import NavigacijaAdmin from './NavigacijaAdmin';
import NavTopAdministracija from './NavtopAdministracija';


axios.defaults.withCredentials = true;
const RacuniAdmin = () => {

  const [user, setUser] = useState();
  const otvoreno = "racuni";


  const sendRequest = async () => {
      const res = await axios.get('http://localhost:5000/api/user', {
          withCredentials: true
      }).catch((err) => console.log(err));
      const data = await res.data;
      return data;
  }

  const refreshToken = async () => {
      const res = await axios
        .get("http://localhost:5000/api/refresh", {
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
      <NavigacijaAdmin user={user} otvoreno={otvoreno}/>
      <NavTopAdministracija user={user} naslov={"Administracija - Računi"}/>
      <div className="main">

  <div className="karticaZadatka">
    <div className="ikona_ime_kartica">
      <i className="uil uil-polygon" id="uil">
        Računi
      </i>
      <p></p>
    </div>
  </div>
</div>
      </>
    )
}

export default RacuniAdmin;