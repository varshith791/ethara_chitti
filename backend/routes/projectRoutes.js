const express = require('express');
const {
  createProject,
  getProjects,
  addTeamMember,
  removeTeamMember,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.route('/').get(getProjects).post(authorize('Admin'), createProject);
router.route('/:projectId/members').put(authorize('Admin'), addTeamMember).delete(authorize('Admin'), removeTeamMember);

module.exports = router;
