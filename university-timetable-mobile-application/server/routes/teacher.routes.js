// routes/teacher.routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const {
  getPersonalTimetable,
  getPersonalWeekTimetable
} = require('../controllers/teacher/timetable.controller');

// Apply teacher role middleware to all routes
router.use(authenticate, requireRole('teacher'));

// Timetable access
router.post('/timetable', getPersonalTimetable);
router.post('/week_timetable', getPersonalWeekTimetable);

module.exports = router;