import React from 'react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig';

const RasporedDan = ({ teorija, student, teorijaID, day, user, setSchedule, setNotification, isTeorija }) => {
  const obrisiTermin = async (id) => {
    try {
      const deleteUrl = isTeorija ? `${ApiConfig.baseUrl}/api/deleteTermin/${id}?day=${day}&teorijaID=${teorijaID}` : `${ApiConfig.baseUrl}/api/deleteUcenikTermin/${student._id}`;
      await axios.delete(deleteUrl, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setSchedule(prevSchedule => {
        if (Array.isArray(prevSchedule)) {
          // Ažuriranje za teoriju
          return prevSchedule.map(term => term._id !== id ? term : null).filter(term => term !== null);
        } else {
          // Ažuriranje za studentski raspored
          const updatedDay = prevSchedule[day].filter(term => term._id !== id);
          return { ...prevSchedule, [day]: updatedDay };
        }
      });

      if (setNotification) {
        setNotification({
          type: 'success',
          message: 'Termin obrisan!',
        });
      }
    } catch (error) {
      console.error('Error deleting term:', error);
      if (setNotification) {
        setNotification({
          type: 'error',
          message: 'Došlo je do greške prilikom brisanja termina.',
        });
      }
    }
  };

  return (
    <div className='dan'>
      <div className="nazivDana">{day}</div>
      {teorija && teorija.length > 0 && teorija.map((term, index) => (
        <div key={index} className={`termin ${isTeorija ? 'boja-teorija' : ''}`}>
          {user && user.isAdmin && (
            <div className='obrisiTermin' onClick={() => obrisiTermin(term._id)}>
              <Icon icon="solar:minus-circle-broken" />
            </div>
          )}
          <div className="dvorana">{term.dvorana}</div>
          <div className="vrijeme">{term.vrijeme}</div>
          <div className="rasporedMentor">{term.mentor}</div>
        </div>
      ))}
    </div>
  );
};

export default RasporedDan;
