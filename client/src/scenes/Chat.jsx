import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Navigacija from './navigacija';
import NavTop from './nav-top';
import NavSideChat from './chat/NavSideChat';
import ChatContainer from './chat/ChatContainer';
import ApiConfig from '../components/apiConfig.js';
import { Icon } from '@iconify/react';
import io from 'socket.io-client';

axios.defaults.withCredentials = true;

const socket = io('https://musicartincubator-cadenza.onrender.com', {
  withCredentials: true,
});

const Chat = ({ setIsChatWindowOpen }) => {
  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatGumb, setChatGumb] = useState(true);
  const [selectedChatName, setSelectedChatName] = useState('Chat');

  const fetchChats = useCallback(async () => {
    try {
      if (user?.isMentor) {
        const mentorStudents = user.students.map(student => ({
          id: student.ucenikId,
          name: `${student.ime} ${student.prezime}`,
        }));
        console.log("Mentor students:", mentorStudents);
        setChats(mentorStudents);
      } else if (user?.isStudent) {
        const mentorIds = user.mentors;
        const mentorsData = await Promise.all(
          mentorIds.map(async (mentorId) => {
            const res = await axios.get(`${ApiConfig.baseUrl}/api/korisnik/${mentorId}`);
            const mentor = res.data;
            return {
              id: mentor._id,
              name: `${mentor.ime} ${mentor.prezime}`,
            };
          })
        );
        setChats(mentorsData);
      }
    } catch (error) {
      console.error("Error fetching chats", error);
      setChats([]);
    }
  }, [user]);

  useEffect(() => {
    sendRequest();
    
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some(
          m => m._id === message._id || 
          (m.senderId === message.senderId && 
           m.timestamp === message.timestamp && 
           m.text === message.text)
        );
        if (!messageExists) {
          return [...prevMessages, message];
        }
        return prevMessages;
      });
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user, fetchChats]);

  useEffect(() => {
    setIsChatWindowOpen(true);
    return () => setIsChatWindowOpen(false);
  }, [setIsChatWindowOpen]);

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

  const handleChatClick = (chatId, chatName) => {
    setSelectedChat(chatId);
    setSelectedChatName(chatName);
    fetchMessages(chatId);
    setChatGumb(false);
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/messages/${chatId}`);
      console.log("Fetched messages:", res.data);
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("Error fetching messages", error);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const messageData = {
          text: newMessage,
          senderId: user._id,
          recipientId: selectedChat,
          timestamp: new Date().toISOString(),
        };

        const response = await axios.post(`${ApiConfig.baseUrl}/api/messages`, messageData);
        const savedMessage = response.data;

        setMessages(prevMessages => [...prevMessages, savedMessage]);
        
        socket.emit('sendMessage', savedMessage);
        
        setNewMessage('');
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleItemClickChatGumb = () => {
    setChatGumb(prevValue => !prevValue);
  };

  return (
    <>
      
      <NavTop user={user} naslov={selectedChatName} chat={true} />
      <Navigacija user={user} otvoreno="chat" chat={!chatGumb} />
      <div className="main">
        <div className="flex items-center justify-center pt-20 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl h-[calc(100vh-8rem)]">
            <div className="flex h-full rounded-lg overflow-hidden relative">
              <div className="rl-gumb chat-tgl-btn" onClick={handleItemClickChatGumb}>
                <Icon 
                  className="icon" 
                  icon={chatGumb ? "" : "solar:arrow-left-broken"} 
                />
              </div>
              <div className={`chat-nav-container ${chatGumb ? 'open' : ''}`}>
                <NavSideChat chats={chats} onChatClick={handleChatClick} />
              </div>
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