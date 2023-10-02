import React from 'react';

function Banner({ isLoggedIn, handleLogin, searchQuery, handleSearch, setIsLoggedIn }) {
  return (
    <div className="banner">
      <div className="header">
        <h1>Cinema E</h1>
        <div className="login">
          {isLoggedIn ? (
            <button onClick={() => setIsLoggedIn(false)}>Logout</button>
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

