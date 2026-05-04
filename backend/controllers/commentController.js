const Comment = require('../models/Comment');
const Task = require('../models/Task');

const addComment = async (req, res) => {
  const { taskId, text } = req.body;
  if (!taskId || !text) {
    res.status(400);
    throw new Error('Task ID and text are required');
  }

  const task = await Task.findById(taskId);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const comment = await Comment.create({
    taskId,
    userId: req.user._id,
    text,
  });

  res.status(201).json(comment);
};

const getCommentsByTask = async (req, res) => {
  const { taskId } = req.params;

  const comments = await Comment.find({ taskId })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  res.json(comments);
};

module.exports = { addComment, getCommentsByTask };
