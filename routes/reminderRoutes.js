// routes/reminderRoutes.js
const express = require('express');
const router = express.Router();
const { createReminder, getReminders, deleteReminder } = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware'); // Your JWT protection middleware

// All routes here are automatically protected
router.route('/')
    .post(protect, createReminder)  // POST /api/reminders
    .get(protect, getReminders);    // GET  /api/reminders

router.route('/:id')
    .delete(protect, deleteReminder); // DELETE /api/reminders/:id

module.exports = router;