import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  updateTaskStatus
} from '../controllers/tasks';

const router = express.Router();

// Validation middleware
const taskValidation = [
  body('title').notEmpty().withMessage('Task title is required'),
  body('category').notEmpty().withMessage('Task category is required'),
  body('priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority level'),
  body('estimatedPomodoros').isInt({ min: 1 }).withMessage('Estimated pomodoros must be at least 1')
];

// All routes are protected
router.use(protect);

// Routes
router.post('/', taskValidation, createTask);
router.get('/', getTasks);
router.get('/:id', getTask);
router.patch('/:id', taskValidation, updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/status', updateTaskStatus);

export default router; 