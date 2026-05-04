const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
  {
    taskId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Task' },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
