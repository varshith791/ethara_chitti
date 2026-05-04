const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Comment = sequelize.define('Comment', {
  taskId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  text: { type: DataTypes.TEXT, allowNull: false },
}, {
  timestamps: true,
});

module.exports = Comment;
