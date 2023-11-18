import { useState } from "react";
import { Routes, Route, Link } from 'react-router-dom';
import '../../App.css';
import Naslovna from "../naslovna/Naslovna";
import axios from 'axios';
import Profil from "../Profile";
import Chat from "../Chat";
import Racuni from "../Racuni";
import Raspored from "../Raspored";
import { Icon } from '@iconify/react';
axios.defaults.withCredentials = true;

const Navigacija = ({ user, otvoreno}) => {
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
        <div className={activeItem === 'chat' ? 'otvoreno' : ''} onClick={() => handleItemClick('chat')}>
          <Link className="link" to="/chat">
          <Icon className="icon" icon="solar:chat-dots-broken" />
          </Link>
        </div>
        <div className={activeItem === 'racuni' ? 'otvoreno' : ''} onClick={() => handleItemClick('racuni')}>
          <Link className="link" to="/racuni">
          <Icon className="icon" icon="solar:file-check-broken" />
          </Link>
        </div>
        <div className={activeItem === 'raspored' ? 'otvoreno' : ''} onClick={() => handleItemClick('raspored')}>
          <Link className="link" to="/raspored">
          <Icon className="icon" icon="solar:calendar-broken" />
          </Link>
        </div>
        <div className={activeItem === 'profil' ? 'otvoreno' : ''} onClick={() => handleItemClick('profil')}>
          <Link className="link" to="/profil">
          <Icon className="icon" icon="solar:user-circle-broken" />
          </Link>
        </div>
      </nav>
    </header>
    <Routes>
        <Route path="/user" element={<Naslovna />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/racuni" element={<Racuni />} />
        <Route path="/raspored" element={<Raspored />} />
    </Routes>
        </>
    )
}

export default Navigacija;