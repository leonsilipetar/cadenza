import React, { useState, useEffect } from 'react';

const UserInfoComponent = ({ user, schoolName, mentorName }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (user && user.datumRodjenja) {
      const date = new Date(user.datumRodjenja);
      const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}.`;
      setFormattedDate(formattedDate);
    }
  }, [user]);

  return (
    <>
      {user && (
        <>
            <div className="field">
              <p className="field-name">Korisničko ime</p>
              <p className="field-data">{user.korisnickoIme}</p>
            </div>
            <div className="field">
              <p className="field-name">Email </p>
              <p className="field-data"><a href={`mailto ${user.email}`}>{user.email}</a></p>
            </div>
            <div className="field">
              <p className="field-name">Program </p>
              <p className="field-data">{user.program}</p>
            </div>
            <div className="field">
              <p className="field-name">Škola </p>
              <p className="field-data">{schoolName}</p>
            </div>
            {user.isStudent && (
              <div className="field">
                <p className="field-name">Mentor </p>
                <p className="field-data">{mentorName}</p>
              </div>
            )}
            <div className="field">
              <p className="field-name">Uloga </p>
              <p className="field-data">{getUserRoles(user)}</p>
            </div>
            <div className="field">
              <p className="field-name">OIB </p>
              <p className="field-data">{user.oib}</p>
            </div>
            <div className="field">
              <p className="field-name">Broj mobitela </p>
              <p className="field-data">{user.brojMobitela}</p>
            </div>
            <div className="field">
              <p className="field-name">Datum rođenja </p>
              <p className="field-data">{formattedDate}</p>
            </div>
            <div className="field">
              <p className="field-name">Adresa </p>
              <p className="field-data">
                {user.adresa.ulica}, {user.adresa.kucniBroj}, {user.adresa.mjesto}
              </p>
            </div>
            <div className="field">
              <p className="field-name">Pohađa teoriju </p>
              <p className="field-data">{user.pohadjaTeoriju ? 'Da' : 'Ne'}</p>
            </div>
            <div className="field">
              <p className="field-name">Napomene </p>
              <p className="field-data">{user.napomene}</p>
            </div>
            {user.maloljetniClan && (
              <>
                <div className="field">
                  <p className="field-name">Roditelj 1 </p>
                  <p className="field-data">
                    {user.roditelj1.ime} {user.roditelj1.prezime}, mobitel  {user.roditelj1.brojMobitela}
                  </p>
                </div>
                <div className="field">
                  <p className="field-name">Roditelj 2 </p>
                  <p className="field-data">
                    {user.roditelj2.ime} {user.roditelj2.prezime}, mobitel  {user.roditelj2.brojMobitela}
                  </p>
                </div>
              </>
            )}
            </>
      )}
    </>
  );
};

const getUserRoles = (user) => {
  const roles = [];
  if (user.isAdmin) roles.push('administrator');
  if (user.isMentor) roles.push('mentor');
  if (user.isStudent) roles.push('student');
  return roles.length > 0 ? roles.join(', ') : 'No roles';
};

export default UserInfoComponent;
