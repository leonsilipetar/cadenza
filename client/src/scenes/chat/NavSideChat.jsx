import React from 'react';

const NavSideChat = ({ chats, onChatClick }) => {
    console.log("chats", chats);
  return (
    <div className="raspored-lista">
      {chats.length === 0 ? (
        <div className='rl-items'>
            <div className="rl moj-raspored">Niste razgovarali</div>
        </div>
      ) : (
        <div className="rl-items">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="rl"
              onClick={() => onChatClick(chat.id)}
            >
              {chat.name} {/* Display the name of the student/mentor/group */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavSideChat; 