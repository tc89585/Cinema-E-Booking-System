import React from 'react';
import { useAuth } from './Context'; // Adjust the path to your useAuth hook
import { jwtDecode } from 'jwt-decode'; // Ensure jwtDecode is correctly imported

function Banner({ searchQuery, handleSearch }) {
  const { token, setToken } = useAuth();
  const isLoggedIn = !!token;
  const decodedToken = isLoggedIn ? jwtDecode(token) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/login';
  };

  return (
    <div className="banner">
      <div className="greeting-container">
        {isLoggedIn && decodedToken && (
          <p className="greeting">Hello, {decodedToken.firstname}</p>
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
