const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users', // Assuming Users is the table for users
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.FLOAT, // Assuming the amount is a decimal value
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  // Add other fields as necessary
});

// Define relationships if needed
Invoice.associate = (models) => {
  Invoice.belongsTo(models.User, { foreignKey: 'userId' });
};

module.exports = Invoice;
