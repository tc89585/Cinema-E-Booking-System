import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home'; 
import Login from './Components/Login'; 
import Checkout from './Components/Checkout'; 
import Book from './Components/Book'; 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/Book" element={<Book/>} />
      </Routes>
    </Router>
  );
}

export default App;


