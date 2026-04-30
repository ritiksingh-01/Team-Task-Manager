import express from 'express';
import { createTask, getTasks, updateTask } from '../controllers/taskController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getTasks);
router.post('/', requireRole('Admin'), createTask);
router.put('/:id', updateTask);

export default router;
