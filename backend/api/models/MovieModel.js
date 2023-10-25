const { DataTypes, Model, Sequelize } = require('sequelize');
const sequelize = require('../../database'); // Import Sequelize

class Movie extends Model {}

Movie.init(
  {
    movie_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING,
    category: DataTypes.STRING,
    cast: DataTypes.STRING,
    director: DataTypes.STRING,
    producer: DataTypes.STRING,
    synopsis: DataTypes.STRING,
    reviews: DataTypes.STRING,
    trailer_url: DataTypes.STRING,
    mpaa_rating: DataTypes.STRING,
    show_date: DataTypes.DATE,
    show_time: DataTypes.TIME,
  },
  {
    sequelize,
    modelName: 'Movie',
    tableName: 'Movie',
    timestamps: false,
  }
);

module.exports = Movie;
