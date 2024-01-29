import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigacija from './navigacija';
import NavTop from './nav-top';
import ApiConfig from '../components/apiConfig.js';
import RasporedDan from './raspored/RasporedDan.jsx';
import DodajTermin from './raspored/DodajTermin.jsx';
import { Icon } from '@iconify/react';
import NavSideRaspored from './mentori/NavSideRaspored.jsx';
import Notification from '../components/Notifikacija.jsx';

axios.defaults.withCredentials = true;

const Raspored = () => {
  const [user, setUser] = useState();
  const [studentsRaspored, setStudentsRaspored] = useState([]);
  const [teorija, setTeorija] = useState();
  const [dodajRasporedTeorija, setDodajRasporedTeorija] = useState(false);
  const [rasporedGumb, setRasporedGumb] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const sendRequestStudentRaspored = async (studentId) => {
    const res = await axios.get(`${ApiConfig.baseUrl}/api/rasporedUcenik/${studentId}`, {
      withCredentials: true,
    }).catch((err) => console.log(err));
    const data = await res.data;
    console.log('Raspored studenta:', data);
    setStudentsRaspored(data.schedules);
  };

  const handleStudentClick = (studentId) => {
    setSelectedStudentId(studentId);
    sendRequestStudentRaspored(studentId);
  };

  const sendRequest = async () => {
    const res = await axios.get(`${ApiConfig.baseUrl}/api/user`, {
      withCredentials: true,
    }).catch((err) => console.log(err));
    const data = await res.data;
    return data;
  };

  const sendRequestTeorija = async () => {
    const res = await axios.get(`${ApiConfig.baseUrl}/api/rasporedTeorija`, {
      withCredentials: true
    }).catch((err) => console.log(err));
    const data = await res.data;
    console.log('Teorija Data:', data);
    return data;
  };

  const sendRequestStudentsRaspored = async () => {
    const res = await axios.get(`${ApiConfig.baseUrl}/api/rasporedUcenici/${user._id}`, {
      withCredentials: true
    }).catch((err) => console.log(err));
    const data = await res.data;
    console.log('Raspored ucenici:', data);
    return data;
  };

  const handleItemClickRasporedGumb = () => {
    setRasporedGumb((prevValue) => !prevValue);
  };

  useEffect(() => {
    sendRequest().then((data) => {
      setUser(data.user);
    });
    if (user && user.isMentor) {
      sendRequestStudentsRaspored().then((data) => {
        setUser(data.schedules);
      });
    }
    sendRequestTeorija().then((data) => {
      setTeorija(data.teorija);
    });
  }, [dodajRasporedTeorija]);

  return (
    <>
      <Navigacija user={user} otvoreno={'raspored'} />
      <NavTop user={user} naslov={'Raspored'} />
      {dodajRasporedTeorija && (
        <DodajTermin
          dodajRasporedTeorija={dodajRasporedTeorija}
          onCancel={() => setDodajRasporedTeorija(false)}
        />
      )}
      <div className="main">
        {user && user.isMentor && (
          <div className="rl-gumb" onClick={handleItemClickRasporedGumb} >
            {rasporedGumb ? (
              <Icon className="icon" icon="solar:list-up-minimalistic-broken" />
            ) : (
              <Icon className="icon" icon="solar:list-down-minimalistic-broken" />
            )}
          </div>
        )}
        {user && user.isMentor && rasporedGumb && (
          <NavSideRaspored
            id={user._id}
            students={user.students}
            onStudentClick={handleStudentClick}
          />
        )}
        {user && user.isAdmin && (
          <div className="sbtwn">
            <div
              className="gumb action-btn abEdit "
              onClick={() => setDodajRasporedTeorija(true)}
            >
              <Icon icon="solar:add-circle-broken" fontSize="large" />Raspored Teorija
            </div>
          </div>
        )}
        <div className='sbtwn'><p>Teorija</p></div>
        <div className="raspored">
          {teorija ? (
            ['pon', 'uto', 'sri', 'cet', 'pet', 'sub'].map((day) => (
              <RasporedDan
                key={day}
                teorija={teorija[0]?.[day]}
                teorijaID={teorija[0]?._id}
                day={day}
                user={user}
                setTeorija={setTeorija}
                setNotification={setNotification}
              />
            ))
          ) : (
            <div>
              <p>Nema dostupnog rasporeda</p>
            </div>
          )}
        </div>
        {user && user.isMentor && selectedStudentId && (
  <>
    <div className='sbtwn'><p>Raspored učenika</p></div>
    <div className="raspored">
      {studentsRaspored && studentsRaspored.length > 0 ? (
        studentsRaspored.map((studentSchedule) => (
          <RasporedDan
            key={studentSchedule.day}
            teorija={studentSchedule.teorija}
            teorijaID={studentSchedule.teorijaID}
            day={studentSchedule.day}
            user={user}
            setTeorija={setTeorija}
            setNotification={setNotification}
          />
        ))
      ) : (
        <div>
          <p>Nema dostupnog rasporeda</p>
        </div>
      )}
    </div>
  </>
)}

        
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
          />
        )}
      </div>
    </>
  );
};

export default Raspored;
