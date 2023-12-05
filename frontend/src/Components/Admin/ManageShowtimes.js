import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/ManageShowtimes.css'
import { useAuth } from "../Context";

const ManageShowTimes = () => {
  const [formData, setFormData] = useState({
    title: '',
    show_date: '',
    show_time: '',
    duration: ''
  });
  const [showtimeId, setShowtimeId] = useState(''); // For update and delete
  const [message, setMessage] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/admins";
  const { token } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowtimeIdChange = (e) => {
    setShowtimeId(e.target.value);
  };

  const addShowtime = async () => {
    try {
      const response = await axios.post(`${API_URL}/addShowtime`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' // This sets the content type
        },
      });
      setMessage('Showtime added successfully');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setMessage('Error adding showtime');
    }
  };

  const deleteShowtime = async () => {
    try {
      const response = await axios.delete(`${API_URL}/deleteShowtime/${showtimeId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // This sets the content type
          },
        });
      setMessage('Showtime deleted successfully');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setMessage('Error deleting showtime');
    }
  };

  return (
    <div className="manage-showtimes-container">
      <h2>Add Showtime</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Form inputs for adding a showtime */}
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Show Date:</label>
          <input
            type="date"
            name="show_date"
            value={formData.show_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Show Time:</label>
          <input
            type="time"
            name="show_time"
            value={formData.show_time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Duration:</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>
        <button onClick={addShowtime} className="submit-button">Add Showtime</button>
      </form>

      <h2>Delete Showtime</h2>
      <input
        type="text"
        placeholder="Enter Showtime ID"
        value={showtimeId}
        onChange={handleShowtimeIdChange}
      />
      <button onClick={deleteShowtime} className="delete-button">Delete Showtime</button>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ManageShowTimes;
