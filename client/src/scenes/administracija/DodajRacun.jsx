import React, { useState } from 'react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig';
import Notification from '../../components/Notifikacija';

const DodajRacun = ({ onDodajRacun, onCancel }) => {
  const [month, setMonth] = useState('');
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Slanje meseca na backend za generisanje računa
      await axios.post(`${ApiConfig.baseUrl}/generate-invoice`, { month }, { withCredentials: true });
      
      setNotification({
        type: 'success',
        message: 'Računi su uspješno generirani za mjesec: ' + month,
      });
      if (typeof onDodajRacun === 'function') {
        onDodajRacun(); // Osvježi popis računa
      }
    } catch (error) {
      console.error("Greška pri dodavanju računa:", error);
      setNotification({
        type: 'error',
        message: 'Došlo je do greške prilikom dodavanja računa.',
      });
    }
  };

  return (
    <div className="popup">
      <form onSubmit={handleSubmit}>
        <div className="div">
          <label htmlFor="month">Mjesec:</label>
          <input
            className="input-login-signup"
            type="month" // Koristi tip "month" za olakšanje unosa
            name="month"
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          />
        </div>
        <div className="div-radio">
          <button className="gumb action-btn zatvoriBtn" type="button" onClick={onCancel}>
            Otkaži
          </button>
          <button className="gumb action-btn spremiBtn" type="submit">
            Dodaj
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
