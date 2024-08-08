import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig';
import Notification from '../../components/Notifikacija';

const DodajClassroom = ({ onDodajClassroom, onCancel }) => {
  const [schools, setSchools] = useState([]);
  const [inputs, setInputs] = useState({
    name: '',
    school: '', // Add school to inputs
  });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await axios.get(`${ApiConfig.baseUrl}/api/schools`);
        setSchools(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSchools();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const dodajClassroom = async () => {
    try {
      const res = await axios.post(`${ApiConfig.baseUrl}/api/classrooms`, inputs);
      return res.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dodajClassroom();
    if (result) {
      setNotification({
        type: 'success',
        message: 'Učionica uspješno dodana!',
      });
      if (typeof onDodajClassroom === 'function') {
        onDodajClassroom(); // Notify parent component if it's a function
      }
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
          <label htmlFor="classroom-name">Naziv učionice:</label>
          <input
            className="input-login-signup"
            value={inputs.name}
            onChange={handleChange}
            type="text"
            name="name"
            id="classroom-name"
            placeholder="Naziv učionice"
            required
          />
          <label htmlFor="classroom-school">Škola:</label>
          <select
            className="input-login-signup"
            value={inputs.school}
            onChange={handleChange}
            name="school"
            id="classroom-school"
            required
          >
            <option value="">Odaberi školu</option>
            {schools.map((school) => (
              <option key={school._id} value={school._id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>
        <div className="div-radio">
          <button className="gumb action-btn zatvoriBtn" type="button" onClick={onCancel}>
            Zatvori
          </button>
          <button className="gumb action-btn spremiBtn" type="submit">
            Dodaj učionicu
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

export default DodajClassroom;
