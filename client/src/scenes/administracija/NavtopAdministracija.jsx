import { useState, useEffect } from "react";
import '../../App.css';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../../store";
import ApiConfig from "../../components/apiConfig.js";
const NavTopAdministracija = ({user, naslov}) => {

    const dispatch = useDispatch();
  const sendLogoutRequest = async () => {
    axios.defaults.withCredentials = true
  const res = await axios.post(`${ApiConfig.baseUrl}/api/logout`, null, {
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