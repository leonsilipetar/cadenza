import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/index';
import { Icon } from '@iconify/react';
import ApiConfig from '../components/apiConfig.js';
import Navigacija from './navigacija';
import NavTop from './nav-top';
import UserInfoComponent from '../components/UserInfo';

axios.defaults.withCredentials = true;

const Profil = () => {
  const [user, setUser] = useState();
  const [isHovered, setIsHovered] = useState(false);
  const otvoreno = 'profil';
  const dispatch = useDispatch();

  const sendRequest = async () => {
    const res = await axios.get(`${ApiConfig.baseUrl}/api/profil`, {
      withCredentials: true,
    }).catch((err) => console.log(err));
    const data = await res.data;
    return data;
  };

  const refreshToken = async () => {
    const res = await axios.get(`${ApiConfig.baseUrl}/api/refresh`, {
      withCredentials: true,
    }).catch((err) => console.log(err));

    const data = await res.data;
    return data;
  };

  const sendLogoutRequest = async () => {
    axios.defaults.withCredentials = true;
    const res = await axios.post(`${ApiConfig.baseUrl}/api/logout`, null, {
      withCredentials: true,
    });
    if (res.status === 200) {
      return res;
    }
    throw new Error('Unable to logout. Try again');
  };

  const handleLogout = async () => {
    try {
      await sendLogoutRequest();
  
      dispatch(authActions.logout());
      // Clear other user-related data or perform additional logout tasks
      localStorage.removeItem('isLoggedIn');
    } catch (error) {
      console.error('Logout failed:', error.message);
      // Handle the error as needed (show a message to the user, etc.)
    }
  };

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    sendRequest().then((data) => {
      setUser(data.user);
    });
  }, []);

  return (
    <>
      <Navigacija user={user} otvoreno={otvoreno} />
      <NavTop user={user} naslov={'Profil'} />
      <div className="main">
        <div className="karticaZadatka sbtwn">
          <div className={` btn ${isHovered ? 'hovered' : ''}`}>
            <button className="gumb-novo gumb-nav" onClick={toggleTheme}>
              <i id='tema' className="uil uil-swatchbook">
                {theme === 'dark' ? 'Svijetla tema' : 'Tamna tema'}
              </i>
            </button>
          </div>

          <div className={`action-btn btn abDelete ${isHovered ? 'hovered' : ''}`}>
            <Link className='link' to="/login" onClick={handleLogout}>
              <Icon icon="solar:logout-2-broken" /> Odjavi se
            </Link>
          </div>
        </div>
        <div className="karticaZadatka">
          <div className="profilDiv">
            {user && <UserInfoComponent user={user} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profil;
