import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const Navigacija = ({ user, otvoreno }) => {
  const [activeItem, setActiveItem] = useState(otvoreno);

  const handleItemClick = (item) => {
    // If the clicked item is the same as the active item, return early
    if (item === activeItem) {
      return;
    }

    setActiveItem(item);
  };

  return (
    <>
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
            </Link>
          </div>
          <div className={activeItem === 'profil' ? 'otvoreno' : ''} onClick={() => handleItemClick('profil')}>
            <Link className="link" to="/profil">
              <Icon className="icon" icon="solar:user-circle-broken" />
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navigacija;