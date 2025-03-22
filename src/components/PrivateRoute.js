import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check if user is logged in
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  // If not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If logged in, render the protected component
  return children;
};

export default PrivateRoute;
