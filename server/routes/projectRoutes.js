import express from 'express';
import { createProject, getProjects, updateProjectMembers } from '../controllers/projectController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getProjects);
router.post('/', requireRole('Admin'), createProject);
router.put('/:id/members', requireRole('Admin'), updateProjectMembers);

export default router;
