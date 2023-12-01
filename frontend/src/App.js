import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Login from './Components/Login';
import Checkout from './Components/Checkout';
import Book from './Components/Book';
import AdminDashboard from './Components/Admin/AdminDashboard';
import Profile from './Components/Profile';
import ForgotPassword from './Components/forgotpass';
import Showtimes from './Components/Showtimes';
import SelectSeats from './Components/SelectSeats';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/login"
          element={
            <Login
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/book" element={<Book />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/profile/" element={<Profile />} />
        <Route path="/forgotpassword/" element={<ForgotPassword />} />
        <Route path="/showtime/" element={<Showtimes />} />
        <Route path="/selectseat/" element={<SelectSeats />} />
      </Routes>
    </Router>
  );
}

export default App;