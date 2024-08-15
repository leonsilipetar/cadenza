import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig';
import Notification from '../../components/Notifikacija';

axios.defaults.withCredentials = true;

const DodajRacun = ({ onDodajRacun, onCancel }) => {
  const [notification, setNotification] = useState(null);
  const [inputs, setInputs] = useState({
    brojRacuna: '',
    datum: '',
    iznos: '',
    opis: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const dodajRacun = async () => {
    try {
      const res = await axios.post(`${ApiConfig.baseUrl}/api/racuni`, inputs);
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dodajRacun();
    if (result) {
      setNotification({
        type: 'success',
        message: 'Račun uspješno dodan!',
      });
      onDodajRacun();
    } else {
      setNotification({
        type: 'error',
        message: 'Došlo je do greške! Pokušajte ponovno.',
      });
    }
  };

  return (
    <div className="popup">
      <form onSubmit={handleSubmit}>
        <div className="div">
          <label htmlFor="racun-broj">Broj računa:</label>
          <input
            className="input-login-signup"
            value={inputs.brojRacuna}
            onChange={handleChange}
            type="text"
            name="brojRacuna"
            id="racun-broj"
            placeholder="Broj računa"
          />
          <label htmlFor="racun-datum">Datum:</label>
          <input
            className="input-login-signup"
            value={inputs.datum}
            onChange={handleChange}
            type="date"
            name="datum"
            id="racun-datum"
            placeholder="Datum"
          />
          <label htmlFor="racun-iznos">Iznos:</label>
          <input
            className="input-login-signup"
            value={inputs.iznos}
            onChange={handleChange}
            type="text"
            name="iznos"
            id="racun-iznos"
            placeholder="Iznos"
          />
        </div>

        <div className="div">
          <label htmlFor="racun-opis">Opis:</label>
          <textarea
            className="input-login-signup"
            value={inputs.opis}
            onChange={handleChange}
            name="opis"
            id="racun-opis"
            placeholder="Unesite opis računa"
            maxLength={5000}
          />
        </div>

        <div className="div-radio">
          <button className="gumb action-btn zatvoriBtn" onClick={onCancel}>
            Zatvori
          </button>
          <button className="gumb action-btn spremiBtn" type="submit">
            Dodaj račun
          </button>
        </div>
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
          />
        )}
      </form>
    </div>
  );
};

export default DodajRacun;
