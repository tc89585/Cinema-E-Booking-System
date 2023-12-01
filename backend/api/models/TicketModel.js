const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../database'); // Update with the correct path to your database.js file

class Ticket extends Model {}

Ticket.init(
  {
    ticket_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Booking', key: 'booking_id' },
    },
    seat_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Seat', key: 'seat_id' },
    },
    ticket_type: { type: DataTypes.ENUM('Adult', 'Senior', 'Child') },
    price: { type: DataTypes.DECIMAL(10, 2) },
  },
  {
    sequelize,
    modelName: 'Ticket',
    tableName: 'Ticket',
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = Ticket;
