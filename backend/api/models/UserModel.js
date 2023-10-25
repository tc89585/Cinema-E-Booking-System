const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../../database');

class User extends Model {}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role: DataTypes.STRING(50),
    email: DataTypes.STRING(50),
    firstname: DataTypes.STRING(50),
    lastname: DataTypes.STRING(50),
    password: DataTypes.STRING(50),
    account_status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
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
