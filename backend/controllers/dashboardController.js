const { Op } = require('sequelize');
const { Task, Project, User } = require('../models');

const getDashboardStats = async (req, res) => {
  let taskFilter = {};
  let projects = [];

  if (req.user.role === 'Member') {
    projects = await req.user.getProjects({
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'teamMembers', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
      ],
    });

    const projectIds = projects.map((project) => project.id);
    taskFilter.projectId = projectIds.length ? projectIds : 0;
  } else {
    projects = await Project.findAll({
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'teamMembers', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  const now = new Date();
  const totalTasks = await Task.count({ where: taskFilter });
  const completedTasks = await Task.count({ where: { ...taskFilter, status: 'Completed' } });
  const pendingTasks = await Task.count({ where: { ...taskFilter, status: 'Pending' } });
  const overdueTasks = await Task.count({
    where: {
      ...taskFilter,
      dueDate: { [Op.lt]: now },
      status: { [Op.ne]: 'Completed' },
    },
  });

  res.json({
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    projects,
  });
};

module.exports = { getDashboardStats };
