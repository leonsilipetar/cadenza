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

  const [rememberMe, setRememberMe] = useState(false);



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

        password: inputs.password

      });



      console.log('Login response:', res.data); // Debug log



      if (res.data?.token) {

        // Store token

        localStorage.setItem('token', res.data.token);



        // Store user data

        if (res.data.user) {

          localStorage.setItem('user', JSON.stringify(res.data.user));

        }



        // Set axios default header

        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;



        dispatch(authActions.login());

        navigate('/user');

      } else {

        console.error('No token in response:', res.data);

        setErrorM('Login failed - no token received');

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

            <div className="error"><p>neki tekst</p></div>

            <input

              type="email"

              id="email"

              name="email"

              value={inputs.email}

              onChange={handleChange}

              placeholder="E-mail"

              autoComplete="email"

              required

            />

            <input

              type="password"

              id="password"

              name="password"

              value={inputs.password}

              onChange={handleChange}

              placeholder="Lozinka"

              autoComplete="current-password"

              required

            />

            <button

              className="show-password-toggle"

              onClick={togglePasswordVisibility}

              type="button"

            >

              {showPassword ? 'Sakrij' : 'Prikaži'} lozinku

            </button>

            <div className="form-group">

              <label>

                <input

                  type="checkbox"

                  checked={rememberMe}

                  onChange={(e) => setRememberMe(e.target.checked)}

                />

                Zapamti me

              </label>

            </div>

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






