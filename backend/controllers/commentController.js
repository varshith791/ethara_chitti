const { Comment, Task, User } = require('../models');

const addComment = async (req, res) => {
  const { taskId, text } = req.body;
  if (!taskId || !text) {
    res.status(400);
    throw new Error('Task ID and text are required');
  }

  const task = await Task.findByPk(taskId);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const comment = await Comment.create({
    taskId,
    userId: req.user.id,
    text,
  });

  const response = await Comment.findByPk(comment.id, {
    include: [{ model: User, attributes: ['id', 'name', 'email'] }],
  });

  res.status(201).json(response);
};

const getCommentsByTask = async (req, res) => {
  const { taskId } = req.params;

  const comments = await Comment.findAll({
    where: { taskId },
    include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    order: [['createdAt', 'DESC']],
  });

  res.json(comments);
};

module.exports = { addComment, getCommentsByTask };
