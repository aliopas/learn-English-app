import express from 'express';
import { getLessonByDay, completeLesson, saveLessonProgress } from '../controllers/lessonController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/:dayNumber', getLessonByDay);
router.post('/:dayNumber/complete', completeLesson);
router.post('/:dayNumber/save', saveLessonProgress);

export default router;
