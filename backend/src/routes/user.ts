import express from 'express';
import { protect } from '../middleware/auth';
import { getMe, updatePreferences } from '../controllers/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.get('/me', getMe);
router.patch('/preferences', updatePreferences);

export default router; 