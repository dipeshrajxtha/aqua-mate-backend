// routes/reminderRoutes.js

const express = require('express');
const router = express.Router();

// Import controller functions
const reminderController = require('../controllers/reminderController');

// Import authentication middleware
const { protect } = require('../middleware/authMiddleware');

// Define routes for Reminders.
// Both endpoints require authentication via the 'protect' middleware.

// POST /api/reminders 
// Create a new reminder
router.post('/', protect, reminderController.createReminder);

// GET /api/reminders
// Get all reminders for the authenticated user
router.get('/', protect, reminderController.getReminders);

module.exports = router;