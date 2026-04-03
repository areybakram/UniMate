import { Router } from 'express';
import { getFullSchedule, getBatchTimetable, getFreeSlots, getPersonalizedTimetable, getAvailableBatches } from '../controllers/timetableController';

const router = Router();

// @route   GET /api/timetable/batches
// @desc    Get all unique batch codes
router.get('/batches', getAvailableBatches);

// @route   GET /api/timetable/full
// @desc    Get the entire parsed timetable
router.get('/full', getFullSchedule);

// @route   GET /api/timetable/batch/:batchCode
// @desc    Get filtered results for a specific batch
router.get('/batch/:batchCode', getBatchTimetable);

// @route   GET /api/timetable/free-slots
// @desc    Calculate and return free slots for all tables
router.get('/free-slots', getFreeSlots);

// @route   POST /api/timetable/personalized
// @desc    Get filtered results for a specific set of courses
router.post('/personalized', getPersonalizedTimetable);

export default router;
