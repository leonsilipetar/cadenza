import { useState } from "react";
import { Routes, Route, Link } from 'react-router-dom';
import '../../App.css';
import Naslovna from "../naslovna/Naslovna";
import axios from 'axios';
import Profil from "../Profile";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatIcon from '@mui/icons-material/Chat';
import PaymentsIcon from '@mui/icons-material/Payments';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Chat from "../Chat";
import Racuni from "../Racuni";
import Raspored from "../Raspored";
axios.defaults.withCredentials = true;

const Navigacija = ({ user, otvoreno}) => {
    const [activeItem, setActiveItem] = useState(otvoreno);

    const handleItemClick = (item) => {
      setActiveItem(item === activeItem ? null : item);
    };
    return (
        <>
        <header>
      <nav>
        <div className={activeItem === 'naslovna' ? 'otvoreno' : ''} onClick={() => handleItemClick('naslovna')}>
          <Link className="link" to="/user">
            <MusicNoteIcon fontSize="large"></MusicNoteIcon>
          </Link>
        </div>
        <div className={activeItem === 'chat' ? 'otvoreno' : ''} onClick={() => handleItemClick('chat')}>
          <Link className="link" to="/chat">
            <ChatIcon fontSize="large"/>
          </Link>
        </div>
        <div className={activeItem === 'racuni' ? 'otvoreno' : ''} onClick={() => handleItemClick('racuni')}>
          <Link className="link" to="/racuni">
            <PaymentsIcon fontSize="large"/>
          </Link>
        </div>
        <div className={activeItem === 'raspored' ? 'otvoreno' : ''} onClick={() => handleItemClick('raspored')}>
          <Link className="link" to="/raspored">
            <CalendarMonthIcon fontSize="large" />
          </Link>
        </div>
      </nav>
      <nav>
        <div className={activeItem === 'profil' ? 'otvoreno' : ''} onClick={() => handleItemClick('profil')}>
          <Link className="link" to="/profil">
            <AccountCircleIcon fontSize="large"/>
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