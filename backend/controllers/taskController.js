const Task = require('../models/Task');
const Project = require('../models/Project');
const Activity = require('../models/Activity');

const logActivity = async (taskId, action, performedBy) => {
  await Activity.create({ taskId, action, performedBy });
};

const createTask = async (req, res) => {
  const { title, description, assignedTo, dueDate, projectId } = req.body;
  if (!title || !projectId) {
    res.status(400);
    throw new Error('Title and project are required');
  }

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const task = await Task.create({
    title,
    description,
    assignedTo,
    dueDate,
    projectId,
    createdBy: req.user._id,
  });

  await logActivity(task._id, `Task created`, req.user._id);
  if (assignedTo) {
    await logActivity(task._id, `Assigned to ${assignedTo}`, req.user._id);
  }

  res.status(201).json(task);
};

const getTasks = async (req, res) => {
  const { status, search } = req.query;
  const query = {};

  if (req.user.role === 'Member') {
    query.$or = [{ assignedTo: req.user._id }];
  }

  if (status) {
    query.status = status;
  }

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  const tasks = await Task.find(query)
    .populate('assignedTo', 'name email')
    .populate('projectId', 'title')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });

  res.json(tasks);
};

const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('projectId', 'title description')
    .populate('createdBy', 'name email');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (req.user.role === 'Member' && task.assignedTo?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Access denied');
  }

  res.json(task);
};

const updateTask = async (req, res) => {
  const { title, description, assignedTo, status, dueDate } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const allowed = req.user.role === 'Admin' || task.assignedTo?.toString() === req.user._id.toString();
  if (!allowed) {
    res.status(403);
    throw new Error('You do not have permission to update this task');
  }

  if (assignedTo && assignedTo.toString() !== task.assignedTo?.toString()) {
    await logActivity(task._id, `Assigned to ${assignedTo}`, req.user._id);
  }

  if (status && status !== task.status) {
    await logActivity(task._id, `Status changed to ${status}`, req.user._id);
  }

  task.title = title || task.title;
  task.description = description !== undefined ? description : task.description;
  task.assignedTo = assignedTo || task.assignedTo;
  task.status = status || task.status;
  task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;

  await task.save();

  await logActivity(task._id, 'Task updated', req.user._id);
  res.json(task);
};

const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Only admins can delete tasks');
  }

  await task.remove();
  res.json({ message: 'Task deleted' });
};

const getTaskActivity = async (req, res) => {
  const activities = await Activity.find({ taskId: req.params.id })
    .populate('performedBy', 'name email')
    .sort({ createdAt: -1 });

  res.json(activities);
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask, getTaskActivity };
