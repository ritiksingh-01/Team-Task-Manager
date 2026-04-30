import express from 'express';
import { getMembers } from '../controllers/userController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, requireRole('Admin'), getMembers);

export default router;
