import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const Navigacija = ({ user, otvoreno, notifications = [] }) => {
  const [activeItem, setActiveItem] = useState(otvoreno);

  const handleItemClick = (item) => {
    if (item === activeItem) return;
    setActiveItem(item);
  };

  // Check if there are any unread notifications
  const hasUnreadNotifications = notifications.some(notification => notification.unread);

  return (
    <header>
      <nav>
        <div className={activeItem === 'naslovna' ? 'otvoreno' : ''} onClick={() => handleItemClick('naslovna')}>
          <Link className="link" to="/user">
            <Icon className="icon" icon="solar:music-notes-broken" />
          </Link>
        </div>
        <div className={activeItem === 'raspored' ? 'otvoreno' : ''} onClick={() => handleItemClick('raspored')}>
          <Link className="link" to="/raspored">
            <Icon className="icon" icon="solar:calendar-broken" />
          </Link>
        </div>
        <div className={activeItem === 'obavijesti' ? 'otvoreno' : ''} onClick={() => handleItemClick('obavijesti')}>
          <Link className="link" to="/obavijesti">
            <Icon className="icon" icon="solar:bell-broken" />
            {hasUnreadNotifications && <div className="dot"></div>}
          </Link>
        </div>
        <div className={activeItem === 'chat' ? 'otvoreno' : ''} onClick={() => handleItemClick('chat')}>
          <Link className="link" to="/chat">
            <Icon className="icon" icon="solar:chat-line-broken" />
          </Link>
        </div>
        <div className={activeItem === 'profil' ? 'otvoreno' : ''} onClick={() => handleItemClick('profil')}>
          <Link className="link" to="/profil">
            <Icon className="icon" icon="solar:user-circle-broken" />
          </Link>
        </div>

      </nav>
    </header>
  );
};

export default Navigacija;