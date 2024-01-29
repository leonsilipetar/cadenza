import { Icon } from '@iconify/react';
import React from 'react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig';

const RasporedDan = ({ teorija, teorijaID, day, user, setTeorija, setNotification }) => {
  const obrisiTermin = async (id, day) => {
    try {
      // Send a DELETE request to delete the term with the specified id
      // Include the day and teorijaID parameters in the URL
      await axios.delete(`${ApiConfig.baseUrl}/api/deleteTermin/${id}?day=${day}&teorijaID=${teorijaID}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      setTeorija((prevTeorija) => {
        const updatedTeorija = prevTeorija.map((dayData) => {
          const updatedDayData = { ...dayData };
          updatedDayData[day] = updatedDayData[day].filter((term) => term._id !== id);
          return updatedDayData;
        });
        return updatedTeorija;
      });
  
      // Update the notification state here
      if (setNotification) {
        setNotification({
          type: 'success',
          message: 'Termin obrisan!',
        });
      }
    } catch (error) {
      console.error('Error deleting term:', error);
      // Handle error and update notification state accordingly
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
      {Array.isArray(teorija) && teorija.length > 0 && (
        teorija.map((term, index) => (
          <div key={index} className="termin">
            {user && user.isAdmin && (
              <div
                className='obrisiTermin'
                onClick={() => obrisiTermin(term._id, day)} // Pass the term id to the function
              >
                <Icon icon="solar:minus-circle-broken" />
              </div>
            )}
            <div className="dvorana">{term.dvorana}</div>
            <div className="vrijeme">{term.vrijeme}</div>
            <div className="rasporedMentor">{term.mentor}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default RasporedDan;
