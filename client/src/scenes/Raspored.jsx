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
  const [teorijaID, setTeorijaID] = useState({});
  const [dodajRasporedTeorija, setDodajRasporedTeorija] = useState(false);
  const [dodajRasporedStudent, setDodajRasporedStudent] = useState(false);
  const [rasporedGumb, setRasporedGumb] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [combinedSchedule, setCombinedSchedule] = useState({});
  const [showCombinedSchedule, setShowCombinedSchedule] = useState(false);

  const sendRequestStudentRaspored = async () => {
    if (!user || !user._id) {
      console.error('User is not defined or does not have an _id');
      return; // Exit if user is not defined
    }

    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/rasporedUcenik/${user._id}`, { withCredentials: true });
      const data = res.data;
      setStudentsRaspored(data.schedule);
      setSelectedStudent(data.student);
    } catch (err) {
      console.error('Error fetching student raspored:', err);
    }
  };

  const onStudentClick = async (studentId) => {
    setSelectedStudentId(studentId);
    setShowCombinedSchedule(false);
    
    // Fetch the student's schedule using the studentId
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/rasporedUcenik/${studentId}`, { withCredentials: true });
      console.log('Student Schedule Response:', res.data); // Log the response
      const data = res.data;

      // Check if data has the expected properties
      if (data && data.schedule) {
        setStudentsRaspored(data.schedule);
        setSelectedStudent(data.student);
      } else {
        console.error('Unexpected data structure:', data);
        // Handle the case where the schedule is not available
        setStudentsRaspored([]); // Reset or set to a default value
        setSelectedStudent(null); // Reset or set to a default value
      }
    } catch (err) {
      console.error('Error fetching student schedule:', err);
    }
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
      setTeorijaID(data.teorija[0]._id);
      setTeorija(teorijaObj);
      console.log('Teorija data:', data);
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
      const res = await axios.get(`${ApiConfig.baseUrl}/api/rasporedUcenici/${user._id}`, { withCredentials: true });
      if (res.data && res.data.schedule) {
        setCombinedSchedule(res.data.schedule);
        setShowCombinedSchedule(true);
      } else {
        console.log('No schedule data in response');
      }
    } catch (err) {
      console.error('Error fetching combined schedules:', err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${ApiConfig.baseUrl}/api/user`, { withCredentials: true });
        setUser(res.data.user);
        if (res.data.user.isStudent) {
          sendRequestStudentRaspored(); // Fetch student schedule if user is a student
        }
        sendRequestTeorija(); // Fetch teorija data
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user && user.isStudent) {
      sendRequestStudentRaspored(); // Call the function only if user is defined
    }
  }, [user]); // Dependency on user

  useEffect(() => {
    console.log('User updated:', user);
    if (user && user.isMentor) {
      sendRequestStudentsRaspored().then((data) => {
        setStudentsRaspored(data.schedule);
      });
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
                onStudentClick={onStudentClick}
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
              <>
                <div className='div-radio bc-none'>
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
              </>
            )}
          </>
        )}

        {user && user.isStudent && (
          <>
            <div className='div-radio bc-none'>
              <div>
                <p>Raspored učenika</p>
              </div>
            </div>
            <div className="raspored">
              {studentsRaspored ? (
                ['pon', 'uto', 'sri', 'cet', 'pet', 'sub'].map((day) => (
                  <RasporedDan
                    key={day}
                    day={day}
                    teorija={studentsRaspored[day]}
                    user={user}
                    student={user}
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
                teorijaID={teorijaID}
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