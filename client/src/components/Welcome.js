import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
axios.defaults.withCredentials = true;
const Welcome = () => {

  return (
    <div className='login-signup'>
    <div className="header-forma-login-signup">
        <div className="welcome-poruka">
        <h1>Music Art Incubator</h1>
        <p>Aplikacija za suradnju učenika i mentora</p>
        <p><i>Na ovoj platformi možeš surađivati s mentorima i provjeriti raspored!</i></p>
        </div>
    </div>
    <div className="main-login-signup">
        <div className="pokazatelj">
            <p className='p'>Prijava</p>
        </div>
        <div className="glavna-forma">
            <p className='p'>
                <Link className='gumb-login-signup' to="/login">Prijavi se!</Link>
            </p>
        </div>
    </div>
    </div>
  );
};

export default Welcome;