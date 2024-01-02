import { useState } from "react";
import { Routes, Route, Link } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';
import Profil from "../Profile";
import { Icon } from '@iconify/react';
import Admin from "./Admin";
import RacuniAdmin from "./RacuniAdmin";
axios.defaults.withCredentials = true;

const NavigacijaAdmin = ({ user, otvoreno}) => {
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
          <Link className="link" to="/admin">
          <Icon className="icon" icon="solar:music-notes-broken" />
          </Link>
          <p>Naslovna</p>
        </div>
        <div className={activeItem === 'korisnici' ? 'otvoreno' : ''} onClick={() => handleItemClick('korisnici')}>
          <Link className="link" to="/korisnici">
          <Icon className="icon" icon="solar:users-group-rounded-broken" />
          </Link>
          <p>Učenici</p>
        </div>
        <div className={activeItem === 'mentori' ? 'otvoreno' : ''} onClick={() => handleItemClick('mentori')}>
          <Link className="link" to="/mentori">
          <Icon className="icon" icon="solar:users-group-rounded-broken" />
          </Link>
          <p>Mentori</p>
        </div>
        <div className={activeItem === 'racuni' ? 'otvoreno' : ''} onClick={() => handleItemClick('racuni')}>
          <Link className="link" to="/racuni-admin">
          <Icon className="icon" icon="solar:file-check-broken" />
          </Link>
          <p>Racuni</p>
        </div>
      </nav>
    </header>
    <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/korisnici" element={<Profil />} />
        <Route path="/racuni-admin" element={<RacuniAdmin />} />
        <Route path="/mentori" element={<Profil />} />
    </Routes>
        </>
    )
}

export default NavigacijaAdmin;