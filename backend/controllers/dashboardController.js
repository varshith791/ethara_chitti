const Task = require('../models/Task');
const Project = require('../models/Project');

const getDashboardStats = async (req, res) => {
  let taskFilter = {};
  if (req.user.role === 'Member') {
    taskFilter.assignedTo = req.user._id;
  }

  const now = new Date();
  const totalTasks = await Task.countDocuments(taskFilter);
  const completedTasks = await Task.countDocuments({ ...taskFilter, status: 'Completed' });
  const pendingTasks = await Task.countDocuments({ ...taskFilter, status: 'Pending' });
  const overdueTasks = await Task.countDocuments({
    ...taskFilter,
    dueDate: { $lt: now },
    status: { $ne: 'Completed' },
  });

  const projects = await Project.find(req.user.role === 'Member' ? { teamMembers: req.user._id } : {})
    .populate('teamMembers', 'name email')
    .populate('createdBy', 'name email');

  res.json({
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    projects,
  });
};

module.exports = { getDashboardStats };
