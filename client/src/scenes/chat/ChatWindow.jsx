import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApiConfig from '../../components/apiConfig.js';

const ChatWindow = ({ user, recipientId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (recipientId) {
      fetchMessages(recipientId);
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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow">
        {messages.map((msg, index) => (
          <div key={index} className={`message p-2 rounded ${msg.senderId === user._id ? "bg-green-200 self-end" : "bg-gray-200 self-start"}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex items-center mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button onClick={handleSendMessage} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
