import React, { useEffect, useState, useCallback } from 'react';
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
  const [selectedStudent, setSelectedStudent] = useState({});
  const [studentsRaspored, setStudentsRaspored] = useState([]);
  const [teorija, setTeorija] = useState({});
  const [dodajRasporedTeorija, setDodajRasporedTeorija] = useState(false);
  const [dodajRasporedStudent, setDodajRasporedStudent] = useState(false);
  const [rasporedGumb, setRasporedGumb] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [combinedSchedule, setCombinedSchedule] = useState({});
  const [showCombinedSchedule, setShowCombinedSchedule] = useState(false);

  const sendRequestStudentRaspored = async (studentId) => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/rasporedUcenik/${studentId}`, { withCredentials: true });
      const data = res.data;
      setStudentsRaspored(data.schedule);
      setSelectedStudent(data.student);
    } catch (err) {
      console.error('Error fetching student raspored:', err);
    }
  };

  const handleStudentClick = (studentId) => {
    setSelectedStudentId(studentId);
    sendRequestStudentRaspored(studentId);
    setShowCombinedSchedule(false);
  };

  const sendRequest = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/user`, { withCredentials: true });
      const data = res.data;
      return data;
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const sendRequestTeorija = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/rasporedTeorija`, { withCredentials: true });
      const data = res.data;
      const teorijaObj = data.teorija.reduce((acc, item) => {
        ['pon', 'uto', 'sri', 'cet', 'pet', 'sub'].forEach(day => {
          if (!acc[day]) acc[day] = [];
          acc[day] = acc[day].concat(item[day] || []);
        });
        return acc;
      }, {});
      setTeorija(teorijaObj);
    } catch (err) {
      console.error('Error fetching teorija data:', err);
    }
  };

  const sendRequestStudentsRaspored = useCallback(async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/rasporedUcenici/${user._id}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error('Error fetching students raspored:', err);
    }
  }, [user]);

  const handleItemClickRasporedGumb = () => {
    setRasporedGumb(prevValue => !prevValue);
  };

  const handleCombinedScheduleClick = async () => {
    try {
      const res = await sendRequestStudentsRaspored();
      const { schedules, students } = res;
      const combined = schedules.reduce((acc, studentSchedule) => {
        ['pon', 'uto', 'sri', 'cet', 'pet', 'sub'].forEach(day => {
          if (!acc[day]) acc[day] = [];
          acc[day] = acc[day].concat(
            (studentSchedule[day] || []).map(term => ({
              ...term,
              studentId: studentSchedule.ucenikId,
              studentName: `${students.find(s => s._id === studentSchedule.ucenikId)?.ime} ${students.find(s => s._id === studentSchedule.ucenikId)?.prezime}`
            }))
          );
        });
        return acc;
      }, {});
      setCombinedSchedule(combined);
      setShowCombinedSchedule(true);
    } catch (err) {
      console.error('Error fetching combined schedules:', err);
    }
  };

  useEffect(() => {
    sendRequest().then((data) => {
      setUser(data.user);
      if (data.user.isStudent) {
        sendRequestStudentRaspored(data.user._id);
      }
    });
    sendRequestTeorija();
  }, []);

  useEffect(() => {
    if (user && user.isMentor) {
      sendRequestStudentsRaspored().then((data) => setStudentsRaspored(data.schedule));
      sendRequestTeorija();
    }
  }, [user, sendRequestStudentsRaspored]);
  

  return (
    <>
      <Navigacija user={user} otvoreno="raspored" />
      <NavTop user={user} naslov="Raspored" />
      
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
          <>
            <div className="rl-gumb" onClick={handleItemClickRasporedGumb}>
              <Icon className="icon" icon={rasporedGumb ? "solar:list-up-minimalistic-broken" : "solar:list-down-minimalistic-broken"} />
            </div>
            {rasporedGumb && (
              <NavSideRaspored
                id={user._id}
                students={user.students}
                onStudentClick={handleStudentClick}
                onCombinedScheduleClick={handleCombinedScheduleClick}
              />
            )}
          </>
        )}

        {(selectedStudentId || showCombinedSchedule) && user.isMentor && (
          <>
            {showCombinedSchedule ? (
              <div className="raspored">
                {['pon', 'uto', 'sri', 'cet', 'pet', 'sub'].map((day) => (
                  <RasporedDan
                    key={day}
                    day={day}
                    teorija={combinedSchedule[day]}
                    user={user}
                    setSchedule={setCombinedSchedule}
                    setNotification={setNotification}
                    isTeorija={false}
                  />
                ))}
              </div>
            ) : (
              <div className="raspored">
                {studentsRaspored ? (
                  ['pon', 'uto', 'sri', 'cet', 'pet', 'sub'].map((day) => (
                    <RasporedDan
                      key={day}
                      day={day}
                      teorija={studentsRaspored[day]}
                      user={user}
                      student={selectedStudent}
                      setSchedule={setStudentsRaspored}
                      setNotification={setNotification}
                      isTeorija={false}
                    />
                  ))
                ) : (
                  <p>Nema dostupnog rasporeda</p>
                )}
              </div>
            )}
          </>
        )}

        {/* Teorija Schedule Display */}
        <div className='div-radio bc-none'>
          <div>
            <p>Raspored teorija</p>
          </div>
          {user && user.isAdmin && (
            <div
              className="gumb action-btn abEdit "
              onClick={() => setDodajRasporedTeorija(true)}
            >
              <Icon icon="solar:add-circle-broken" fontSize="large" />Uredi teoriju
            </div>
          )}
        </div>

        <div className="raspored">
          {teorija ? (
            ['pon', 'uto', 'sri', 'cet', 'pet', 'sub'].map((day) => (
              <RasporedDan
                key={day}
                day={day}
                teorija={teorija[day]}
                user={user}
                isTeorija={true}
                setSchedule={setTeorija}
                setNotification={setNotification}
              />
            ))
          ) : (
            <div>
              <p>Nema dostupnog teorijskog rasporeda</p>
            </div>
          )}
        </div>

        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </>
  );
};

export default Raspored;
