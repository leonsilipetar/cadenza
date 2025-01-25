import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigacija from './navigacija';
import NavTop from './nav-top';
import NavSideChat from './chat/NavSideChat';
import ChatContainer from './chat/ChatContainer';
import ApiConfig from '../components/apiConfig.js';
import { Icon } from '@iconify/react';
import io from 'socket.io-client';

axios.defaults.withCredentials = true;

const socket = io('http://localhost:5000', {
  withCredentials: true,
});

const Chat = () => {
  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatGumb, setChatGumb] = useState(true);

  useEffect(() => {
    sendRequest();
    
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  const sendRequest = async () => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/user`);
      if (res?.data) {
        const userData = res.data.user;
        setUser(userData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchChats = async () => {
    try {
      if (user.isMentor) {
        const mentorStudents = user.students.map(student => ({
          id: student.ucenikId,
          name: `${student.ime} ${student.prezime}`,
        }));
        console.log("Mentor students:", mentorStudents);
        setChats(mentorStudents);
      } else if (user.isStudent) {
        const res = await axios.get(`${ApiConfig.baseUrl}/api/students/mentors`);
        const mentorsList = res.data.map(mentor => ({
          id: mentor._id,
          name: `${mentor.ime} ${mentor.prezime}`,
        }));
        setChats(mentorsList);
      }
    } catch (error) {
      console.error("Error fetching chats", error);
      setChats([]);
    }
  };

  const handleChatClick = (chatId) => {
    setSelectedChat(chatId);
    fetchMessages(chatId);
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/chats/${chatId}/messages`);
      setMessages(res.data.messages);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        text: newMessage,
        timestamp: new Date().toISOString(),
        chatId: selectedChat,
      };
      socket.emit('sendMessage', messageData);
      setNewMessage('');
    }
  };

  const handleItemClickChatGumb = () => {
    setChatGumb(prevValue => !prevValue);
  };

  return (
    <>
      <Navigacija user={user} otvoreno="chat" />
      <NavTop user={user} naslov="Chat" />
      <div className="main">
        <div className="flex items-center justify-center pt-20 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl h-[calc(100vh-8rem)]">
            <div className="flex h-full rounded-lg overflow-hidden relative">
              <div className="rl-gumb" onClick={handleItemClickChatGumb}>
                <Icon 
                  className="icon" 
                  icon={chatGumb ? "solar:list-up-minimalistic-broken" : "solar:list-down-minimalistic-broken"} 
                />
              </div>
              {chatGumb && (
                <div className="w-1/4 bg-gray-200 border-r border-gray-300">
                  <NavSideChat chats={chats} onChatClick={handleChatClick} />
                </div>
              )}
              <ChatContainer 
                messages={messages} 
                newMessage={newMessage} 
                setNewMessage={setNewMessage} 
                handleSendMessage={handleSendMessage} 
                selectedChat={selectedChat} 
                user={user} 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
