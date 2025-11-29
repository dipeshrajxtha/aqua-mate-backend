// routes/reminderRoutes.js
const express = require('express');
const router = express.Router();
const { createReminder, getReminders } = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware'); // Your authentication middleware

router.route('/').post(protect, createReminder).get(protect, getReminders);

module.exports = router;

// Don't forget to import this in your server.js:
// const reminderRoutes = require('./routes/reminderRoutes');
// app.use('/api/reminders', reminderRoutes);