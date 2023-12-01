const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../../database');
class PaymentInformation extends Model {}

PaymentInformation.init(
  {
    payment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User', // This should match the table name of the User model
        key: 'user_id',
      }
    },
    card_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    card_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    expiration_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'PaymentInformation',
    tableName: 'PaymentInformation', 
    timestamps: false 
  }
);

module.exports = PaymentInformation;
