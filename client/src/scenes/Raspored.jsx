import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import Navigacija from "./navigacija";
import NavTop from './nav-top';


axios.defaults.withCredentials = true;
const Raspored = () => {

  const [user, setUser] = useState();
  const otvoreno = "raspored";

  const dispatch = useDispatch();
  const sendLogoutRequest = async () => {
    axios.defaults.withCredentials = true
  const res = await axios.post("http://localhost:5000/api/logout", null, {
    withCredentials: true
  })
  if(res.status === 200) {
    return res;
  }
  return new Error("Unable to logout. Try again");
 }
 const handleLogout = () => {
  sendLogoutRequest().then(()=>dispatch(authActions.logout()))
 }

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
      <NavTop user={user}/>
      <div className="main">

  <div className="karticaZadatka">
    <div className="ikona_ime_kartica">
      <i className="uil uil-polygon" id="uil">
        Raspored
      </i>
      <p></p>
    </div>
  </div>
</div>
      </>
    )
}

export default Raspored;