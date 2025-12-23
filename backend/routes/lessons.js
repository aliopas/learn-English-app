import express from 'express';
import { getLessonByDay, completeLesson, saveLessonProgress, getGameVocabulary, getAvailableLessons, getLessonsBatch } from '../controllers/lessonController.js';
import { getBulkInitialData } from '../controllers/bulkDataController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Bulk data endpoint (must be before :dayNumber route)
router.get('/bulk/initial-data', getBulkInitialData);

router.post('/batch', getLessonsBatch);
router.get('/available', getAvailableLessons); // Get all available lessons
router.get('/vocabulary/game', getGameVocabulary); // Specific route first
router.get('/:dayNumber', getLessonByDay);
router.post('/:dayNumber/complete', completeLesson);
router.post('/:dayNumber/save', saveLessonProgress);

export default router;
