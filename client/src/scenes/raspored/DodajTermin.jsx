import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig';
import Notification from '../../components/Notifikacija'; // Adjust the path as needed

axios.defaults.withCredentials = true;

const DodajTermin = ({ onCancel, studentID }) => {
  const [isDodajMentoraDisabled, setIsDodajMentoraDisabled] = useState(false);
  const [terms, setTerms] = useState([]);
  const [inputs, setInputs] = useState({
    dvorana: '',
    vrijeme: '',
    mentor: '',
  });
  const [selectedDay, setSelectedDay] = useState('');
  const [classrooms, setClassrooms] = useState([]);
  const [availableClassrooms, setAvailableClassrooms] = useState([]);
  const [notification, setNotification] = useState(null); // Added notification state

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await axios.get(`${ApiConfig.baseUrl}/api/classrooms`);
        console.log('Classrooms fetched:', res.data); // Debugging line
        setClassrooms(res.data);
        setAvailableClassrooms(res.data); // Set all fetched classrooms as available initially
      } catch (err) {
        console.error('Error fetching classrooms:', err);
      }
    };

    fetchClassrooms();
  }, []);

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
    if (selectedDay && inputs.dvorana) {
      const selectedClassroom = classrooms.find(c => c.name === inputs.dvorana);
      if (selectedClassroom) {
        setAvailableClassrooms(prevClassrooms => 
          prevClassrooms.filter(c => c._id !== selectedClassroom._id)
        );
        selectedClassroom.isAvailable = false;
        axios.put(`${ApiConfig.baseUrl}/api/classrooms/${selectedClassroom._id}`, selectedClassroom)
          .then(() => console.log('Classroom updated:', selectedClassroom))
          .catch(err => console.error('Error updating classroom:', err));
      }

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

  const saveTerms = async (terms) => {
    try {
      let res;
      if (studentID) {
        res = await axios.post(`${ApiConfig.baseUrl}/api/uredi/ucenik-raspored/${studentID}`, {
          schedules: terms,
        });
      } else {
        res = await axios.post(`${ApiConfig.baseUrl}/api/uredi/teorija`, {
          raspored: terms,
        });
      }
      console.log('Server Response:', res.data); // Debugging line
      return res.data;
    } catch (err) {
      console.error('Error saving terms:', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDodajMentoraDisabled(true);

    const result = await saveTerms(terms);

    if (result) {
      console.log('Raspored je uspjesno dodan:', result);
      setNotification({
        type: 'success',
        message: 'Raspored je uspješno dodan!',
      });
      setTerms([]);
    } else {
      console.log('Došlo je do pogreške tijekom dodavanja rasporeda.');
      setNotification({
        type: 'error',
        message: 'Došlo je do greške prilikom dodavanja rasporeda!',
      });
      setTimeout(() => {
        setIsDodajMentoraDisabled(false);
        setNotification({
          type: 'warning',
          message: 'Pokušajte ponovno!',
        });
      }, 3000);
    }
  };

  return (
    <div className="popup">
      <form onSubmit={handleSubmit}>
        {terms.length > 0 && (
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
            <select
              className="input-login-signup"
              name="dvorana"
              id="dvorana"
              value={inputs.dvorana}
              onChange={handleChange}
              disabled={isDodajMentoraDisabled}
            >
              <option value="">Odaberite dvoranu</option>
              {availableClassrooms.map(classroom => (
                <option key={classroom._id} value={classroom.name}>
                  {classroom.name}
                </option>
              ))}
            </select>
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
              placeholder="mentor/predmet"
            />
          </div>
          <button
            className={`gumb action-btn spremiBtn ${isDodajMentoraDisabled ? 'disabledSpremiBtn' : ''}`}
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
            className={`gumb action-btn spremiBtn ${isDodajMentoraDisabled ? 'disabledSpremiBtn' : ''}`}
            type="submit"
            disabled={isDodajMentoraDisabled}
          >
            Spremi
          </button>
        </div>
      </form>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
        />
      )}
    </div>
  );
};

export default DodajTermin;
