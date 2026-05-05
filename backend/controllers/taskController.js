const { Op } = require('sequelize');
const { Task, Project, Activity, User } = require('../models');

const logActivity = async (taskId, action, performedBy) => {
  await Activity.create({ taskId, action, performedBy });
};

const createTask = async (req, res) => {
  const { title, description, assignedTo, dueDate, projectId } = req.body;
  if (!title || !projectId) {
    res.status(400);
    throw new Error('Title and project are required');
  }

  const projectIdInt = parseInt(projectId);
  const assignedToInt = assignedTo ? parseInt(assignedTo) : null;

  if (isNaN(projectIdInt) || (assignedTo && isNaN(assignedToInt))) {
    res.status(400);
    throw new Error('Invalid project or assigned user ID');
  }

  const project = await Project.findByPk(projectIdInt);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const task = await Task.create({
    title,
    description,
    assignedTo: assignedToInt,
    dueDate,
    projectId: projectIdInt,
    createdBy: req.user.id,
  });

  await logActivity(task.id, 'Task created', req.user.id);
  if (assignedToInt) {
    const assignedUser = await User.findByPk(assignedToInt);
    await logActivity(task.id, `Assigned to ${assignedUser?.name || assignedToInt}`, req.user.id);
  }

  res.status(201).json(task);
};

const getTasks = async (req, res) => {
  const { status, search } = req.query;
  const where = {};

  if (req.user.role === 'Member') {
    const memberProjects = await req.user.getProjects({ attributes: ['id'] });
    const projectIds = memberProjects.map((project) => project.id);
    where.projectId = projectIds.length ? projectIds : 0;
  }

  if (status) {
    where.status = status;
  }

  if (search) {
    where.title = { [Op.iLike]: `%${search}%` };
  }

  const tasks = await Task.findAll({
    where,
    include: [
      { model: User, as: 'assignedToUser', attributes: ['id', 'name', 'email'] },
      { model: Project, as: 'project', attributes: ['id', 'title'] },
      { model: User, as: 'creator', attributes: ['id', 'name'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  res.json(tasks);
};

const getTaskById = async (req, res) => {
  const task = await Task.findByPk(req.params.id, {
    include: [
      { model: User, as: 'assignedToUser', attributes: ['id', 'name', 'email'] },
      { model: Project, as: 'project', attributes: ['id', 'title', 'description'] },
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
    ],
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (req.user.role === 'Member') {
    const memberProjects = await req.user.getProjects({ where: { id: task.projectId }, attributes: ['id'] });
    const allowed = task.assignedTo === req.user.id || memberProjects.length > 0;
    if (!allowed) {
      res.status(403);
      throw new Error('Access denied');
    }
  }

  res.json(task);
};

const updateTask = async (req, res) => {
  const { title, description, assignedTo, status, dueDate } = req.body;
  const taskId = parseInt(req.params.id);

  if (isNaN(taskId)) {
    res.status(400);
    throw new Error('Invalid task ID');
  }

  const task = await Task.findByPk(taskId);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const allowed = req.user.role === 'Admin' || task.assignedTo === req.user.id;
  if (!allowed) {
    res.status(403);
    throw new Error('You do not have permission to update this task');
  }

  const assignedToInt = assignedTo ? parseInt(assignedTo) : null;
  if (assignedTo && isNaN(assignedToInt)) {
    res.status(400);
    throw new Error('Invalid assigned user ID');
  }

  if (assignedToInt && assignedToInt !== task.assignedTo) {
    const assignedUser = await User.findByPk(assignedToInt);
    await logActivity(task.id, `Assigned to ${assignedUser?.name || assignedToInt}`, req.user.id);
  }

  if (status && status !== task.status) {
    await logActivity(task.id, `Status changed to ${status}`, req.user.id);
  }

  task.title = title || task.title;
  task.description = description !== undefined ? description : task.description;
  task.assignedTo = assignedToInt || task.assignedTo;
  task.status = status || task.status;
  task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;

  await task.save();

  await logActivity(task.id, 'Task updated', req.user.id);
  res.json(task);
};

const deleteTask = async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Only admins can delete tasks');
  }

  await Task.destroy({ where: { id: task.id } });
  res.json({ message: 'Task deleted' });
};

const getTaskActivity = async (req, res) => {
  const activities = await Activity.findAll({
    where: { taskId: req.params.id },
    include: [{ model: User, as: 'actor', attributes: ['id', 'name', 'email'] }],
    order: [['createdAt', 'DESC']],
  });

  res.json(activities);
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask, getTaskActivity };
