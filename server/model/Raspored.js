const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Raspored = sequelize.define('Raspored', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ucenikId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users', // Assuming Users is the table for students
      key: 'id',
    },
  },
  mentorId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Mentors', // Assuming Mentors is the table for mentors
      key: 'id',
    },
  },
  dan: {
    type: DataTypes.STRING, // e.g., 'pon', 'uto', etc.
  },
  vrijeme: {
    type: DataTypes.STRING, // e.g., '10:00 AM'
  },
  predmet: {
    type: DataTypes.STRING, // Subject or topic
  },
  // Add other fields as necessary
});

// Define relationships if needed
Raspored.associate = (models) => {
  Raspored.belongsTo(models.User, { foreignKey: 'ucenikId' });
  Raspored.belongsTo(models.Mentor, { foreignKey: 'mentorId' });
};

module.exports = Raspored;