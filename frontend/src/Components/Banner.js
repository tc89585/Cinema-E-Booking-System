// Banner.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Context';
import { jwtDecode } from 'jwt-decode';

function Banner({ searchQuery, handleSearch }) {
  const { token, setToken } = useAuth();
  const isLoggedIn = !!token;
  const decodedToken = isLoggedIn ? jwtDecode(token) : null;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/login';
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="banner">
      <div className="greeting-container">
        {isLoggedIn && decodedToken && (
          <p className="greeting">Hello, {decodedToken.firstname}</p>
        )}
      </div>

      <div className="profile">
        {isLoggedIn ? (
          <button onClick={handleEditProfile} className="edit-profile-button">
            Edit Profile
          </button>
        ) : (
          <button onClick={handleLogin}>Edit Profile</button>
        )}
      </div>

      <div className="login">
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
      </div>

      <div className="header">
        <h1>Bulldawg Theater</h1>
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
