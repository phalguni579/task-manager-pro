const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const {
  createTask,
  getMyTasks,
  getAssignedTasks,
  updateTaskStatus,
  getAllTasks,
  assignTask,
  deleteTask
} = require('../controllers/task.controller');

/**
 * USER ROUTES
 */
router.post('/', authMiddleware, createTask);
router.get('/my', authMiddleware, getMyTasks);
router.get('/assigned', authMiddleware, getAssignedTasks);
router.patch('/:id/status', authMiddleware, updateTaskStatus);

/**
 * MANAGER / ADMIN ROUTES
 */
router.patch(
  '/:id/assign',
  authMiddleware,
  roleMiddleware('manager', 'admin'),
  assignTask
);

/**
 * ADMIN ROUTES
 */
router.get(
  '/all',
  authMiddleware,
  roleMiddleware('admin'),
  getAllTasks
);

/**
 * OWNER / ADMIN ROUTE
 */
router.delete(
  '/:id',
  authMiddleware,
  deleteTask
);

module.exports = router;




