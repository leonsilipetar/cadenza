import React from 'react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig';

const RasporedDan = ({
  teorija,
  student,
  teorijaID,
  day,
  user,
  setSchedule,
  setNotification,
  isTeorija,
  getColorByStudentId
}) => {
  const obrisiTermin = async (id) => {
    try {
      const deleteUrl = isTeorija
        ? `${ApiConfig.baseUrl}/api/deleteTermin/${id}?day=${day}&teorijaID=${teorijaID}`
        : `${ApiConfig.baseUrl}/api/deleteUcenikTermin/${student._id}?day=${day}&terminId=${id}`;
      await axios.delete(deleteUrl, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setSchedule(prevSchedule => {
        if (Array.isArray(prevSchedule)) {
          // Update for theory
          return prevSchedule.filter(term => term._id !== id);
        } else {
          // Update for student schedule
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
      {teorija && teorija.length > 0 && teorija.map((term, index) => {
  const displayName = user?.isMentor
    ? term.studentName // Show student name if user is mentor
    : term.mentor; // Show mentor name if user is student

  return (
    <div
      key={index}
      className={`termin ${isTeorija ? 'boja-teorija' : ''}`}
    >
      {user && user.isAdmin && (
        <div className='obrisiTermin' onClick={() => obrisiTermin(term._id)}>
          <Icon icon="solar:minus-circle-broken" />
        </div>
      )}
      <div className="dvorana">{term.dvorana}</div>
      <div className="vrijeme">{term.vrijeme}</div>
      {isTeorija ? (
        <div className="rasporedMentor">{term.mentor}</div>
      ) : (
        <div className="rasporedMentor">
          {user && user.isStudent ? term.mentor : displayName || user.korisnickoIme}
        </div>
      )}
    </div>
  );
})}

    </div>
  );
};

export default RasporedDan;
