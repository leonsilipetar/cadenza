import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigacija from './navigacija';
import NavTop from './nav-top';
import NavSideRaspored from './mentori/NavSideRaspored';
import ChatWindow from './chat/ChatWindow';
import ApiConfig from '../components/apiConfig.js';

axios.defaults.withCredentials = true;

const Chat = () => {
  const [user, setUser] = useState();
  const [students, setStudents] = useState([]);  // List of students for the sidebar
  const [selectedStudent, setSelectedStudent] = useState(null);  // Current chat recipient
  const otvoreno = "chat";

  const sendRequest = async () => {
    const res = await axios.get(`${ApiConfig.baseUrl}/api/user`).catch((err) => console.log(err));
    return res?.data;
  }

  useEffect(() => {
    sendRequest().then((data) => setUser(data.user));
    fetchStudents();  // Fetch students when the component mounts
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/students`);
      setStudents(res.data.students);
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  const handleStudentClick = (studentId) => {
    setSelectedStudent(studentId);  // Set the selected student for chat
  };

  return (
    <>
      <Navigacija user={user} otvoreno={otvoreno} />
      <NavTop user={user} naslov={"Chat"} />
      <div className="main">
        <div className="chat-container">
          <NavSideRaspored
            students={students} 
            onStudentClick={handleStudentClick} 
            onCombinedScheduleClick={() => console.log("Show combined schedule")}
            biljeske={true}
          />
          <ChatWindow user={user} recipientId={selectedStudent} />
        </div>
      </div>
    </>
  )
}

export default Chat;
