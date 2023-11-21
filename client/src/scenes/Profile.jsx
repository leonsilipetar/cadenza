import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import Navigacija from "./navigacija";
import NavTop from './nav-top';
import UserInfoComponent from '../components/UserInfo';


axios.defaults.withCredentials = true;
const Profil = () => {

  const [user, setUser] = useState();
  const otvoreno = "profil";

  
  const sendRequest = async () => {
      const res = await axios.get('http://localhost:5000/api/profil', {
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

      let interval = setInterval(() => {
        refreshToken().then((data) => {
          setUser(data.user)
        });
      }, 1000 * 28 * 60 * 60);

      return () => clearInterval(interval);

    }, []);
    
    return (
      <>
      <Navigacija user={user} otvoreno={otvoreno}/>
      <NavTop user={user} naslov={otvoreno}/>
      <div className="main">

          <div className="karticaZadatka">

            <div className="profilDiv">

            {user && <UserInfoComponent user={user}/>}

            </div>

          </div>
          
      </div>
      </>
    )
}

export default Profil;