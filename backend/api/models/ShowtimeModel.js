const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../database'); // Update with the correct path to your database.js file

class Showtime extends Model {}

Showtime.init({
  showtime_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  movie_id: { type: DataTypes.INTEGER, references: { model: 'Movie', key: 'movie_id' } },
  showroom_id: { type: DataTypes.INTEGER, references: { model: 'Showroom', key: 'showroom_id' } },
  show_date: { type: DataTypes.DATEONLY },
  show_time: { type: DataTypes.TIME },
  duration: { type: DataTypes.INTEGER } // Duration in minutes
}, { sequelize, modelName: 'Showtime' });

module.exports = Showtime;

