import React, { createContext, useContext, useState } from 'react';

// Create a context for managing authentication
const AuthContext = createContext();

// Create an AuthProvider component to wrap your entire application
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Other authentication-related state and functions can be added here

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to access the authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};

