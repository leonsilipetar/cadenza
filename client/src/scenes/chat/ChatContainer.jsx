import React from 'react';

const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatContainer = ({ messages = [], newMessage, setNewMessage, handleSendMessage, selectedChat, user }) => {
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
          </div>
          <div className="chat-input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="chat-input"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button onClick={handleSendMessage} className="send-button">
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-chat">
          <p>Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
};

export default ChatContainer; 