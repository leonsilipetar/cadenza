import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import NavigacijaAdmin from './NavigacijaAdmin';
import NavTopAdministracija from './NavtopAdministracija';


axios.defaults.withCredentials = true;
const Admin = () => {

  const [user, setUser] = useState();
  const otvoreno = "naslovna";

  const sendRequest = async () => {
      const res = await axios.get('https://musicartincubator-cadenza.onrender.com/api/user', {
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
      <NavTopAdministracija user={user} naslov={"Administracija - naslovna"}/>
      <div className="main">

  <div className="karticaZadatka">
    <div className="ikona_ime_kartica">
      <i>
        Administracija aplikacije
      </i>
      <p className='p'>Administracija je trenutno dostupna samo u web formi za desktop (široke) zaslone</p>
    </div>
  </div>
</div>
      </>
    )
}

export default Admin;
