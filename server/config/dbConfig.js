const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize connection to MySQL
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
});

module.exports = sequelize;
