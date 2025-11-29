// controllers/reminderController.js
const Reminder = require('../models/Reminder');
const asyncHandler = require('express-async-handler'); // Assuming you use this middleware

// @desc    Create new reminder
// @route   POST /api/reminders
// @access  Private (Requires authMiddleware)
const createReminder = asyncHandler(async (req, res) => {
    // req.user.id is attached by your authMiddleware
    const { tankName, type, dueDateTime } = req.body;

    // Basic Validation
    if (!tankName || !type || !dueDateTime) {
        res.status(400);
        throw new Error('Please fill all required fields');
    }

    const reminder = await Reminder.create({
        user: req.user.id, // Link to the authenticated user
        tankName,
        type,
        dueDateTime: new Date(dueDateTime),
    });

    res.status(201).json(reminder);
});

// @desc    Get all reminders for logged-in user
// @route   GET /api/reminders
// @access  Private (Requires authMiddleware)
const getReminders = asyncHandler(async (req, res) => {
    // Only fetch reminders belonging to the authenticated user
    const reminders = await Reminder.find({ user: req.user.id })
        .sort({ dueDateTime: 1 }); // Sort by time, ascending

    res.status(200).json(reminders);
});

module.exports = {
    createReminder,
    getReminders,
};