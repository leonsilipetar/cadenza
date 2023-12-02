import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import Navigacija from "./navigacija";
import NavTop from './nav-top';
import UserInfoComponent from '../components/UserInfo';
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { authActions } from "../store/index";


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
  
   const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'light'
      );
      const toggleTheme = () => {
        if (theme === 'light') {
          setTheme('dark');
        } else {
          setTheme('light');
        }
      };
      useEffect(() => {
        localStorage.setItem('theme', theme);
        document.body.className = theme;
      }, [theme]);
    
    


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
      <NavTop user={user} naslov={"Postavke i profil"}/>
      <div className="main">
        <div className="karticaZadatka inline">
                      <button className="gumb-novo gumb-nav " onClick={toggleTheme}><i id='tema' className="uil uil-swatchbook">{theme === 'dark' ? 'Svijetla tema' : 'Tamna tema'}</i></button>
          <div>
              <Link className='link' to="/login" onClick={handleLogout}><p>Odjava</p></Link>
          </div>
        </div>
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