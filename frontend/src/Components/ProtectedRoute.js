import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Context.js';

export const ProtectedRoute = ({ children }) => {
  const { token } = useAuth(); // Assuming token is stored in AuthContext
  const isAuthenticated = !!token;

  return isAuthenticated ? children : <Navigate to="/login" />;
};
