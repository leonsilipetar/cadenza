import React, { useState } from 'react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig';

axios.defaults.withCredentials = true;

const DodajTermin = ({ dodajRasporedTeorija, onCancel }) => {
  const [status, setStatus] = useState('');
  const [isDodajMentoraDisabled, setIsDodajMentoraDisabled] = useState(false);
  const [inputs, setInputs] = useState({
    raspored: {
      pon: [],
      uto: [],
      sri: [],
      cet: [],
      pet: [],
      sub: [],
    },
    dvorana: '',
    hour: '',
    mentor: '',
  });
  const [selectedDay, setSelectedDay] = useState('');

  const handleDayToggle = (day) => {
    setSelectedDay(day);
  };

  const handleChange = (e) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddTerm = () => {
    if (selectedDay) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        raspored: {
          ...prevInputs.raspored,
          [selectedDay]: [
            ...prevInputs.raspored[selectedDay],
            { dvorana: inputs.dvorana, hour: inputs.hour, mentor: inputs.mentor },
          ],
        },
        dvorana: '',
        hour: '',
        mentor: '',
      }));
    }
  };

  const dodajTeorija = async () => {
    try {
      const res = await axios.post(`${ApiConfig.baseUrl}/api/uredi/teorija`, inputs);
      const data = res.data;
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDodajMentoraDisabled(true);

    const result = await dodajTeorija();

    if (result) {
      console.log('Raspored je uspjesno dodan:', result);
      setStatus('Raspored je uspješno dodan!');
    } else {
      console.log('Doslo je do pogreske tijekom dodavanja rasporeda.');
      setStatus('Došlo je do greške prilikom dodavanja rasporeda!');
      setTimeout(() => {
        setIsDodajMentoraDisabled(false);
        setStatus('Probajte ponovno!');
      }, 3000);
    }
  };

  return (
    <div className="popup">
      <form onSubmit={handleSubmit}>
        <div className="div-radio">
          {Object.keys(inputs.raspored).map((day) => (
            <div
              key={day}
              className={`radio-item ${selectedDay === day ? 'checked' : ''}`}
              onClick={() => handleDayToggle(day)}
            >
              <input
                type="radio"
                id={day}
                checked={selectedDay === day}
                onChange={() => handleDayToggle(day)}
                style={{ display: 'none' }}
              />
              {day}
            </div>
          ))}
        </div>

        <div className="div">
          <label htmlFor="dvorana">Dvorana:</label>
          <input
            className="input-login-signup"
            value={inputs.dvorana}
            onChange={handleChange}
            type="text"
            name="dvorana"
            id="dvorana"
            placeholder="npr. učionica 1"
          />
          <label htmlFor="hour">Vrijeme:</label>
          <input
            className="input-login-signup"
            value={inputs.hour}
            onChange={handleChange}
            type="time"
            name="hour"
            id="hour"
            placeholder="npr. 12:00"
          />
          <label htmlFor="mentor">Mentor:</label>
          <input
            className="input-login-signup"
            value={inputs.mentor}
            onChange={handleChange}
            type="text"
            name="mentor"
            id="mentor"
            placeholder="mentor"
          />
        </div>

        <div className="div-radio">
          <button
            className="gumb action-btn zatvoriBtn primary-btn"
            onClick={() => onCancel()}
          >
            Zatvori
          </button>
          <button
            className={`gumb action-btn spremiBtn ${
              isDodajMentoraDisabled ? 'disabledSpremiBtn' : ''
            }`}
            type="button"
            onClick={handleAddTerm}
            disabled={isDodajMentoraDisabled}
          >
            Dodaj termin
          </button>
          <button
            className={`gumb action-btn spremiBtn ${
              isDodajMentoraDisabled ? 'disabledSpremiBtn' : ''
            }`}
            type="submit"
            onClick={handleSubmit}
            disabled={isDodajMentoraDisabled}
          >
            {isDodajMentoraDisabled ? 'Spremanje' : 'Spremi termin'}
          </button>
        </div>
        <div className={`div`}>
          <p>{status}</p>
        </div>
      </form>
    </div>
  );
};

export default DodajTermin;
