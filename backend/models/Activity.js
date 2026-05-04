const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Activity = sequelize.define('Activity', {
  taskId: { type: DataTypes.INTEGER, allowNull: false },
  action: { type: DataTypes.STRING, allowNull: false },
  performedBy: { type: DataTypes.INTEGER, allowNull: false },
}, {
  timestamps: true,
});

module.exports = Activity;
