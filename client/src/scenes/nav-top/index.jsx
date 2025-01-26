import { useState, useEffect } from "react";
import '../../App.css';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../../store";
import ApiConfig from "../../components/apiConfig.js";
const NavTop = ({user, naslov, chat}) => {


 const [theme, setTheme] = useState(
      localStorage.getItem('theme') || 'light'
    );
    useEffect(() => {
      localStorage.setItem('theme', theme);
      document.body.className = theme;
    }, [theme]);
    return (
        <>  
        <div className="nav-top">
          {user && user.isAdmin && !chat && (
            <div className="admin-gumb">
              <Link className='link' to="/admin">
              <p>Admin</p>
              </Link>
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