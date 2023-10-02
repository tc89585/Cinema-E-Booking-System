import React, { useState } from 'react';
import './checkout.css';

function Checkout() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CreditCard');

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleZipCodeChange = (e) => {
    setZipCode(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to submit the order and proceed to the order confirmation page
    console.log('Order submitted:', {
      firstName,
      lastName,
      address,
      city,
      zipCode,
      paymentMethod,
    });
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={handleFirstNameChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={handleLastNameChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={handleCityChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Zip Code"
            value={zipCode}
            onChange={handleZipCodeChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Payment Method:</label>
          <select value={paymentMethod} onChange={handlePaymentMethodChange}>
            <option value="CreditCard">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Stripe">Stripe</option>
          </select>
        </div>
        <button type="submit" className="checkout-button">
          Confirm Order
        </button>
      </form>
    </div>
  );
}

export default Checkout;