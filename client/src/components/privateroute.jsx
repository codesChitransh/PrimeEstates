// components/PrivateRoute.js
import React from 'react';
import { Outlet,Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const privateRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);

  return (currentUser)?<Outlet/>:<Navigate to="/sign-in"/>
};

export default privateRoute;
