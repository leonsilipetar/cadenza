import React, { useState } from 'react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig';
import Notification from '../../components/Notifikacija';

const DodajProgram = ({ onDodajProgram, onCancel }) => {
  const [inputs, setInputs] = useState({
    naziv: '',
    cijena: '',
    tip: '',
    skola: '',
  });
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const dodajProgram = async () => {
    try {
      const res = await axios.post(`${ApiConfig.baseUrl}/api/programs`, inputs);
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const program = await dodajProgram();
    if (program) {
      setNotification({
        type: 'success',
        message: 'Program uspješno dodan!',
      });
      onDodajProgram();
      setInputs({
        naziv: '',
        cijena: '',
        tip: '',
        skola: '',
      });
    } else {
      setNotification({
        type: 'error',
        message: 'Greška pri dodavanju programa. Pokušajte ponovo.',
      });
    }
  };

  return (
    <div className="dodaj-program">
      <h2>Dodaj program</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="naziv"
          value={inputs.naziv}
          onChange={handleChange}
          placeholder="Naziv programa"
          required
        />
        <input
          type="number"
          name="cijena"
          value={inputs.cijena}
          onChange={handleChange}
          placeholder="Cijena"
          required
        />
        <input
          type="text"
          name="tip"
          value={inputs.tip}
          onChange={handleChange}
          placeholder="Tip"
          required
        />
        <input
          type="text"
          name="skola"
          value={inputs.skola}
          onChange={handleChange}
          placeholder="ID škole"
          required
        />
        <div className="gumb btn-group">
          <button type="button" className="gumb action-btn" onClick={onCancel}>
            Zatvori
          </button>
          <button type="submit" className="gumb action-btn spremiBtn">
            Dodaj program
          </button>
        </div>
        {notification && (
          <Notification type={notification.type} message={notification.message} />
        )}
      </form>
    </div>
  );
};

export default DodajProgram;
