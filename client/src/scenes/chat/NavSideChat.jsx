import React from 'react';

const NavSideChat = ({ chats, onChatClick }) => {
    console.log("chats", chats);
  return (
    <div className="raspored-lista">
      {chats.length === 0 ? (
        <div className="rl-items ">
          <div className="rl">Niste razgovarali</div>
        </div>
      ) : (
        <div className="rl-items">
          <div className="rl moj-raspored">
           Razgovori
          </div>
          {chats.map((chat) => (
            <div
              className="rl"
              key={chat.id}
              onClick={() => onChatClick(chat.id)}
            >
              {chat.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavSideChat; 