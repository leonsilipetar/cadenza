import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../store';
import '../App.css';
import ApiConfig from '../components/apiConfig.js';

function Login() {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [errorM, seterrorM] = useState('');

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


  return (
    <div className="login-signup">
      <div className="header-forma-login-signup">
        <div className="welcome-poruka">
          <h1>Music Art Incubator</h1>
        </div>
      </div>
      <div className="main-login-signup">
        <div className="pokazatelj">
          <p className="p">Prijava</p>
        </div>
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
            />

            <input
              className={`input-login-signup ${passwordFocused ? 'focused' : ''}`}
              value={inputs.password}
              onChange={handleChange}
              type="password"
              name="password"
              id="kor-lozinka"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder="lozinka"
            />

            {errorM && <section className="errorM">{errorM}</section>}

            <button id="gumb-login-signup" className="gumb" type="submit">
              Prijavi se
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
