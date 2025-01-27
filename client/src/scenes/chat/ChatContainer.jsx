import React, { useEffect, useRef } from 'react';

const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatContainer = ({ messages = [], newMessage, setNewMessage, handleSendMessage, selectedChat, user }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll when messages change

  return (
    <div className="chat-container">
      {selectedChat ? (
        <div className="chat-window">
          <div className="chat-messages">
            {Array.isArray(messages) && messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.senderId === user?._id ? "sent" : "received"}`}
              >
                <div className="message-header">
                  <time className="message-time">
                    {formatMessageTime(message.timestamp)}
                  </time>
                </div>
                <div className="message-content">
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* Invisible element at the bottom */}
          </div>
          <div className="chat-input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Pošalji poruku..."
              className="chat-input"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button onClick={handleSendMessage} className="send-button">
              Pošalji
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-chat">
          <p>Odaberi razgovor s liste</p>
        </div>
      )}
    </div>
  );
};

export default ChatContainer; 