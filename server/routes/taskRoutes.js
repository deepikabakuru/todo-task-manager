const express = require('express');
const {
  getUserTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  searchTasks,
  getDueTodayTasks,
  getTaskStats,
} = require('../controllers/taskController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/search', searchTasks);
router.get('/due-today', getDueTodayTasks);
router.get('/stats', getTaskStats);
router.post('/', createTask);
router.get('/', getUserTasks);
router.patch('/:id/complete', toggleTaskComplete);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
