const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  visibility: DataTypes.STRING,
  mentorId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Mentors',
      key: 'id',
    },
  },
});

// Define relationships
Post.associate = (models) => {
  Post.belongsTo(models.Mentor, { foreignKey: 'mentorId' });
};

module.exports = Post;
