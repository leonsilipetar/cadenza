import React from "react";

import { Link } from "react-router-dom";

import MusicNoteIcon from '@mui/icons-material/MusicNote';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';



const Welcome = () => {

  return (

    <div className='login-signup'>

      <div className="header-forma-login-signup">

        <div className="welcome-poruka">

          <div className="welcome-content">

            <h1>Music Art Incubator</h1>

            <div className="welcome-text">

              <p className="main-text">Platforma za suradnju učenika i mentora</p>

              <p className="sub-text">

                <i>Otkrijte svijet glazbe kroz personalizirano mentorstvo,

                fleksibilno planiranje i interaktivnu suradnju.</i>

              </p>

            </div>

            <div className="feature-list">

              <div className="feature-item">

                <span className="feature-icon">🎵</span>

                <span>Personalizirano mentorstvo</span>

              </div>

              <div className="feature-item">

                <span className="feature-icon">📅</span>

                <span>Fleksibilno planiranje</span>

              </div>

              <div className="feature-item">

                <span className="feature-icon">💫</span>

                <span>Interaktivna suradnja</span>

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="main-login-signup">

        <div className="pokazatelj">

          <p className='p'>Dobrodošli</p>

        </div>

        <div className="glavna-forma">

          <div className="login-content">

            <div className="logo-container">

              <img

                src="/Logo512.png"

                alt="MAI Logo"

                className="welcome-logo"

              />

              <p className="app-name">Cadenza</p>

            </div>

            <h2>Započnite svoje glazbeno putovanje</h2>

            <p className='p'>

              <Link

                className='gumb-login-signup'

                to="/login"

                style={{

                  backgroundColor: 'rgb(var(--isticanje))',

                  color: 'rgb(var(--pozadina-svijetlo))',

                  display: 'inline-block',

                  padding: '0.8rem 2rem',

                  borderRadius: 'var(--radius)',

                  textAlign: 'center'

                }}

              >

                Prijavi se

              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>

  );

};



export default Welcome;






























































































































































































































































































































































































































































































































