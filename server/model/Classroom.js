const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Classroom = sequelize.define('Classroom', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  schoolId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Schools',
      key: 'id',
    },
  },
  // Other classroom fields...
});

// Define relationships
Classroom.associate = (models) => {
  Classroom.belongsTo(models.School, { foreignKey: 'schoolId' });
};

module.exports = Classroom;
