import React, { useState } from 'react';
import './ManagePromotions.css';

function ManagePromotions() {
  const [promotionData, setPromotionData] = useState({
    promoCode: '',
    discountAmount: '',
    endDate: '',
    description: '',
  });
  const [message, setMessage] = useState('');
  const [showAddPromotionForm, setShowAddPromotionForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) : value;
    setPromotionData({ ...promotionData, [name]: newValue });
  };

  const handleAddPromotionClick = () => {
    setShowAddPromotionForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic here to save promotion data to your backend or state.
    // For this example, we'll just display a success message.
    setMessage('Promotion added successfully');
  };

  return (
    <div className="manage-promotions-container">
      <h2>Add a Promotion</h2>
      <button onClick={handleAddPromotionClick} className="add-promotion-button">
        Add Promotion
      </button>
      {showAddPromotionForm && (
        <form onSubmit={handleSubmit} className="promotion-form">
          <div className="form-group">
            <label>Promo Code:</label>
            <input type="text" name="promoCode" value={promotionData.promoCode} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Discount Amount:</label>
            <input type="number" name="discountAmount" value={promotionData.discountAmount} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input type="date" name="endDate" value={promotionData.endDate} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea name="description" value={promotionData.description} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <button type="submit" className="add-to-system-button">
              Add to System
            </button>
            <button type="submit" className="add-and-send-email-button">
              Add to System and Send Email
            </button>
          </div>
        </form>
      )}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
}

export default ManagePromotions;
