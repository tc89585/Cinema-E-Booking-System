const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../../database');
const Booking = require('./BookingModel'); // Adjust the path as necessary

class User extends Model {}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
    email: DataTypes.STRING(50),
    firstname: DataTypes.STRING(50),
    lastname: DataTypes.STRING(50),
    password: DataTypes.STRING(255),
    billing_address: DataTypes.STRING(50),
    account_status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
    is_subscribed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'User',
    timestamps: false,
  }
);
module.exports = User;
