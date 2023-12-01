const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../database'); // Update with the correct path to your database.js file
const User = require('./UserModel'); // Adjust the path as necessary



class Booking extends Model {}

Booking.init({
  booking_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, references: { model: 'User', key: 'user_id' } },
  showtime_id: { type: DataTypes.INTEGER, references: { model: 'Showtime', key: 'showtime_id' } },
  booking_date: { type: DataTypes.DATEONLY },
  total_price: { type: DataTypes.DECIMAL(10, 2) }
}, { sequelize, modelName: 'Booking' });

module.exports = Booking;
