// controllers/reminderController.js
const Reminder = require('../models/Reminder');
const asyncHandler = require('express-async-handler');

// @desc    Create a new reminder
// @route   POST /api/reminders
// @access  Private
const createReminder = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    
    // Expecting tankName, type (enum string), and dueDateTime (ISO string)
    const { tankName, type, dueDateTime } = req.body; 
    
    if (!tankName || !type || !dueDateTime) {
        res.status(400);
        throw new Error('Please provide the tank name, type, and scheduled date/time.');
    }

    const newReminder = await Reminder.create({
        user: userId,
        tankName,
        type,
        dueDateTime: new Date(dueDateTime) // Converts ISO string to Date object
    });

    res.status(201).json({ success: true, data: newReminder });
});

// @desc    Get all reminders
// @route   GET /api/reminders
// @access  Private
const getReminders = asyncHandler(async (req, res) => {
    const reminders = await Reminder.find({ user: req.user.id })
        .sort({ dueDateTime: 1 }); // Sort by time, ascending

    res.status(200).json({ success: true, data: reminders });
});

// @desc    Delete a reminder (Mark as complete)
// @route   DELETE /api/reminders/:id
// @access  Private
const deleteReminder = asyncHandler(async (req, res) => {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
        res.status(404);
        throw new Error('Reminder not found.');
    }

    if (reminder.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to delete this reminder.');
    }
    
    await reminder.deleteOne();

    res.status(200).json({ success: true, data: { id: req.params.id } });
});

module.exports = {
    createReminder,
    getReminders,
    deleteReminder,
};