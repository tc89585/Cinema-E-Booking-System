import React from 'react';
import { Link } from 'react-router-dom';

export const ErrorPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/">Go Back Home</Link>
    </div>
  );
};
