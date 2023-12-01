const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../database'); // Update with the correct path to your database.js file

class Promotion extends Model {}

Promotion.init(
  {
    promotion_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: { type: DataTypes.STRING },
    discount: { type: DataTypes.DECIMAL(5, 2) },
    start_date: { type: DataTypes.DATEONLY },
    end_date: { type: DataTypes.DATEONLY },
  },
  {
    sequelize,
    modelName: 'Promotion',
    tableName: 'Promotion',
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Promotion;
