import React from 'react';

const UserInfoComponent = ({ user }) => {
  return (
    <>
      {user && (<>
          <p>Korisničko ime: {user.korisnickoIme}</p>
          <p>Ime: {user.ime} {user.prezime}</p>
          <p>Email: {user.email}</p>
          <p>Class: {user.class}</p>
          <p>Uloga: {getUserRoles(user)}</p>
          <p>OIB: {user.oib}</p>
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
