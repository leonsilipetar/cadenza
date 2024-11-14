import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig.js';

const ChatWindow = ({ user, recipientId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (recipientId) {
      fetchMessages(recipientId);  // Fetch messages when a recipient is selected
    }
  }, [recipientId]);

  const fetchMessages = async (recipientId) => {
    try {
      const res = await axios.get(`${ApiConfig.baseUrl}/api/messages/${recipientId}`);
      setMessages(res.data.messages);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    const messageData = {
      senderId: user._id,
      recipientId,
      text: newMessage,
    };
    try {
      await axios.post(`${ApiConfig.baseUrl}/api/messages`, messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.senderId === user._id ? "sent" : "received"}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
