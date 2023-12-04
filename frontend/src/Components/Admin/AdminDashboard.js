

import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import ManageMovies from './ManageMovies';
import ManageUsers from './ManageUsers';
import ManagePromotions from './ManagePromotions';
import '../Styles/AdminDashboard.css';

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
            </ul>
          </nav>
        </header>
  
        <Routes>
          <Route path="movies" element={<ManageMovies />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="promotions" element={<ManagePromotions />} />
        </Routes>
      </div>
    );
  }

  

export default AdminDashboard;

