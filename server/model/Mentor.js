const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Mentor = sequelize.define('Mentor', {
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
  // Other mentor fields...
});

// Define relationships
Mentor.associate = (models) => {
  Mentor.belongsTo(models.User, { foreignKey: 'userId' });
  Mentor.hasMany(models.Schedule, { foreignKey: 'mentorId' });
};

module.exports = Mentor;
