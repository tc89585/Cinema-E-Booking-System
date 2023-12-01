const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../database'); // Update the path as needed

class Showroom extends Model {}

Showroom.init({
  showroom_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  showroom_name: { type: DataTypes.STRING, unique: true }, // Add unique constraint
  seat_rows: DataTypes.INTEGER,
  seat_columns: DataTypes.INTEGER,
  seat_capacity: DataTypes.INTEGER
}, { sequelize, modelName: 'Showroom' });

module.exports = Showroom;
