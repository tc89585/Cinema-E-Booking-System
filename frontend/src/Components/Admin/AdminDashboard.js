import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import ManageMovies from './ManageMovies';
import ManageUsers from './ManageUsers';
import ManagePromotions from './ManagePromotions';
import '../Styles/AdminDashboard.css';
import ManageShowTimes from './ManageShowtimes';
import CreateAdminUser from './CreateAdmin';

function AdminDashboard() {
    return (
      <div className="admin-container">
        <header className="admin-header">
          <nav>
            <ul className="admin-menu">
              <li>
              <Link to="/admin/movies">Manage Movies</Link>
              </li>
              <li>
                <Link to="/admin/users">Manage Users</Link>
              </li>
              <li>
                <Link to="/admin/promotions">Manage Promotions</Link>
              </li>
              <li>
                <Link to="/admin/showtimes">Manage Showtimes</Link>
              </li>
              <li>
                <Link to="/admin/createAdmin">Create Admins</Link>
              </li>
            </ul>
          </nav>
        </header>
  
        <Routes>
          <Route path="movies" element={<ManageMovies />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="promotions" element={<ManagePromotions/>} />
          <Route path="showtimes" element={<ManageShowTimes/>} />
          <Route path="createAdmin" element={<CreateAdminUser/>} />

        </Routes>
      </div>
    );
  }

  

export default AdminDashboard;

