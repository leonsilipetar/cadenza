import React, { useState } from 'react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig';

axios.defaults.withCredentials = true;

const DodajTermin = ({ onCancel }) => {
  const [status, setStatus] = useState('');
  const [isDodajMentoraDisabled, setIsDodajMentoraDisabled] = useState(false);
  const [terms, setTerms] = useState([]); // Change to array to store multiple terms
  const [inputs, setInputs] = useState({
    dvorana: '',
    vrijeme: '',
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
  
      setTerms((prevTerms) => [
        ...prevTerms,
        {
          day: selectedDay,
          dvorana: inputs.dvorana,
          vrijeme: inputs.vrijeme,
          mentor: inputs.mentor,
        },
      ]);
  
      setInputs({
        dvorana: '',
        vrijeme: '',
        mentor: '',
      });
    }
  };
  

  

  const dodajTeorija = async () => {
    try {
      console.log('Sending to server:', terms);
      const res = await axios.post(`${ApiConfig.baseUrl}/api/uredi/teorija`, {
        raspored: terms,
      });
      const data = res.data;
      console.log('Server Response:', data);
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
      setTerms([]); // Clear terms after successful submission
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
        {terms?.length > 0  && (
        <div className="div div-clmn">Dodani termini:
        {terms.map((term, index) => (
          <div key={index} className="div-clmn">
            <p>{`${term.day}: ${term.dvorana}, ${term.vrijeme}, Mentor: ${term.mentor}`}</p>
          </div>
        ))}
        </div>
        )}

        <div className="div div-clmn">
          <div className="div-radio raspored-divs">
            {['pon', 'uto', 'sri', 'cet', 'pet', 'sub'].map((day) => (
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
            <label htmlFor="vrijeme">Vrijeme:</label>
            <input
              className="input-login-signup"
              value={inputs.vrijeme}
              onChange={handleChange}
              type="text"
              name="vrijeme"
              id="vrijeme"
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
          <button
            className={`gumb action-btn spremiBtn ${
              isDodajMentoraDisabled ? 'disabledSpremiBtn' : ''
            }`}
            type="button"
            onClick={handleAddTerm}
            disabled={isDodajMentoraDisabled}
          >
            + termin
          </button>
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
            type="submit"
            onClick={handleSubmit}
            disabled={isDodajMentoraDisabled}
          >
            {isDodajMentoraDisabled ? 'Spremanje' : 'Spremi termin'}
          </button>
        </div>

        {isDodajMentoraDisabled && (
          <div className={`div`}>
            <p>{status}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default DodajTermin;
