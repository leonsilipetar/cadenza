import React from 'react';
import NavSideChat from './NavSideChat';

const Sidebar = ({ chats, onChatClick }) => {
  return (
    <div className="w-1/4 bg-gray-200 border-r border-gray-300">
      <NavSideChat chats={chats} onChatClick={onChatClick} />
    </div>
  );
};

export default Sidebar; 