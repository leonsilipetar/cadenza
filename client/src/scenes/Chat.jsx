import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigacija from './navigacija';
import NavTop from './nav-top';
import NavSideChat from './chat/NavSideChat';
import ChatWindow from './chat/ChatWindow';
import ApiConfig from '../components/apiConfig.js';
import { Icon } from '@iconify/react';
import io from 'socket.io-client';
import logo from './../assets/logo512.png'; // Import the logo image

axios.defaults.withCredentials = true;

const socket = io('http://localhost:5000', {
  withCredentials: true, // Ensure credentials are sent
});

const Chat = () => {
  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);  // List of chats (students, mentors, groups)
  const [selectedChat, setSelectedChat] = useState(null);  // Current chat recipient
  const otvoreno = "chat";
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isNavSideChatVisible, setNavSideChatVisible] = useState(false); // State for NavSideChat visibility
  const [rasporedGumb, setRasporedGumb] = useState(false); // Define the state for the toggle button

  const sendRequest = async () => {
    const res = await axios.get(`${ApiConfig.baseUrl}/api/user`).catch((err) => console.log(err));
    if (res?.data) {
      const userData = res.data.user; // Get the user data
      setUser(userData); // Store the user data in state
      console.log("User data:", userData); // Log the user data for debugging
      // Determine if the user is a student or mentor
      const isStudent = userData.role === 'student'; // Adjust based on your user model
      const isMentor = userData.role === 'mentor'; // Adjust based on your user model
      return { isStudent, isMentor };
    }
    return { isStudent: false, isMentor: false };
  }

  useEffect(() => {
    sendRequest().then((data) => {
        fetchChats();
    });

    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on unmount
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const fetchChats = async () => {
    const { isStudent, isMentor } = await sendRequest(); // Get user type

    try {
      if (isMentor) {
        // If the user is a mentor, use the students array from the user object
        const mentorStudents = user.students.map(student => ({
          id: student.ucenikId, // Use the student ID
          name: `${student.ime} ${student.prezime}`, // Display name
        }));
        console.log("Mentor's students:", mentorStudents); // Log the students
        setChats(mentorStudents); // Set the chats to the mentor's students
      } else if (isStudent) {
        // Fetch mentors for students
        const res = await axios.get(`${ApiConfig.baseUrl}/api/students/mentors`);
        setChats(Array.isArray(res.data) ? res.data : []);
      }
    } catch (error) {
      console.error("Error fetching chats", error);
      setChats([]); // Set to an empty array on error
    }
  };

  const handleChatClick = (chatId) => {
    setSelectedChat(chatId);  // Set the selected chat for messaging
    fetchMessages(chatId); // Fetch messages for the selected chat
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/chats/${chatId}/messages`); // Adjust the endpoint as needed
      setMessages(res.data.messages); // Assuming the response contains messages
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        text: newMessage,
        timestamp: new Date().toISOString(),
        chatId: selectedChat, // Include the selected chat ID
      };
      socket.emit('sendMessage', messageData);
      setNewMessage('');
    }
  };

  const toggleNavSideChat = () => {
    setNavSideChatVisible(!isNavSideChatVisible); // Toggle visibility
    setRasporedGumb(!rasporedGumb); // Toggle the button state
  };

  return (
    <>
      <Navigacija user={user} otvoreno={"chat"} />
      <NavTop user={user} naslov={"Chat"} />
      <div className="main ">
        <div className="chat-window">
          {isNavSideChatVisible && ( // Conditionally render NavSideChat
            <NavSideChat
              chats={chats} 
              onChatClick={handleChatClick} 
            />
          )}

          
          {selectedChat ? ( // Check if a chat is selected
            <ChatWindow user={user} recipientId={selectedChat} />
          ) : (
            <div className="empty-chat">
              <img src={logo} alt="App Logo" className="chat-logo" /> {/* Display the logo */}
              <p>Select a chat to start messaging</p>
            </div>
          )}
          <div className="chat-input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="chat-input"
            />
            <button onClick={handleSendMessage} className="send-button">Send</button>
          </div>
          <div className="rl-gumb" onClick={toggleNavSideChat}>
            <Icon className="icon" icon={rasporedGumb ? "solar:list-up-minimalistic-broken" : "solar:list-down-minimalistic-broken"} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
