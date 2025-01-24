import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import '../../App.css';

const NavigacijaAdmin = ({ otvoreno }) => {
  return (
    <header>
      <nav>
        <div className={otvoreno === 'naslovna' ? 'otvoreno' : ''}>
          <Link className="link" to="/admin">
            <Icon className="icon" icon="solar:home-2-broken" />
            <p>Naslovna</p>
          </Link>
        </div>
        <div className={otvoreno === 'korisnici' ? 'otvoreno' : ''}>
          <Link className="link" to="/korisnici">
            <Icon className="icon" icon="solar:users-group-rounded-broken" />
            <p>Učenici</p>
          </Link>
        </div>
        <div className={otvoreno === 'mentori' ? 'otvoreno' : ''}>
          <Link className="link" to="/mentori">
            <Icon className="icon" icon="solar:user-rounded-broken" />
            <p>Mentori</p>
          </Link>
        </div>
        <div className={otvoreno === 'racuni' ? 'otvoreno' : ''}>
          <Link className="link" to="/racuni-admin">
            <Icon className="icon" icon="solar:bill-list-broken" />
            <p>Računi</p>
          </Link>
        </div>
        <div className={otvoreno === 'classrooms' ? 'otvoreno' : ''}>
          <Link className="link" to="/classrooms">
            <Icon className="icon" icon="solar:buildings-2-broken" />
            <p>Učionice</p>
          </Link>
        </div>
        <div className={otvoreno === 'delete' ? 'otvoreno' : ''}>
          <Link className="link" to="/delete">
            <Icon className="icon" icon="solar:trash-bin-trash-broken" />
            <p>Brisanje</p>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default NavigacijaAdmin;