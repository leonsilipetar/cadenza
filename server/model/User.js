const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  korisnickoIme: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: DataTypes.STRING,
  isAdmin: DataTypes.BOOLEAN,
  isMentor: DataTypes.BOOLEAN,
  isStudent: DataTypes.BOOLEAN,
  oib: DataTypes.STRING,
  ime: DataTypes.STRING,
  prezime: DataTypes.STRING,
  brojMobitela: DataTypes.STRING,
  datumRodjenja: DataTypes.DATE,
  adresa: DataTypes.STRING,
});

// Define relationships
User.associate = (models) => {
  User.hasMany(models.Mentor, { foreignKey: 'userId' });
  User.hasMany(models.Schedule, { foreignKey: 'userId' });
  User.hasMany(models.Invoice, { foreignKey: 'userId' });
  User.hasMany(models.Notification, { foreignKey: 'userId' });
};

module.exports = User;
