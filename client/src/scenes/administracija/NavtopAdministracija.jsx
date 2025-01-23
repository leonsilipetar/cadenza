import { useState, useEffect } from "react";
import '../../App.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../../store";
import ApiConfig from "../../components/apiConfig.js";
const NavTopAdministracija = ({user, naslov}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
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

    const handleLogout = () => {
      dispatch(authActions.logout());
      localStorage.removeItem('notificationPermissionRequested');
      navigate('/login');
    };


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
    return (
        <>
        <div className="nav-top">
            <div className="admin-gumb">
              <Link className='link' to="/user"><p>Aplikacija</p></Link>
            </div>
            <div>
                <button className="gumb-novo gumb-nav " onClick={toggleTheme}><i id='tema' className="uil uil-swatchbook">{theme === 'dark' ? 'Svijetla tema' : 'Tamna tema'}</i></button>
            </div>

            <div>
                <Link className='link' to="/login" onClick={handleLogout}><p>Odjava</p></Link>
            </div>
        </div>
        </>
    );
}
export default NavTopAdministracija;