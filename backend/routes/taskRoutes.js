const express = require('express');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskActivity,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.route('/').get(getTasks).post(authorize('Admin'), createTask);
router.route('/:id').get(getTaskById).put(updateTask).delete(authorize('Admin'), deleteTask);
router.route('/:id/activity').get(getTaskActivity);

module.exports = router;
