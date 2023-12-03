import React from 'react';
import { useAuth } from './Context.js';

function Banner({ searchQuery, handleSearch }) {
  const { token, setToken } = useAuth();

  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/login';
  };

  return (
    <div className="banner">
      <div className="header">
        <h1>Cinema E</h1>
        <div className="login">
          {isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <button onClick={handleLogin}>Login</button>
          )}
        </div>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
}

export default Banner;
