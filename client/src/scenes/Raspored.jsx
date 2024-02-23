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
  const [selectedStudent, setSelectedStudent] = useState();
  const [studentsRaspored, setStudentsRaspored] = useState([]);
  const [teorija, setTeorija] = useState([]);
  const [dodajRasporedTeorija, setDodajRasporedTeorija] = useState(false);
  const [dodajRasporedStudent, setDodajRasporedStudent] = useState(false);
  const [rasporedGumb, setRasporedGumb] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const sendRequestStudentRaspored = async (studentId) => {
    try {
      if(user && user.isMentor){
      const res = await axios.get(`${ApiConfig.baseUrl}/api/rasporedUcenik/${studentId}`, {
        withCredentials: true,
      });
      const data = res.data;
      setStudentsRaspored(data.schedule);
      setSelectedStudent(data.student);
    }
    if(user && user.isStudent){
      const res = await axios.get(`${ApiConfig.baseUrl}/api/rasporedUcenik/${user._id}`, {
        withCredentials: true,
      });
      const data = res.data;
      setStudentsRaspored(data);
    }
    } catch (err) {
      console.error('Error fetching student raspored:', err);
    }
  };

  const handleStudentClick = (studentId) => {
    setSelectedStudentId(studentId);
    sendRequestStudentRaspored(studentId);
  };

  const sendRequest = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/user`, {
        withCredentials: true,
      });
      const data = res.data;
      return data;
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const sendRequestTeorija = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/rasporedTeorija`, {
        withCredentials: true
      });
      const data = res.data;
      return data;
    } catch (err) {
      console.error('Error fetching teorija data:', err);
    }
  };

  const sendRequestStudentsRaspored = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/rasporedUcenici/${user._id}`, {
        withCredentials: true
      });
      const data = res.data;
      return data;
    } catch (err) {
      console.error('Error fetching students raspored:', err);
    }
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
        setStudentsRaspored(data.schedule);
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
       {dodajRasporedStudent && (
        <DodajTermin
          dodajRasporedTeorija={dodajRasporedStudent}
          onCancel={() => setDodajRasporedStudent(false)}
          studentID={selectedStudent._id}
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
        
        {user && user.isMentor && selectedStudentId && (
  <>
    <div className=' div-radio bc-none'>
      <div>
        <p>Raspored učenika: {selectedStudent && selectedStudent.ime} {selectedStudent && selectedStudent.prezime}</p>
      </div>
      {user && user.isMentor && (
        <div
          className="gumb action-btn abEdit "
          onClick={() => setDodajRasporedStudent(true)}
        >
          <Icon icon="solar:add-circle-broken" fontSize="large" />Uredi raspored
        </div>
      )}
    </div>
    <div className="raspored">
      {studentsRaspored ? (
        ['pon', 'uto', 'sri', 'cet', 'pet', 'sub'].map((day) => (
          <RasporedDan
              key={day}
              day={day}
              teorija={studentsRaspored[day]}
              user={user}
              student={selectedStudent._id}
              setSchedule={setStudentsRaspored}
              setNotification={setNotification}
              isTeorija={false}
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
{user && user.isAdmin && (
          <div className="div-radio bc-none">
            <div>
        <p>Teorija</p>
      </div>
            <div
              className="gumb action-btn abEdit "
              onClick={() => setDodajRasporedTeorija(true)}
            >
              <Icon icon="solar:add-circle-broken" fontSize="large" />Raspored Teorija
            </div>
          </div>
        )}
        <div className="raspored">
          {teorija ? (
            ['pon', 'uto', 'sri', 'cet', 'pet', 'sub'].map((day) => (
              <RasporedDan
                key={day}
                teorija={teorija[0]?.[day]}
                teorijaID={teorija[0]?._id}
                day={day}
                user={user}
                setSchedule={setTeorija}
                setNotification={setNotification}
                isTeorija={true}
              />
            ))
          ) : (
            <div>
              <p>Nema dostupnog rasporeda</p>
            </div>
          )}
        </div>
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
