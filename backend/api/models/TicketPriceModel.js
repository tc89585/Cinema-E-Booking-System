const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../database'); // Update this path

class Ticketprice extends Model {}

Ticketprice.init(
  {
    ticket_type: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    ticket_price: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'Ticketprice',
    tableName: 'Ticketprice',
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Ticketprice;
