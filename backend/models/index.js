const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');
const Comment = require('./Comment');
const Activity = require('./Activity');

const initModels = () => {
  Project.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
  User.hasMany(Project, { as: 'ownedProjects', foreignKey: 'createdBy' });

  Project.belongsToMany(User, {
    through: 'ProjectMembers',
    as: 'teamMembers',
    foreignKey: 'projectId',
    otherKey: 'userId',
  });
  User.belongsToMany(Project, {
    through: 'ProjectMembers',
    as: 'projects',
    foreignKey: 'userId',
    otherKey: 'projectId',
  });

  Task.belongsTo(User, { as: 'assignedToUser', foreignKey: 'assignedTo' });
  User.hasMany(Task, { as: 'assignedTasks', foreignKey: 'assignedTo' });

  Task.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
  User.hasMany(Task, { as: 'createdTasks', foreignKey: 'createdBy' });

  Task.belongsTo(Project, { as: 'project', foreignKey: 'projectId' });
  Project.hasMany(Task, { as: 'tasks', foreignKey: 'projectId' });

  Comment.belongsTo(Task, { foreignKey: 'taskId' });
  Task.hasMany(Comment, { as: 'comments', foreignKey: 'taskId' });

  Comment.belongsTo(User, { foreignKey: 'userId' });
  User.hasMany(Comment, { as: 'comments', foreignKey: 'userId' });

  Activity.belongsTo(Task, { foreignKey: 'taskId' });
  Task.hasMany(Activity, { as: 'activities', foreignKey: 'taskId' });

  Activity.belongsTo(User, { as: 'actor', foreignKey: 'performedBy' });
  User.hasMany(Activity, { as: 'activities', foreignKey: 'performedBy' });
};

module.exports = { initModels, User, Project, Task, Comment, Activity };
