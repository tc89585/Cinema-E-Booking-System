const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../database'); // Update with the correct path to your database.js file

class Seat extends Model {}

Seat.init({
  seat_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  showroom_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Showroom', key: 'showroom_id' } },
  seat_number: { type: DataTypes.STRING, allowNull: false }, // To store 'A1', 'B2', 'C3', etc.
  is_booked: { type: DataTypes.BOOLEAN, defaultValue: false }
}, 
{ sequelize, modelName: 'Seat' });

module.exports = Seat;