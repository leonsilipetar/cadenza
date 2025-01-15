const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  // Schedule fields...
});

// Define relationships
Schedule.associate = (models) => {
  Schedule.belongsTo(models.User, { foreignKey: 'userId' });
};

module.exports = Schedule; 