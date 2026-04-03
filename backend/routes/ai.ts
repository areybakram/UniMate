import { Router } from 'express';
import { extractCourses } from '../controllers/aiController';

const router = Router();

// @route   POST /api/ai/extract-courses
// @desc    Analyze registration card and extract courses using Gemini AI
router.post('/extract-courses', extractCourses);

export default router;
