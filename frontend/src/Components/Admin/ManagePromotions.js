import React, { useState, useEffect } from "react";
import "../Styles/ManagePromotions.css";
import { useAuth } from "../Context";

function ManagePromotions() {
  const [promotionData, setPromotionData] = useState({
    discount_rate: "",
    endDate: "",
    description: "",
  });
  const [promotions, setPromotions] = useState([]);
  const [message, setMessage] = useState("");
  const [showAddPromotionForm, setShowAddPromotionForm] = useState(false);
  const [promotionIdToDelete, setPromotionIdToDelete] = useState('');

  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:8080/admins";
  const { token } = useAuth();

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch(`${API_URL}/getPromotions`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' // It's good practice to set this as well
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setPromotions(data.promotions);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? parseFloat(value) : value;
    setPromotionData({ ...promotionData, [name]: newValue });
  };

  const handleAddPromotionClick = () => {
    setShowAddPromotionForm(true);
  };

  const deletePromotion = async (id) => {
    if (!id) {
      alert('Please enter a promotion ID');
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/deletePromotion/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });      
      const data = await response.json();
      if (data.success) {
        setMessage('Promotion deleted successfully');
        // Optionally, clear the input field after successful deletion
        setPromotionIdToDelete('');
      } else {
        setMessage('Error deleting promotion');
      }
    } catch (error) {
      setMessage('Error deleting promotion');
      console.error('Error:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/createPromotion`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(promotionData),
      });
      const data = await response.json();
      if (data.message) {
        setMessage("Promotion created and emails sent successfully");
      } else {
        setMessage("Error creating promotion");
      }
    } catch (error) {
      setMessage("Error creating promotion");
      console.error("Error:", error);
    }
  };

  return (
    <div className="manage-promotions-container">
      <h2>Add a Promotion</h2>
      <button
        onClick={handleAddPromotionClick}
        className="add-promotion-button"
      >
        Add Promotion
      </button>
      {showAddPromotionForm && (
        <form onSubmit={handleSubmit} className="promotion-form">
          <div className="form-group">
            <label>Discount Amount:</label>
            <input
              type="number"
              name="discount_rate"
              value={promotionData.discount_rate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              name="endDate"
              value={promotionData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={promotionData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <button type="submit" className="add-and-send-email-button">
              Email Promotion
            </button>
          </div>
          <div className="delete-promotion-container">
      <input
        type="text"
        placeholder="Enter Promotion ID"
        value={promotionIdToDelete}
        onChange={(e) => setPromotionIdToDelete(e.target.value)}
      />
      <button onClick={() => deletePromotion(promotionIdToDelete)}>
        Delete Promotion
      </button>
    </div>
        </form>
      )}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
}

export default ManagePromotions;
