import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import { useDispatch } from 'react-redux';

import { authActions } from '../store';

import '../App.css';

import ApiConfig from './apiConfig.js';



const Login = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [errorM, setErrorM] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [inputs, setInputs] = useState({

    email: '',

    password: '',

  });

  const [emailFocused, setEmailFocused] = useState(false);

  const [passwordFocused, setPasswordFocused] = useState(false);



  const handleChange = (e) => {

    setInputs((prev) => ({

      ...prev,

      [e.target.name]: e.target.value,

    }));

    setErrorM('');

  };



  const togglePasswordVisibility = () => {

    setShowPassword(!showPassword);

  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(`${ApiConfig.baseUrl}/api/login`, {

        email: inputs.email,

        password: inputs.password,

      }, {

        withCredentials: true,

        headers: {

          'Content-Type': 'application/json',

        }

      });



      if (res.data && res.data.token) {

        // Store in both localStorage and cookies

        localStorage.setItem('token', res.data.token);

        localStorage.setItem('tokenExpiry', res.data.tokenExpiry);

        localStorage.setItem('user', JSON.stringify(res.data.user));

        

        dispatch(authActions.login());

        

        navigate('/user', { replace: true });

      }

    } catch (err) {

      console.error('Login error:', err);

      setErrorM('Netočni podaci!');

    }

  };



  return (

    <div className='login-signup'>

      <div className="header-forma-login-signup">

        <div className="welcome-poruka">

          <h1>Music Art Incubator</h1>

          <p className='p'>Platforma za suradnju učenika i mentora</p>

        </div>

      </div>

      <div className="main-login-signup">

        <div className="pokazatelj">

          <p className='p'>Dobrodošli natrag</p>

        </div>

        <div className="glavna-forma">

          <form onSubmit={handleSubmit}>

            <div className="logo-container">

              <img src="/Logo12.png" alt="MAI Logo" className="welcome-logo" />

              <p className="app-name">Cadenza</p>

            </div>

            <h2>Prijavi se</h2>

            {errorM && <div className="errorM">{errorM}</div>}

            <input

              className={`input-login-signup ${emailFocused ? 'focused' : ''}`}

              value={inputs.email}

              onChange={handleChange}

              type="email"

              name="email"

              placeholder="e-mail adresa"

              autoComplete='email'

              onFocus={() => setEmailFocused(true)}

              onBlur={() => setEmailFocused(false)}

              required

            />

            <input

              className={`input-login-signup ${passwordFocused ? 'focused' : ''}`}

              value={inputs.password}

              onChange={handleChange}

              type={showPassword ? 'text' : 'password'}

              name="password"

              placeholder="lozinka"

              autoComplete='current-password'

              onFocus={() => setPasswordFocused(true)}

              onBlur={() => setPasswordFocused(false)}

              required

            />

            <button

              className="show-password-toggle"

              onClick={togglePasswordVisibility}

              type="button"

            >

              {showPassword ? 'Sakrij' : 'Prikaži'} lozinku

            </button>

            <button className="gumb gumb-login-signup" type="submit">

              Prijavi se

            </button>

          </form>

          <div className='div linkMAI'>

            <a 

              className='acc' 

              href="https://www.musicartincubator.com" 

              target="_blank" 

              rel="noopener noreferrer"

            >

              Music Art Incubator

            </a>

          </div>

        </div>

      </div>

    </div>

  );

};



export default Login; 






