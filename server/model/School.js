const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const School = sequelize.define('School', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Add other fields as necessary
});

// Define relationships if needed
School.associate = (models) => {
  School.hasMany(models.User, { foreignKey: 'schoolId' }); // Assuming Users have a schoolId
  School.hasMany(models.Mentor, { foreignKey: 'schoolId' }); // Assuming Mentors have a schoolId
};

module.exports = School;
