const express = require('express');
const { addComment, getCommentsByTask } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.route('/').post(addComment);
router.route('/task/:taskId').get(getCommentsByTask);

module.exports = router;
