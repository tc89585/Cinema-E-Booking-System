import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Checkout from './Components/Checkout';
import Book from './Components/Book';
import AdminDashboard from './Components/Admin/AdminDashboard';
import Profile from './Components/Profile';
import ForgotPassword from './Components/forgotpass';
import SelectSeats from './Components/SelectSeats';
import { AuthProvider } from './Components/Context';
import { ProtectedRoute } from './Components/ProtectedRoute';
import { ErrorPage } from './Components/ErrorPage';
import OrderConfirmation from './Components/OrderConfirmation';
import Verify from './Components/Verify';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={< Verify />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route
            path="/profile/"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:movieId"
            element={
              <ProtectedRoute>
                <Book />
              </ProtectedRoute>
            }
          />
          <Route path="/forgotpassword/" element={<ForgotPassword />} />
          <Route path="/selectseat/:showtimeId" element={<SelectSeats />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
