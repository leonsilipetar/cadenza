import { useState, useEffect } from "react";
import '../../App.css';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../../store";
const NavTop = ({user, naslov}) => {

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
    return (
        <>  
        <div className="nav-top">
          {user && user.isAdmin && (
            <div className="admin-gumb">
              <Link className='link' to="/admin"><p>Administracija</p></Link>
            </div>
          )}
            <h1>
              {naslov}
            </h1>
        </div>
        </>
    );
}
export default NavTop;