import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../store';
import '../App.css';
import ApiConfig from '../components/apiConfig.js';

function Login() {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [errorM, seterrorM] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleErrorM() {
    seterrorM('Netočni podaci!');
  }

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
    seterrorM('');
  };

  const sendRequest = async () => {
    try {
      const res = await axios.post(`${ApiConfig.baseUrl}/api/login`, {
        email: inputs.email,
        password: inputs.password,
      });

      if (res.data) {
        return res.data;
      } else {
        handleErrorM();
        return null;
      }
    } catch (err) {
      console.error(err);
      handleErrorM();
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await sendRequest();

    if (data) {
      dispatch(authActions.login());
      history('/user');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-signup">
      <div className="header-forma-login-signup">
        <div className="welcome-poruka">
          <h1>Music Art Incubator</h1>
          <h3>CADENZA</h3>
        </div>
      </div>
      <div className="main-login-signup">
        <div className="pokazatelj">
          <p className="p">Prijava</p>
        </div>
        {errorM ? (
          <div className="glavna-forma">
          <form onSubmit={handleSubmit}>
            <input
              className={`input-login-signup errorM ${emailFocused ? 'focused' : ''}`}
              value={inputs.email}
              onChange={handleChange}
              type="email"
              name="email"
              id="kor-email"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="e-mail adresa"
              autoComplete='email'
            />
            <input
              className={`input-login-signup errorM ${passwordFocused ? 'focused' : ''}`}
              value={inputs.password}
              onChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="kor-lozinka"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder="lozinka"
              autoComplete='current-password'
            />

            <button
              className="show-password-toggle"
              onClick={togglePasswordVisibility}
              type="button"
            >
              {showPassword ? ' Sakrij' : ' Prikaži'} lozinku
            </button>
            <button className="gumb gumb-login-signup" type="submit">
              Prijavi se
            </button>
          </form>
          <div className='div linkMAI'>
          <a className='acc' href="https://www.musicartincubator.com" target="_blank" rel="noopener noreferrer">Music Art Incubator</a>
          </div>
        </div>
        ) : (
          <div className="glavna-forma">
          <form onSubmit={handleSubmit}>
            <input
              className={`input-login-signup ${emailFocused ? 'focused' : ''}`}
              value={inputs.email}
              onChange={handleChange}
              type="email"
              name="email"
              id="kor-email"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="e-mail adresa"
              autoComplete='email'
            />
            <input
              className={`input-login-signup ${passwordFocused ? 'focused' : ''}`}
              value={inputs.password}
              onChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="kor-lozinka"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder="lozinka"
              autoComplete='current-password'
            />

            <button
              className="show-password-toggle"
              onClick={togglePasswordVisibility}
              type="button"
            >
              {showPassword ? ' Sakrij' : ' Prikaži'} lozinku
            </button>

            <button className="gumb gumb-login-signup" type="submit">
              Prijavi se
            </button>
          </form>
          <div className='div linkMAI'>
          <a className='acc' href="https://www.musicartincubator.com" target="_blank" rel="noopener noreferrer">Music Art Incubator</a>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default Login;
