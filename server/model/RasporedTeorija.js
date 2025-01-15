const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const RasporedTeorija = sequelize.define('RasporedTeorija', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  mentorId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Mentors', // Assuming Mentors is the table for mentors
      key: 'id',
    },
  },
  classroomId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Classrooms', // Assuming Classrooms is the table for classrooms
      key: 'id',
    },
  },
  day: {
    type: DataTypes.STRING, // e.g., 'pon', 'uto', etc.
  },
  time: {
    type: DataTypes.STRING, // e.g., '10:00 AM'
  },
  subject: {
    type: DataTypes.STRING, // Subject or topic
  },
  // Add other fields as necessary
});

// Define relationships if needed
RasporedTeorija.associate = (models) => {
  RasporedTeorija.belongsTo(models.Mentor, { foreignKey: 'mentorId' });
  RasporedTeorija.belongsTo(models.Classroom, { foreignKey: 'classroomId' });
};

module.exports = RasporedTeorija;