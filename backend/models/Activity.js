const mongoose = require('mongoose');

const activitySchema = mongoose.Schema(
  {
    taskId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Task' },
    action: { type: String, required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
