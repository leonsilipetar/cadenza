import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { authActions } from '../../store/authSlice';

const NavTopAdministracija = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(authActions.logout());
    localStorage.removeItem('notificationPermissionRequested');
    navigate('/login');
  };

  return (
    <Button onClick={handleLogout}>
      Odjava
    </Button>
  );
};

export default NavTopAdministracija; 