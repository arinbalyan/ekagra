import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth';
import {
  startTimer,
  endTimer,
  getTimerHistory,
  getTimerStats
} from '../controllers/timer';

const router = express.Router();

// Validation middleware
const timerValidation = [
  body('type').isIn(['pomodoro', 'shortBreak', 'longBreak']).withMessage('Invalid timer type'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
  body('task').optional().isMongoId().withMessage('Invalid task ID')
];

// All routes are protected
router.use(protect);

// Routes
router.post('/start', timerValidation, startTimer);
router.post('/end/:id', endTimer);
router.get('/history', getTimerHistory);
router.get('/stats', getTimerStats);

export default router; 