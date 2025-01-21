import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/index';
import { Icon } from '@iconify/react';
import ApiConfig from '../components/apiConfig.js';
import Navigacija from './navigacija';
import NavTop from './nav-top';
import UserInfoComponent from '../components/UserInfo';
import { clearPWAUser, isPWA } from '../utils/pwaUtils';

axios.defaults.withCredentials = true;

const Profil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [schools, setSchools] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const otvoreno = 'profil';
  const dispatch = useDispatch();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Fetch user profile
  const sendRequest = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/profil`, { withCredentials: true });
      return res.data.user;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return null;
    }
  };

  // Fetch schools
  const fetchSchools = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/schools`, { withCredentials: true });
      setSchools(res.data); // Assuming response is an array of schools
    } catch (err) {
      console.error('Error fetching schools:', err);
    }
  };

  // Fetch mentors
  const fetchMentors = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/mentori`, { withCredentials: true });
      setMentors(res.data); // Assuming response is an array of mentors
    } catch (err) {
      console.error('Error fetching mentors:', err);
    }
  };
  const sendLogoutRequest = async () => {
    try {
      const res = await axios.post(`${ApiConfig.baseUrl}/api/logout`, null, { withCredentials: true });
      if (res.status === 200) {
        return res; // Successful logout
      }
      throw new Error('Unable to logout. Try again');
    } catch (err) {
      console.error('Error during logout:', err.message || err);
      throw err; // Re-throw to allow further handling
    }
  };
  
  const handleLogout = async () => {
    try {
      await sendLogoutRequest();
      dispatch(authActions.logout());
      if (isPWA()) {
        clearPWAUser();
      }
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.message);
      alert('Logout failed. Please try again.');
    }
  };
  

  // Toggle theme state
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Save theme to local storage and apply to body
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme;
  }, [theme]);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const userData = await sendRequest();
      setUser(userData);
      await fetchSchools(); // Fetch schools after user data is loaded
      await fetchMentors(); // Fetch mentors after user data is loaded
    };

    fetchData();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${ApiConfig.baseUrl}/api/login`, { email, password });
      if (response.status === 200) {
        const { token } = response.data; // Get the token from the response
        console.log('Token received:', token); // Log the token
        localStorage.setItem('auth_token', token); // Store the token in localStorage
        dispatch(authActions.login(token)); // Dispatch the login action with the token
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Funkcija za dobijanje naziva škole
  const getSchoolName = (schoolId) => {
    if (!schoolId || !schools.length) return 'Unknown School'; // Osiguraj da su škole učitane
    const school = schools.find((school) => school._id === schoolId);
    return school ? school.name : 'Unknown School';
  };

  // Funkcija za dobijanje imena mentora
  const getMentorName = (mentorId) => {
    if (!mentorId || !mentors.length) return 'Unknown Mentor'; // Osiguraj da su mentori učitani
    const mentor = mentors.find((mentor) => mentor._id === mentorId);
    return mentor ? mentor.korisnickoIme : 'Unknown Mentor';
  };

  return (
    <>
      <Navigacija user={user} otvoreno={otvoreno} />
      <NavTop user={user} naslov={'Profil'} />
      <div className="main">
        <div className="karticaZadatka sbtwn">
          {/* Toggle button za temu */}
          <div className={`btn ${isHovered ? 'hovered' : ''}`}>
            <button className="gumb-novo gumb-nav" onClick={toggleTheme}>
              <i id="tema" className="uil uil-swatchbook">
                {theme === 'dark' ? 'Svijetla tema' : 'Tamna tema'}
              </i>
            </button>
          </div>

          {/* Logout dugme */}
          <div className={`action-btn btn abDelete ${isHovered ? 'hovered' : ''}`}>
            <Link className="link" to="/login" onClick={handleLogout}>
              <Icon icon="solar:logout-2-broken" /> Odjavi se
            </Link>
          </div>
        </div>

        {/* Prikaz korisničkih informacija */}
        <div className="karticaZadatka">
          <div className="profilDiv">
            {user && schools.length > 0 && mentors.length > 0 && user.isStudent && (
              <UserInfoComponent
                user={user}
                schoolName={getSchoolName(user.school)} // Koristi `user.school` umesto `user.schoolId`
                mentorName={getMentorName(user.mentors[0])} // Koristi prvi ID mentora
              />
            )}
            {user && schools.length > 0 && mentors.length > 0 && user.isMentor &&(
              <UserInfoComponent
                user={user}
                schoolName={getSchoolName(user.school)} // Koristi `user.school` umesto `user.schoolId`
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profil;
