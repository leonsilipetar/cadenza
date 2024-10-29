import React, { useState, useEffect } from 'react';

const UserInfoComponent = ({ user, schoolName, mentorName }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (user && user.datumRodjenja) {
      // Assuming user.datumRodjenja is a string in ISO 8601 format
      const isoDate = user.datumRodjenja;
      
      // Create a Date object from the ISO string
      const date = new Date(isoDate);
      
      // Extract day, month, and year components
      const day = date.getDate();
      const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
      const year = date.getFullYear();
      
      // Format the date as dd/mm/yyyy
      const formattedDate = `${day}.${month}.${year}.`;
      
      // Update the state with the formatted date
      setFormattedDate(formattedDate);
    }
  }, [user]);

  return (
    <>
      {user && (
        <>
          <p>Korisničko ime (ime i prezime): {user.korisnickoIme}</p>
          <p>Email: {user.email}</p>
          <p>Program: {user.program}</p>
          <p>Škola: {schoolName}</p>
          <p>Mentor: {mentorName}</p>
          <p>Uloga: {getUserRoles(user)}</p>
          <p>OIB: {user.oib}</p>
          <p>Broj mobitela: {user.brojMobitela}</p>
          <p>Datum rođenja: {formattedDate}</p>
          <p>Adresa: {user.adresa.ulica}, {user.adresa.kucniBroj}, {user.adresa.mjesto}</p>
          <p>Pohađa teoriju: {user.pohadjaTeoriju ? 'Da' : 'Ne'}</p>
          <p>Napomene: {user.napomene}</p>
          {user.maloljetniClan && 
            <>
              <p>Roditelj 1: {user.roditelj1.ime} {user.roditelj1.prezime}, mobitel: {user.roditelj1.brojMobitela}</p>
              <p>Roditelj 2: {user.roditelj2.ime} {user.roditelj2.prezime}, mobitel: {user.roditelj2.brojMobitela}</p>
            </>
          }
        </>
      )}
    </>
  );
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

  return roles.length > 0 ? roles.join(', ') : 'No roles';
};

export default UserInfoComponent;
