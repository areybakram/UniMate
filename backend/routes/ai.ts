import { Router } from 'express';
import { extractCourses, transcribeLecture, saveLectureNotes } from '../controllers/aiController';

const router = Router();

// @route   POST /api/ai/extract-courses
// @desc    Analyze registration card and extract courses using Gemini AI
router.post('/extract-courses', extractCourses);

// @route   POST /api/ai/transcribe-lecture
// @desc    Transcribe and structure lecture notes from audio using Gemini AI
router.post('/transcribe-lecture', transcribeLecture);

// @route   POST /api/ai/save-lecture-notes
// @desc    Save generated lecture notes to database
router.post('/save-lecture-notes', saveLectureNotes);

export default router;
