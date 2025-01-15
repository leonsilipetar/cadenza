// models/program.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Program = sequelize.define('Program', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Add other fields as necessary
});

// Define relationships if needed
Program.associate = (models) => {
  Program.hasMany(models.User, { foreignKey: 'programId' }); // Assuming Users have a programId
  Program.hasMany(models.Mentor, { foreignKey: 'programId' }); // Assuming Mentors have a programId
};

module.exports = Program;
