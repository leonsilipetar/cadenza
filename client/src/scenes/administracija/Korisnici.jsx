import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import NavigacijaAdmin from './NavigacijaAdmin';
import NavTopAdministracija from './NavtopAdministracija';
import { Icon } from '@iconify/react';


axios.defaults.withCredentials = true;
const Korisnici = () => {

  const [odabranoDodajKorisnika, setOdabranoDodajKOrisnika] = useState(false);
  const [korisnici, setKorisnici] = useState([]);
  const [user, setUser] = useState();
  const [isHovered, setIsHovered] = useState(false);
  const otvoreno = "korisnici";
  const sendRequestUsers = async () => {
    const res = await axios.get('http://localhost:5000/api/korisnici', {
        withCredentials: true
    }).catch((err) => console.log(err));
    const data = await res.data;
    return data;
}

  const refreshToken = async () => {
      const res = await axios
        .get("http://localhost:5000/api/refresh", {
          withCredentials: true,
        })
        .catch((err) => console.log(err));
  
      const data = await res.data;
      return data;
    };
    const sendRequest = async () => {
      const res = await axios.get('http://localhost:5000/api/profil', {
          withCredentials: true
      }).catch((err) => console.log(err));
      const data = await res.data;
      return data;
  }

  const [inputs, setInputs] = useState({
    korisnickoIme: "",
    email: "",
    program: "",
    isAdmin: false,
    isMentor: false,
    isStudent: false,
    oib: ""
});
const handleChange = (e) => {
    setInputs((prev) => ({
        ...prev,
    [e.target.name]: e.target.value,
    }));
};
const dodajKorisnika = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/signup', {
      korisnickoIme: inputs.korisnickoIme,
      email: inputs.email,
      program: inputs.program,
      isAdmin: inputs.isAdmin,
      isMentor: inputs.isMentor,
      isStudent: inputs.isStudent,
      oib: inputs.oib,
    });

    const data = res.data; // Assuming the response has a data property
    return data;
  } catch (err) {
    console.error(err);
    return null; // Return a default value or handle the error in some way
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await dodajKorisnika();

  if (result) {
    // Handle the successful result, e.g., show a success message
    console.log('User registered successfully:', result);
  } else {
    // Handle the case where registration failed or data is undefined
    console.log('User registration failed.');
  }
};
  
    
  const getUserRoles = (user) => {
    const roles = [];
  
    if (user.isAdmin) {
      roles.push('administrator');
    }
  
    if (user.isMentor) {
      roles.push('mentor');
    }
  
    if (user.isStudent) {
      roles.push('student');
    }
  
    return roles.length > 0 ? roles.join(', ') : 'bez uloge';
  };


    useEffect(() => {

      
        sendRequestUsers().then((data) => {
          setKorisnici(data)
        });
        sendRequest().then((data) => {
          setUser(data.user)
        });
        let interval = setInterval(() => {
          refreshToken().then((data) => {
            setUser(data.user)
          });
        }, 1000 * 28 * 60 * 60);
  
        return () => clearInterval(interval);

    }, []);
    
    return (
      <>
      <NavigacijaAdmin  otvoreno={otvoreno}/>
      <NavTopAdministracija />
      {odabranoDodajKorisnika && 
        <div className="popup">
        <form onSubmit={handleSubmit}>
        <input 
        className="input-login-signup" 
        value={inputs.korisnickoIme} 
        onChange={handleChange}
        type="text" 
        name="korisnickoIme" 
        id="kor-ime" 
        placeholder="korisničko ime"/>

        <input 
        className="input-login-signup" 
        value={inputs.email} 
        onChange={handleChange}
        type="email" 
        name="email" 
        id="kor-email" 
        placeholder="e-mail adresa"/>
        
        <input 
        className="input-login-signup" 
        value={inputs.program} 
        onChange={handleChange}
        type="text" 
        name="program" 
        id="kor-program" 
        placeholder="program"/>
<div>
  <div><input
  className="input-login-signup"
  type="checkbox"
  checked={inputs.isAdmin}
  onChange={(e) => setInputs({ ...inputs, isAdmin: e.target.checked })}
/>
<label htmlFor="isAdmin">Admin</label></div>

<div><input
  className="input-login-signup"
  type="checkbox"
  checked={inputs.isMentor}
  onChange={(e) => setInputs({ ...inputs, isMentor: e.target.checked })}
/>
<label htmlFor="isMentor">Mentor</label></div>

<div><input
  className="input-login-signup"
  type="checkbox"
  checked={inputs.isStudent}
  onChange={(e) => setInputs({ ...inputs, isStudent: e.target.checked })}
/>
<label htmlFor="isStudent">Student</label></div>


</div>
        <input 
        className="input-login-signup" 
        value={inputs.oib} 
        onChange={handleChange}
        type="text" 
        name="oib" 
        id="kor-oib" 
        placeholder="OIB"/>

        <button className='gumb' type="submit">Dodaj</button>
        <button className='gumb' onClick={() => setOdabranoDodajKOrisnika(false)}>Odustani</button>
        </form>
        </div>
      }
      <div className="main">
      <div onClick={() => setOdabranoDodajKOrisnika(true)}>Dodaj korisnika</div>
  <div className="tablica">
    <div className='tr naziv'>
      <div className='th'>Korisničko ime</div>
      <div className='th'>email</div>
      <div className='th'>program</div>
      <div className='th'>uloga</div>
      <div className='th'>oib</div>
      <div></div>
    </div>
              {korisnici?.length > 0 ? (
  korisnici.map(korisnik => (
    <div className={`tr redak ${isHovered ? 'hovered' : ''}`}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}>
      <div className='th'>{korisnik.korisnickoIme}</div>
      <div className='th'>{korisnik.email}</div>
      <div className='th'>{korisnik.class}</div>
      <div className='th'>{getUserRoles(korisnik)}</div>
      <div className='th'>{korisnik.oib}</div>
      <div className='th'>
        <div className={`action-btn btn abEdit ${isHovered ? 'hovered' : ''}`} data-text="uredi">
          <Icon icon="solar:pen-2-broken" fontSize="large" />
        </div>
        <div className={`action-btn btn abDelete ${isHovered ? 'hovered' : ''}`} data-text="obriši">
          <Icon icon="solar:trash-bin-trash-broken" fontSize="large" />
        </div>
      </div>
    </div>
  ))
) : (
  <div className="karticaZadatka">
      <p>Nema korisnika u bazi!</p>
  </div>
)}
            </div>
</div>
      </>
    )
}

export default Korisnici;